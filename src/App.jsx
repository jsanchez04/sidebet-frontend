import { useState, useEffect } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [markets, setMarkets] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  async function loadData() {
    try {
      const [marketsRes, usersRes] = await Promise.all([
        fetch(`${API}/markets`),
        fetch(`${API}/users`),
      ]);
      setMarkets(await marketsRes.json());
      setUsers(await usersRes.json());
      setError(null);
    } catch (e) {
      setError('Could not reach the backend. Is it running on port 8080?');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const leaderboard = [...users].sort((a, b) => b.pointsBalance - a.pointsBalance);

  return (
      <div className="app">
        <header>
          <h1>Sidebet</h1>
          <p className="tagline">A prediction market for your friends. Points, not money.</p>
          <button onClick={loadData}>Refresh</button>
        </header>

        {error && <div className="error">{error}</div>}

        <div className="columns">
          <section>
            <h2>Markets</h2>
            {markets.length === 0 && <p className="empty">No markets yet.</p>}
            {markets.map((m) => (
                <div key={m.id} className="market-card">
                  <div className="market-question">{m.question}</div>
                  <span className="market-status">{m.status}</span>
                </div>
            ))}
          </section>

          <section>
            <h2>Leaderboard</h2>
            {leaderboard.map((u, i) => (
                <div key={u.id} className="leader-row">
                  <span className="rank">{i + 1}</span>
                  <span className="name">{u.username}</span>
                  <span className="points">{u.pointsBalance}</span>
                </div>
            ))}
          </section>
        </div>
      </div>
  );
}

export default App;