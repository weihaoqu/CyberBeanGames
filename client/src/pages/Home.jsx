import { Link } from "react-router-dom";
import GameCard from "../components/GameCard";
import games from "../data/games";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-glow" />
        <h1 className="hero-title">
          <span className="title-cyber">CYBER</span>
          <span className="title-bean">BEAN</span>
          <span className="title-games">GAMES</span>
        </h1>
        <p className="hero-subtitle">
          CYBERSECURITY TRAINING ARCADE
        </p>
        <div className="hero-line" />
        <p className="hero-desc">
          Play. Learn. Defend. — 6 interactive cybersecurity games built by students.
        </p>
      </section>

      <section className="games-section">
        <div className="section-header">
          <span className="section-accent" />
          <h2>SELECT GAME</h2>
          <span className="section-accent" />
        </div>
        <div className="games-grid">
          {games.map((game) => (
            <Link
              key={game.slug}
              to={`/game/${game.slug}`}
              className="game-link"
            >
              <GameCard game={game} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
