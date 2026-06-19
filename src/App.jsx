import { useState, useEffect } from 'react';
import './App.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function App() {
  const [markets, setMarkets] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});       // marketId -> {yesStake, noStake, totalStake}
  const [error, setError] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  async function loadData() {
    try {
      const [marketsRes, usersRes] = await Promise.all([
        fetch(`${API}/markets`),
        fetch(`${API}/users`),
      ]);
      const marketsData = await marketsRes.json();
      const usersData = await usersRes.json();
      setMarkets(marketsData);
      setUsers(usersData);
      if (usersData.length > 0 && !selectedUserId) {
        setSelectedUserId(String(usersData[0].id));
      }
      // Fetch stake stats for every market
      const statsEntries = await Promise.all(
        marketsData.map(async (m) => {
          const res = await fetch(`${API}/markets/${m.id}/stats`);
          return [m.id, await res.json()];
        })
      );
      setStats(Object.fromEntries(statsEntries));
      setError(null);
    } catch (e) {
      setError('Could not reach the backend.');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function createMarket() {
    if (!newQuestion.trim()) return;
    await fetch(`${API}/markets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: newQuestion, creatorId: Number(selectedUserId) }),
    });
    setNewQuestion('');
    loadData();
  }

  async function placeWager(marketId, side) {
    const stake = Number(prompt(`How many points to stake on ${side}?`, '100'));
    if (!stake || stake <= 0) return;
    const res = await fetch(`${API}/wagers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketId, userId: Number(selectedUserId), side, stake }),
    });
    if (!res.ok) {
      const msg = await res.text();
      alert('Could not place wager: ' + msg);
      return;
    }
    loadData();
  }

  async function resolveMarket(marketId, outcome) {
    if (!confirm(`Resolve this market as ${outcome}? This pays out and closes it.`)) return;
    await fetch(`${API}/markets/${marketId}/resolve?outcome=${outcome}`, { method: 'POST' });
    loadData();
  }

  const leaderboard = [...users].sort((a, b) => b.pointsBalance - a.pointsBalance);
  const currentUser = users.find((u) => String(u.id) === selectedUserId);

  return (
    <div className="app">
      <header>
        <h1>Sidebet</h1>
        <p className="tagline">A prediction market for your friends. Points, not money.</p>
        <div className="toolbar">
          <label>
            Acting as:{' '}
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.username} ({u.pointsBalance} pts)</option>
              ))}
            </select>
          </label>
          <button onClick={loadData}>Refresh</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="create-market">
        <input
          type="text"
          placeholder="Ask a question, e.g. Will it rain Saturday?"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <button onClick={createMarket}>Create market</button>
      </div>

      <div className="columns">
        <section>
          <h2>Markets</h2>
          {markets.length === 0 && <p className="empty">No markets yet.</p>}
          {markets.map((m) => {
            const s = stats[m.id] || { yesStake: 0, noStake: 0, totalStake: 0 };
            const yesPct = s.totalStake > 0 ? Math.round((s.yesStake / s.totalStake) * 100) : 50;
            const isOpen = m.status === 'OPEN';
            return (
              <div key={m.id} className="market-card">
                <div className="market-question">{m.question}</div>
                <span className={`market-status status-${m.status}`}>{m.status}</span>

                <div className="chance-bar">
                  <div className="chance-fill" style={{ width: `${yesPct}%` }} />
                </div>
                <div className="chance-label">
                  <span>YES {yesPct}%</span>
                  <span>NO {100 - yesPct}%</span>
                </div>

                {isOpen ? (
                  <div className="market-actions">
                    <button className="btn-yes" onClick={() => placeWager(m.id, 'YES')}>Bet YES</button>
                    <button className="btn-no" onClick={() => placeWager(m.id, 'NO')}>Bet NO</button>
                    <button className="btn-resolve" onClick={() => resolveMarket(m.id, 'YES')}>Resolve YES</button>
                    <button className="btn-resolve" onClick={() => resolveMarket(m.id, 'NO')}>Resolve NO</button>
                  </div>
                ) : (
                  <div className="resolved-note">Resolved: {m.status}</div>
                )}
              </div>
            );
          })}
        </section>

        <section>
          <h2>Leaderboard</h2>
          {leaderboard.map((u, i) => (
            <div key={u.id} className={`leader-row ${currentUser && u.id === currentUser.id ? 'me' : ''}`}>
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
