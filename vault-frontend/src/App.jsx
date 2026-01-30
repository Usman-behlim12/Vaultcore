import { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, CreditCard, DollarSign, LogOut, RefreshCw, Send, Shield, User } from 'lucide-react';

const API_URL = "http://localhost:8080/api";

function App() {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  // Login States
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) refreshData();
    const interval = setInterval(() => { if (user) refreshData() }, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const refreshData = async () => {
    try {
      const balRes = await axios.get(`${API_URL}/balance/${user}`);
      setBalance(balRes.data.balance);
      const histRes = await axios.get(`${API_URL}/history/${user}`);
      setHistory(histRes.data);
    } catch (e) { console.error(e); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { username: loginUser, password: loginPass });
      localStorage.setItem("username", res.data.username);
      setUser(res.data.username);
    } catch (err) { alert("Access Denied: Invalid Credentials"); }
    setLoading(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/transfer`, { from: user, to: recipient, amount: amount });
      alert("Transaction Committed Successfully");
      setAmount(""); setRecipient("");
      refreshData();
    } catch (err) { alert("Transaction Failed: " + err.response.data); }
  };

  const logout = () => { localStorage.clear(); setUser(null); window.location.reload(); };

  // --- 1. PRO LOGIN SCREEN (Terminal Style) ---
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0f1c] text-slate-300 font-sans">
        <div className="w-[450px] p-10 bg-[#111827] rounded-xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>

          <div className="flex justify-center mb-8">
            <div className="h-16 w-16 bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/30">
              <Shield className="h-8 w-8 text-cyan-400" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">VAULT<span className="text-cyan-400">CORE</span></h1>
          <p className="text-slate-500 text-center text-sm mb-8 tracking-wider uppercase">Secure Banking Gateway v2.4</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Identity</label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input className="w-full pl-10 pr-4 py-3 bg-[#0a0f1c] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  placeholder="Username" value={loginUser} onChange={e => setLoginUser(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Security Key</label>
              <div className="relative mt-1">
                <Shield className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input className="w-full pl-10 pr-4 py-3 bg-[#0a0f1c] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                  type="password" placeholder="Password" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
              </div>
            </div>

            <button disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold p-3 rounded-lg shadow-lg shadow-cyan-900/20 transition-all flex justify-center items-center gap-2 mt-4">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "AUTHENTICATE"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between text-xs text-slate-600">
            <span>ENCRYPTION: AES-256</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> SYSTEM OPERATIONAL</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. PRO DASHBOARD (Fintech View) ---
  return (
    <div className="flex h-screen bg-[#050b14] text-slate-300 font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0a0f1c] border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="h-8 w-8 bg-cyan-600 rounded flex items-center justify-center font-bold text-white">V</div>
          <span className="text-xl font-bold text-white tracking-tight">VAULTCORE</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <div className="px-4 py-3 bg-cyan-900/20 text-cyan-400 rounded-lg border border-cyan-500/30 flex items-center gap-3 font-medium cursor-pointer">
            <Activity className="h-5 w-5" /> Dashboard
          </div>
          <div className="px-4 py-3 text-slate-500 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-3 font-medium cursor-pointer">
            <CreditCard className="h-5 w-5" /> Cards & Assets
          </div>
          <div className="px-4 py-3 text-slate-500 hover:bg-slate-800 hover:text-white rounded-lg transition flex items-center gap-3 font-medium cursor-pointer">
            <Shield className="h-5 w-5" /> Security Audit
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500"></div>
            <div>
              <div className="text-sm font-bold text-white">{user}</div>
              <div className="text-xs text-emerald-500">● Online</div>
            </div>
          </div>
          <button onClick={logout} className="w-full py-2 bg-slate-800 hover:bg-red-900/30 hover:text-red-400 hover:border-red-900/50 border border-transparent rounded-md text-xs font-bold transition flex items-center justify-center gap-2">
            <LogOut className="h-3 w-3" /> TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Header */}
        <header className="h-16 bg-[#0a0f1c]/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8">
          <h2 className="text-lg font-medium text-white">Financial Overview</h2>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-cyan-400 border border-slate-700">US-EAST-1</span>
            <span className="px-3 py-1 bg-slate-800 rounded text-xs font-mono text-emerald-400 border border-slate-700">LIVE SYNC</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">

          {/* STATS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <div className="col-span-2 bg-[#0a0f1c] p-6 rounded-xl border border-slate-800 relative group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
                <DollarSign className="h-32 w-32 text-cyan-500" />
              </div>
              <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Total Liquidity</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-mono font-bold text-white tracking-tight">${balance.toLocaleString()}</span>
                <span className="text-sm text-slate-500 font-mono">USD</span>
              </div>
              <div className="mt-6 flex gap-4">
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm font-mono flex items-center gap-2">
                  <Activity className="h-4 w-4" /> +2.4% Yield
                </div>
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 text-sm font-mono">
                  ACCT: **** 8829
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-[#0a0f1c] p-6 rounded-xl border border-cyan-500/20 flex flex-col justify-center items-center text-center">
              <div className="h-16 w-16 bg-cyan-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-cyan-500/30 animate-pulse-slow">
                <Send className="h-8 w-8 text-black ml-1" />
              </div>
              <h3 className="text-white font-bold text-lg">Instant Transfer</h3>
              <p className="text-sm text-slate-400 mt-2">Cross-border payments via Virtual Threads</p>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

            {/* TRANSFER FORM */}
            <div className="bg-[#0a0f1c] p-6 rounded-xl border border-slate-800">
              <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <span className="h-2 w-2 bg-cyan-500 rounded-full"></span> Initiate Transaction
              </h3>

              <form onSubmit={handleTransfer} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Beneficiary ID</label>
                  <input className="w-full p-3 bg-[#050b14] border border-slate-700 rounded-lg text-white focus:border-cyan-500 transition font-mono"
                    placeholder="username" value={recipient} onChange={e => setRecipient(e.target.value)} required />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500">$</span>
                    <input type="number" className="w-full pl-8 p-3 bg-[#050b14] border border-slate-700 rounded-lg text-white focus:border-cyan-500 transition font-mono text-lg font-bold"
                      placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
                  </div>
                </div>

                <button className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold p-4 rounded-lg shadow-lg shadow-cyan-900/20 transition-all flex justify-center items-center gap-2 mt-4">
                  AUTHORIZE TRANSFER <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-800 text-xs text-slate-500">
                <p className="mb-2 font-bold text-slate-400">SECURITY PROTOCOLS:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Double-Entry Ledger Enforcement</li>
                  <li>ACID Compliant (Serializable Isolation)</li>
                  <li>Fraud Detection Middleware Active</li>
                </ul>
              </div>
            </div>

            {/* HISTORY TABLE */}
            <div className="col-span-2 bg-[#0a0f1c] p-0 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold">Ledger History</h3>
                <button onClick={refreshData} className="p-2 hover:bg-slate-800 rounded-lg transition text-slate-400"><RefreshCw className="h-4 w-4" /></button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#111827] text-slate-500 font-bold uppercase text-xs sticky top-0">
                    <tr>
                      <th className="p-4">Status</th>
                      <th className="p-4">Type</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {history.map((txn) => (
                      <tr key={txn.id} className="hover:bg-slate-800/50 transition cursor-default">
                        <td className="p-4">
                          <span className="px-2 py-1 rounded text-xs font-bold border bg-emerald-500/10 border-emerald-500/20 text-emerald-500">
                            COMMITTED
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-300">
                          {txn.type === 'CREDIT' ? 'INBOUND' : 'OUTBOUND'}
                        </td>
                        <td className={`p-4 text-right font-mono font-bold text-lg ${txn.type === 'CREDIT' ? 'text-emerald-400' : 'text-white'}`}>
                          {txn.type === 'CREDIT' ? '+' : '-'}${txn.amount}
                        </td>
                        <td className="p-4 text-right text-slate-500 font-mono text-xs">
                          {new Date(txn.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr><td colSpan="4" className="p-8 text-center text-slate-600">No transaction records found in ledger.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default App;