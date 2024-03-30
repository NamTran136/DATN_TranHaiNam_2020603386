import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-text">© 2024 THN. All Rights Reserved.</div>
      <ul className="footer-list">
        <li>
          <Link to="" className="footer-list-item">
            About
          </Link>
        </li>
        <li>
          <Link to="" className="footer-list-item">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="" className="footer-list-item">
            Licensing
          </Link>
        </li>
        <li>
          <Link to="" className="footer-list-item">
            Contact
          </Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
