import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import './LandingPage.css';

// TODO: замінити на реальне посилання після публікації додатка
// App Store: https://apps.apple.com/app/...
// Google Play: https://play.google.com/store/apps/details?id=...
const APP_DOWNLOAD_URL = null;

const LandingPage = () => {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownloadClick = () => {
    if (isDownloaded) return;

    if (APP_DOWNLOAD_URL) {
      window.open(APP_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
    }

    setIsDownloaded(true);
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <BrandLogo size={36} />
            <span>Antiques Auction</span>
          </div>
          <Link to="/login" className="landing-admin-btn">
            Увійти на адмін-сторінку
          </Link>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <h1>Antiques Auction</h1>
          <p className="landing-lead">
            Платформа для онлайн-аукціонів антикваріату та колекційних речей.
            Купуйте та продавайте унікальні лоти в зручному мобільному додатку.
          </p>
        </section>

        <section className="landing-about">
          <h2>Про платформу</h2>
          <p>
            Antiques Auction об&apos;єднує колекціонерів, продавців і покупців
            на одному майданчику. Користувачі можуть виставляти лоти на
            аукціон, робити ставки в реальному часі, відстежувати статус
            доставки та керувати своїм профілем.
          </p>
          <p>
            Модератори та адміністратори працюють через веб-панель: перевіряють
            лоти, керують користувачами та аналізують статистику платформи.
          </p>
        </section>

        <section className="landing-download">
          <h2>Мобільний додаток</h2>
          <p>
            Завантажте офіційний додаток antiques-mobile, щоб брати участь в
            аукціонах, додавати лоти в обране та отримувати сповіщення про
            ставки.
          </p>
          <div className="landing-download-actions">
            <button
              type="button"
              className={`landing-download-btn${
                isDownloaded ? ' landing-download-btn--downloaded' : ''
              }`}
              onClick={handleDownloadClick}
              disabled={isDownloaded}
              aria-live="polite"
            >
              <i
                className={`bi me-2 ${
                  isDownloaded ? 'bi-check-circle' : 'bi-download'
                }`}
              />
              {isDownloaded ? 'Додаток завантажено!' : 'Завантажити додаток'}
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Antiques Auction. Усі права захищено.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
