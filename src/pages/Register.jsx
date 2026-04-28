import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './Auth.css';

function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated) { navigate('/account', { replace: true }); return null; }

  function set(field) { return (e) => setForm(f => ({ ...f, [field]: e.target.value })); }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields.'); return;
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    const res = register(form);
    if (res.ok) navigate('/account');
    else setError(res.error);
  }

  return (
    <main className="auth">
      <div className="auth__container">
        <div className="auth__visual">
          <img src="/assets/jacket_main_full.jpg" alt="Leather craftsmanship" />
          <div className="auth__visual-overlay">
            <img src="/assets/logo_new.jpg" alt="TS Fashion" className="auth__visual-logo" />
            <p>Join the TS Fashion family.</p>
          </div>
        </div>
        <div className="auth__form-side">
          <div className="auth__form-wrap">
            <span className="label">Get Started</span>
            <h1 className="auth__title">Create Account</h1>
            <p className="auth__subtitle">Register to track orders, save your wishlist, and more.</p>

            {error && <div className="auth__error"><span className="material-symbols-outlined">error</span>{error}</div>}

            <form className="auth__form" onSubmit={handleSubmit}>
              <div className="auth__row">
                <div className="auth__field">
                  <label>First Name *</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">person</span>
                    <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="Marie" />
                  </div>
                </div>
                <div className="auth__field">
                  <label>Last Name *</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">badge</span>
                    <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Dupont" />
                  </div>
                </div>
              </div>
              <div className="auth__field">
                <label>Email *</label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">mail</span>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" autoComplete="email" />
                </div>
              </div>
              <div className="auth__field">
                <label>Phone <span className="auth__optional">(optional)</span></label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">phone</span>
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+33 6 00 00 00 00" />
                </div>
              </div>
              <div className="auth__row">
                <div className="auth__field">
                  <label>Password *</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">lock</span>
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 6 characters" autoComplete="new-password" />
                    <button type="button" className="auth__eye" onClick={() => setShowPass(v => !v)}>
                      <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div className="auth__field">
                  <label>Confirm *</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">lock</span>
                    <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" autoComplete="new-password" />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn--gradient auth__submit">
                Create Account
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <p className="auth__switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
