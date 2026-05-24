const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light border-top mt-auto py-3">
      <div className="container-fluid">
        <div className="row align-items-center">
            <p className="text-muted mb-0" style={{textAlign: "center"}}>
              {currentYear} Antiques Auction. All rights reserved.
            </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
