import { useState } from "react";
import { useTranslation } from "react-i18next";
import "/node_modules/flag-icons/css/flag-icons.min.css";

function Flags() {
  const { i18n } = useTranslation();

  const [animatingFlag, setAnimatingFlag] = useState("");

  const handleFlagClick = (lang: string) => {
    setAnimatingFlag(lang);
    i18n.changeLanguage(lang);
    setTimeout(() => setAnimatingFlag(""), 800); // Reset after animation
  };

  return (
    <div>
      <span
        className={`fi fi-gb-eng mx-4 cursor-pointer ${animatingFlag === "en" ? "animate-ping z-10" : ""}`}
        onClick={() => handleFlagClick("en")}></span>
      <span
        className={`fi fi-de mx-4 cursor-pointer ${animatingFlag === "gr" ? "animate-ping z-10" : ""}`}
        onClick={() => handleFlagClick("gr")}></span>
      <span
        className={`fi fi-fr mx-4 cursor-pointer ${animatingFlag === "fr" ? "animate-ping z-10" : ""}`}
        onClick={() => handleFlagClick("fr")}></span>
      <span
        className={`fi fi-es mx-4 cursor-pointer ${animatingFlag === "es" ? "animate-ping z-10" : ""}`}
        onClick={() => handleFlagClick("es")}></span>
    </div>
  );
}

export default Flags;
