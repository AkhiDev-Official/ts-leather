import { useEffect } from 'react';
import './SplashScreen.css';

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="splash" onClick={onComplete}>
      <div className="splash__center">
        <img className="splash__logo" src="/assets/logo_new.jpg" alt="TS Fashion" />
        <div className="splash__line" />
        <p className="splash__tagline">Original Leather</p>
      </div>
    </div>
  );
}

export default SplashScreen;
