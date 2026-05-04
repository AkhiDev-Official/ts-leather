import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__links">
          <a href="#">{t('footer.privacy')}</a>
          <a href="#">{t('footer.terms')}</a>
          <a href="#">{t('footer.contact')}</a>
          <Link to="/credits">
            {t('footer.photo_credits')}
          </Link>
        </div>
        <div className="footer__copy">
          {t('footer.copy')}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
