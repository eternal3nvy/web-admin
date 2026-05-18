import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="layout-wrapper">
        <Header />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
