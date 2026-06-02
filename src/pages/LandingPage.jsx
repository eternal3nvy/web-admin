import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import BrandLogo from '../components/BrandLogo';
import './LandingPage.css';

const APP_DOWNLOAD_URL =
  'https://expo.dev/accounts/vadrille12/projects/antiques-auction/builds/6570abdf-5bca-4988-a954-da25550ff2f7';

const LandingPage = () => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadCount, setDownloadCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await api.get('/stat/downloads-count');
        setDownloadCount(response.data.count);
      } catch (error) {
        console.error('Не вдалося завантажити лічильник:', error);
      }
    };

    fetchCount();
  }, []);

  const handleDownloadClick = async () => {
    if (isDownloaded) return;

    if (APP_DOWNLOAD_URL) {
      window.open(APP_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
    }

    setIsDownloaded(true);

    try {
      const response = await api.post('/stat/downloads-increment');
      setDownloadCount(response.data.count);
    } catch (error) {
      console.error(error);
    }
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
          <h2 className="landing-counter-wrapper">
            <span>Кількість завантажень: </span>
            <span>{downloadCount}</span>
          </h2>

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
