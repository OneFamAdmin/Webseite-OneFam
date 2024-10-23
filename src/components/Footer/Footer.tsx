import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import "./Footer.css";

function Footer() {
  const { t } = useTranslation();

  return (
    <div className="footer">
      <p>{t("exclusiveTravelEvents")}</p>

      <p>
        <NavLink to={"/imprint"}>Impressum</NavLink>
      </p>
      <p>© 2024 OneFam</p>
    </div>
  );
}

export default Footer;
