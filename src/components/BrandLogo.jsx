import logoSrc from '../assets/logo.png';
import './BrandLogo.css';

const BrandLogo = ({ size = 36, className = '' }) => {
  return (
    <img
      src={logoSrc}
      alt="Antiques Auction"
      className={`brand-logo ${className}`.trim()}
      style={{ height: size }}
    />
  );
};

export default BrandLogo;
