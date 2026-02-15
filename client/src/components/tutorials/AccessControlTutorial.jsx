import TutorialWrapper from "./TutorialWrapper";

function AccessControlTutorial({ game, onStart }) {
  return (
    <TutorialWrapper game={game} onStart={onStart}>
      <div className="tutorial-matrix">
        <table>
          <thead>
            <tr>
              <th>Permission</th>
              <th>Intern</th>
              <th>Employee</th>
              <th>Manager</th>
              <th>Admin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Read Public Files</td>
              <td><span className="check">✓</span></td>
              <td><span className="check">✓</span></td>
              <td><span className="check">✓</span></td>
              <td><span className="check">✓</span></td>
            </tr>
            <tr>
              <td>Edit Documents</td>
              <td><span className="cross">✗</span></td>
              <td><span className="check">✓</span></td>
              <td><span className="check">✓</span></td>
              <td><span className="check">✓</span></td>
            </tr>
            <tr>
              <td>Access Financials</td>
              <td><span className="cross">✗</span></td>
              <td><span className="cross">✗</span></td>
              <td><span className="check">✓</span></td>
              <td><span className="check">✓</span></td>
            </tr>
            <tr>
              <td>Manage Users</td>
              <td><span className="cross">✗</span></td>
              <td><span className="cross">✗</span></td>
              <td><span className="cross">✗</span></td>
              <td><span className="check">✓</span></td>
            </tr>
            <tr>
              <td>Delete Backups</td>
              <td><span className="cross">✗</span></td>
              <td><span className="cross">✗</span></td>
              <td><span className="cross">✗</span></td>
              <td><span className="cross">✗</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </TutorialWrapper>
  );
}

export default AccessControlTutorial;
