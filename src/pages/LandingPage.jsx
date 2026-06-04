import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../api/axios';
import BrandLogo from '../components/BrandLogo';
import { useTranslation } from 'react-i18next';
import './LandingPage.css';

const APP_DOWNLOAD_URL =
  'https://expo.dev/accounts/vadrille12/projects/antiques-auction/builds/e1ba735c-0668-4111-bd6d-717f60f83599"';

const LandingPage = () => {
  const {t,i18n} = useTranslation();

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
  }, [t]);

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-logo">
            <BrandLogo size={36} />
            <span>Antiques Auction</span>
          </div>
          <div className="landing-actions">
            <div className="landing-language-btns">
              <button className="landing-language-btn" onClick={() => changeLanguage('uk')}>UK</button>
              <button className="landing-language-btn" onClick={() => changeLanguage('en')}>EN</button>
            </div>

            <Link to="/login" className="landing-admin-btn">
              {t('header.loginAdmin')}
            </Link>
          </div>
        </div>    
      </header>

      <main className="landing-main">
        <section className="landing-hero">
          <h1>Antiques Auction</h1>
          <p className="landing-lead">
            {t('hero.lead')}
          </p>
        </section>

        <section className="landing-about">
          <h2>{t('about.title')}</h2>
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
        </section>

        <section className="landing-download">
          <h2>{t('download.title')}</h2>
          <h2 className="landing-counter-wrapper">
            <span>{t('download.countLabel')}</span>
            <span>{downloadCount}</span>
          </h2>

          <p>{t('download.desc')}</p>

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
              {isDownloaded ? t('download.btnSuccess') : t('download.btnDefault')}
            </button>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} Antiques Auction. {t('footer.rights')}</p>
      </footer>
    </div>
  );
};

export default LandingPage;
