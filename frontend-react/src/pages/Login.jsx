import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [lit, setLit] = useState(false);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      mode === 'login' ? await login(form.email, form.password) : await register(form);
      navigate('/');
    } catch (err) { setError(err.message); }
  };

  return (
    <div className={'lamp-scene' + (lit ? ' lit' : '')}>
      <div className="lamp-side">
        <button className="lamp-btn" onClick={() => setLit(!lit)} aria-pressed={lit}
          aria-label={lit ? 'Switch off the grow light' : 'Switch on the grow light'}>
          <svg viewBox="0 0 260 420" aria-hidden="true">
            <line x1="130" y1="0" x2="130" y2="70" stroke="#4b5a50" strokeWidth="3" />
            <path d="M60 150 C 60 95, 100 70, 130 70 C 160 70, 200 95, 200 150 Z" className="lamp-shade" />
            <ellipse cx="130" cy="152" rx="70" ry="9" className="lamp-rim" />
            <ellipse cx="130" cy="164" rx="22" ry="14" className="lamp-bulb" />
            {/* pull cord */}
            <line x1="188" y1="148" x2="188" y2="200" stroke="#8a9a8f" strokeWidth="2" />
            <circle cx="188" cy="206" r="6" fill="#e9a53b" />
            {/* plant under the lamp */}
            <g className="lamp-plant">
              <path d="M130 400 C 130 370, 126 350, 130 320" stroke="#6fbf7d" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M130 345 C 100 340, 86 322, 84 304 C 108 306, 126 320, 130 345 Z" fill="#4f9a63" />
              <path d="M130 330 C 160 326, 176 308, 178 290 C 154 292, 134 306, 130 330 Z" fill="#6fbf7d" />
              <path d="M130 322 C 120 304, 122 288, 130 274 C 138 288, 140 304, 130 322 Z" fill="#8fd49a" />
            </g>
            <path d="M96 392 L164 392 L156 418 L104 418 Z" fill="#b7673a" />
          </svg>
        </button>
        <div className="light-cone" aria-hidden="true" />
        <p className="lamp-hint">{lit ? 'Tap the lamp to switch it off' : 'Tap the lamp to log in'}</p>
      </div>

      <div className="login-card">
        <h1 className="scene-title">{mode === 'login' ? <>Welcome back. <em>Let’s get growing.</em></> : <>Join Fernwood. <em>Plant something.</em></>}</h1>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <input className="form-control mb-2" placeholder="Full name" required value={form.name} onChange={set('name')} />
              <input className="form-control mb-2" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} />
            </>
          )}
          <input type="email" className="form-control mb-2" placeholder="Email" required value={form.email} onChange={set('email')} />
          <input type="password" className="form-control mb-3" placeholder="Password (6+ characters)" required value={form.password} onChange={set('password')} />
          {error && <div className="alert alert-danger py-2">{error}</div>}
          <button className="btn btn-marigold w-100 btn-lg">{mode === 'login' ? 'Log in' : 'Create account'}</button>
        </form>
        <p className="mt-3 mb-0 text-center text-muted">
          {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
          <button className="btn btn-link p-0 link-amber" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
            {mode === 'login' ? 'Create an account' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
