const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div>
            <h3>CV. Jaya Kencana</h3>
            <p>
              Solusi profesional untuk konstruksi dan pengadaan industri. Kami siap
              mendukung keberhasilan proyek Anda.
            </p>
          </div>
          <div>
            <h4>Kontak</h4>
            <p>Jl. Contoh No. 123, Jakarta</p>
            <p>+62 812-3456-7890</p>
            <p>info@jayakencana.co.id</p>
          </div>
          <div>
            <h4>Jam Operasional</h4>
            <p>Senin - Jumat: 08.00 - 17.00</p>
            <p>Sabtu: 08.00 - 13.00</p>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} CV. Jaya Kencana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
