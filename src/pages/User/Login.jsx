import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import './Auth.css';

function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated && !isAdmin) { navigate('/account', { replace: true }); return null; }

  if (isAuthenticated && isAdmin) { navigate('/admin', { replace: true }); return null; }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    const res = login(email, password);
    if (res.ok) {
      if (isAdmin) navigate('/admin');
      else navigate('/account');
    } else setError(res.error);
  }

  return (
    <main className="auth">
      <div className="auth__container">
        <div className="auth__visual">
          <img src="/assets/leather_full.jpg" alt="Premium leather" />
          <div className="auth__visual-overlay">
            <img src="/assets/logo_new.jpg" alt="TS Fashion" className="auth__visual-logo" />
            <p>Your account, your leather journey.</p>
          </div>
        </div>
        <div className="auth__form-side">
          <div className="auth__form-wrap">
            <span className="label">Welcome Back</span>
            <h1 className="auth__title">Sign In</h1>
            <p className="auth__subtitle">Access your orders, wishlist, and personal settings.</p>

            <div className="auth__demo-hint">
              <span className="material-symbols-outlined">info</span>
              <div>
                <strong>Demo account (user):</strong><br />
                test@mail.com / test123!
                <br />
                <strong>Demo account (admin):</strong><br />
                admin@mail.com / admin123!
              </div>
            </div>

            {error && <div className="auth__error"><span className="material-symbols-outlined">error</span>{error}</div>}

            <form className="auth__form" onSubmit={handleSubmit}>
              <div className="auth__field">
                <label>Email</label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">mail</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" />
                </div>
              </div>
              <div className="auth__field">
                <label>Password</label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">lock</span>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" className="auth__eye" onClick={() => setShowPass(v => !v)}>
                    <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn--gradient auth__submit">
                Sign In
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <p className="auth__switch">
              Don't have an account? <Link to="/register">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
