import { Link, useLocation, useNavigate } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
          <Link to="/credits">
            Photo Credits
          </Link>
        </div>
        <div className="footer__copy">
          &copy; 2026 TS Fashion Original Leather. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
