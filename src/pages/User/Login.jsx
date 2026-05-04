import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { useTranslation } from 'react-i18next';
import './Auth.css';

function Login() {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { t } = useTranslation();
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
    if (!email || !password) { setError(t('auth.error_fill_all')); return; }
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
            <p>{t('auth.your_account_tagline')}</p>
          </div>
        </div>
        <div className="auth__form-side">
          <div className="auth__form-wrap">
            <span className="label">{t('auth.welcome_back_label')}</span>
            <h1 className="auth__title">{t('auth.sign_in')}</h1>
            <p className="auth__subtitle">{t('auth.sign_in_subtitle')}</p>

            <div className="auth__demo-hint">
              <span className="material-symbols-outlined">info</span>
              <div>
                <strong>{t('auth.demo_user')}</strong><br />
                test@mail.com / test123!
                <br />
                <strong>{t('auth.demo_admin')}</strong><br />
                admin@mail.com / admin123!
              </div>
            </div>

            {error && <div className="auth__error"><span className="material-symbols-outlined">error</span>{error}</div>}

            <form className="auth__form" onSubmit={handleSubmit}>
              <div className="auth__field">
                <label>{t('auth.email')}</label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">mail</span>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" autoComplete="email" />
                </div>
              </div>
              <div className="auth__field">
                <label>{t('auth.password')}</label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">lock</span>
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
                  <button type="button" className="auth__eye" onClick={() => setShowPass(v => !v)}>
                    <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn--gradient auth__submit">
                {t('auth.submit_login')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <p className="auth__switch">
              {t('auth.no_account')} <Link to="/register">{t('auth.create_one')}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
