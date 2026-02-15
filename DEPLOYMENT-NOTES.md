# CyberBeanGames Deployment Notes

Feedback for the AWS Deploy Skill — real-world deployment session on Feb 11, 2026.

## Project Overview

- **Stack**: Express server + Vite React frontend + 6 embedded games (mix of React apps and static HTML)
- **Architecture**: Multi-stage Docker build (3 React apps built in Docker, 4 static games copied in), Caddy reverse proxy, single EC2 instance
- **Domain**: cyberbeangames.com (GoDaddy → transferred to Route 53)

## What Went Smoothly

1. **Pre-flight check** — Git repo was already on GitHub, `.gitignore` had `.env` covered, AWS CLI was configured. Phase 1 took ~2 minutes.
2. **EC2 provisioning** — Security group, key pair reuse, instance launch, Elastic IP — all automated via CLI. Worked first try.
3. **Docker setup on EC2** — Installing Docker, adding swap, cloning repo — clean script, no issues.
4. **Caddy + HTTPS** — Once DNS was working, Caddy provisioned Let's Encrypt certs in ~2 seconds. Fully automatic.
5. **CI/CD setup** — GitHub Actions + `appleboy/ssh-action` + `gh secret set` worked perfectly. Push-to-deploy in one step.

## Issues Encountered

### Issue 1: Missing lock files in git

**Problem**: `cyberanalyst/package-lock.json` wasn't tracked in git (the sub-project's `.gitignore` excluded it). Docker build failed with `COPY cyberanalyst/package-lock.json ./: not found`.

**Fix**: `git add -f cyberanalyst/package-lock.json` to force-add despite `.gitignore`.

**Skill suggestion**: Phase 2 (Containerize) should scan all sub-project `.gitignore` files and verify that `package-lock.json` / `yarn.lock` / `pnpm-lock.yaml` files are tracked in git before generating the Dockerfile. If a lock file exists locally but is gitignored, flag it. The Docker build on EC2 clones from git, so anything not committed won't exist there.

### Issue 2: Multi-app project with separate build steps

**Problem**: The project has 3 React apps that each need building (client, cyberanalyst, PhishTank) plus static games that just need copying. The server references all of them via relative paths from a ROOT directory.

**Fix**: Multi-stage Dockerfile with parallel build stages:
```
Stage 1: Build client (Vite)
Stage 2: Build cyberanalyst (CRA/react-scripts)
Stage 3: Build PhishTank (Vite + TypeScript)
Stage 4: Production — copy all builds + static files + server
```

**Skill suggestion**: The skill's stack detection (Phase 2) assumes a single app. It should detect monorepo / multi-app structures by scanning for multiple `package.json` files at different directory levels. When found, suggest a multi-stage build automatically.

### Issue 3: Sub-app asset paths broken when served under subpath

**Problem**: CyberAnalyst (CRA) and PhishTank (Vite) were built with root-relative asset paths (`/static/js/main.js`) but served under `/games/cyberanalyst/` and `/games/PhishTank/`. Browsers couldn't find the JS/CSS bundles.

**Fix**:
- CyberAnalyst: Added `"homepage": "/games/cyberanalyst"` to `package.json`
- PhishTank: Added `base: '/games/PhishTank/'` to `vite.config.ts`

**Skill suggestion**: This is a pre-existing bug in the project, not a deployment issue per se. But the Phase 2 readiness check could detect when apps are served under a subpath (by checking the Express routes) and verify the build configs match. A mismatch between the serving path and the build's public URL is a very common deployment gotcha.

### Issue 4: GoDaddy domain parking hijacking DNS (MAJOR)

**Problem**: After setting the correct A record in GoDaddy DNS, the domain still resolved to GoDaddy's parking IPs (`13.248.243.5`, `76.223.105.230`) instead of our EC2 IP. GoDaddy's "Websites + Marketing" / "Coming Soon" page was intercepting all traffic at a level ABOVE DNS records. The A record was correct, public DNS servers returned the right IP, but GoDaddy's nameservers were routing traffic to their own servers internally.

**Impact**: This was the biggest time sink of the entire deployment (~30 minutes of debugging). `curl` from the EC2 server worked, `dig @8.8.8.8` showed the right IP, but no browser on any computer could reach the site.

**Root cause**: GoDaddy's "Coming Soon Site" feature (auto-generated via GoDaddy Airo) hijacks domain traffic at the nameserver level. Even with a correct A record, their nameservers route traffic through their own infrastructure when a Website product is attached to the domain. There is no obvious "delete" or "unpublish" button for this feature.

**Fix**: Abandoned GoDaddy nameservers entirely. Created an AWS Route 53 hosted zone, added A + CNAME records there, and changed nameservers in GoDaddy from `ns21/ns22.domaincontrol.com` to AWS Route 53 nameservers.

**Skill suggestion**: This is a critical gotcha that the skill should warn about prominently in Phase 5. Suggested additions:

1. **Add a GoDaddy-specific warning**: "If your domain is registered with GoDaddy, check for and disable any 'Coming Soon', 'Parking', or 'Website Builder' products attached to your domain. These override your DNS A record at the nameserver level."

2. **Recommend Route 53 nameservers by default**: When the user has a domain on GoDaddy (or any registrar with aggressive parking), proactively suggest creating a Route 53 hosted zone and switching nameservers rather than relying on the registrar's DNS. This avoids the parking page problem entirely and gives full DNS control.

3. **Add a DNS verification step**: After setting DNS records, the skill should verify that the domain actually resolves to the expected IP from multiple vantage points (not just `dig`). Something like `curl -s -H "Host: domain.com" http://<elastic-ip>` to verify the server responds correctly, AND `curl -sL https://domain.com` to verify end-to-end resolution.

### Issue 5: Caddy domain-only config broke IP access

**Problem**: When updating the Caddyfile from `:80 { ... }` to `cyberbeangames.com { ... }`, Caddy stopped serving requests to the bare IP address. Users who hadn't gotten DNS propagation yet (or who were blocked by GoDaddy parking) couldn't access the site at all.

**Fix**: Added a fallback `:80` block to the Caddyfile alongside the domain block.

**Skill suggestion**: Phase 5 should ALWAYS keep the `:80` IP fallback when adding a domain to the Caddyfile. The generated Caddyfile should look like:
```
yourdomain.com, www.yourdomain.com {
    reverse_proxy app:3000
}

# Fallback for direct IP access
:80 {
    reverse_proxy app:3000
}
```

### Issue 6: t2.micro insufficient for multi-stage Docker builds

**Problem**: Building 3 React apps in Docker requires significant memory. A t2.micro (1GB RAM) would likely OOM during concurrent npm installs.

**Fix**: Used t2.small (2GB RAM) + 2GB swap. Builds completed successfully but were memory-intensive.

**Skill suggestion**: Phase 3 should assess build complexity. If the Dockerfile has multiple build stages or the project has multiple `npm install` steps, recommend t2.small instead of t2.micro and always include swap setup.

## Final Architecture

```
                    ┌─────────────────────────────────┐
                    │  Route 53 (DNS)                  │
                    │  cyberbeangames.com → 54.81.x.x  │
                    └──────────────┬──────────────────┘
                                   │
                    ┌──────────────▼──────────────────┐
                    │  EC2 (t2.small, us-east-1)       │
                    │                                   │
                    │  ┌─────────┐    ┌─────────────┐  │
                    │  │  Caddy  │───▶│  Express     │  │
                    │  │  :80    │    │  :3001       │  │
                    │  │  :443   │    │              │  │
                    │  └─────────┘    │  ├─client/   │  │
                    │                  │  ├─games/    │  │
                    │                  │  ├─analyst/  │  │
                    │                  │  └─phishtank/│  │
                    │                  └─────────────┘  │
                    └───────────────────────────────────┘

GitHub Actions: push to main → SSH → git pull → docker compose up --build
```

## Timeline

| Phase | Time | Notes |
|-------|------|-------|
| Pre-flight | ~2 min | Everything was already set up |
| Containerize | ~5 min | Multi-stage Dockerfile generation |
| AWS Setup | ~3 min | Reused existing key pair |
| Deploy | ~5 min | Including Docker install + build |
| Domain + HTTPS | ~30 min | GoDaddy parking page nightmare |
| CI/CD | ~2 min | GitHub Actions + secrets |
| **Total** | **~47 min** | **~17 min without GoDaddy issues** |
