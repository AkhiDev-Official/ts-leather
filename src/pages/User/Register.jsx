import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { useTranslation } from 'react-i18next';
import './Auth.css';

function Register() {
  const { register, isAuthenticated } = useAuth();
  const { t } = useTranslation();
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
      setError(t('auth.error_fill_required')); return;
    }
    if (form.password.length < 6) { setError(t('auth.error_password_length')); return; }
    if (form.password !== form.confirm) { setError(t('auth.error_password_match')); return; }
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
            <p>{t('auth.join_tagline')}</p>
          </div>
        </div>
        <div className="auth__form-side">
          <div className="auth__form-wrap">
            <span className="label">{t('auth.get_started_label')}</span>
            <h1 className="auth__title">{t('auth.create_account')}</h1>
            <p className="auth__subtitle">{t('auth.register_subtitle')}</p>

            {error && <div className="auth__error"><span className="material-symbols-outlined">error</span>{error}</div>}

            <form className="auth__form" onSubmit={handleSubmit}>
              <div className="auth__row">
                <div className="auth__field">
                  <label>{t('auth.first_name')}</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">person</span>
                    <input type="text" value={form.firstName} onChange={set('firstName')} placeholder="Marie" />
                  </div>
                </div>
                <div className="auth__field">
                  <label>{t('auth.last_name')}</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">badge</span>
                    <input type="text" value={form.lastName} onChange={set('lastName')} placeholder="Dupont" />
                  </div>
                </div>
              </div>
              <div className="auth__field">
                <label>{t('auth.email')} *</label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">mail</span>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" autoComplete="email" />
                </div>
              </div>
              <div className="auth__field">
                <label>{t('auth.phone')} <span className="auth__optional">{t('auth.optional')}</span></label>
                <div className="auth__input-wrap">
                  <span className="material-symbols-outlined">phone</span>
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+33 6 00 00 00 00" />
                </div>
              </div>
              <div className="auth__row">
                <div className="auth__field">
                  <label>{t('auth.password_label')}</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">lock</span>
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="Min 6 characters" autoComplete="new-password" />
                    <button type="button" className="auth__eye" onClick={() => setShowPass(v => !v)}>
                      <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
                <div className="auth__field">
                  <label>{t('auth.confirm_password')}</label>
                  <div className="auth__input-wrap">
                    <span className="material-symbols-outlined">lock</span>
                    <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" autoComplete="new-password" />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn--gradient auth__submit">
                {t('auth.create_account')}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <p className="auth__switch">
              {t('auth.already_account')} <Link to="/login">{t('auth.sign_in_link')}</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Register;
