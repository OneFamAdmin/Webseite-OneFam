import { useScroll } from "../../context/ScrollContext";

import { useTranslation } from "react-i18next";

function Imprint() {
  const { ImprintComponent } = useScroll();
  const { t } = useTranslation();


  return (
    <div ref={ImprintComponent}>
      <ImprintItem
        heading={t("imprintDisclaimerHeading")}
        text={t("imprintDisclaimerText", { returnObjects: true }) as string[]}
      />
      <ImprintItem
        heading={t("imprintLinksHeading")}
        text={t("imprintLinksText", { returnObjects: true }) as string[]}
      />
      <ImprintItem
        heading={t("imprintCopyrightHeading")}
        text={t("imprintCopyrightText", { returnObjects: true }) as string[]}
      />
      <ImprintItem
        heading={t("imprintPrivacyHeading")}
        text={t("imprintPrivacyText", { returnObjects: true }) as string[]}
      />
    </div>

  )
}

type ImprintItemProps = {
  heading: string;
  text: string[];
}


function ImprintItem({ heading, text }: ImprintItemProps) {
  return (
    <div className="my-8">
      <p>{heading}</p>
      {text.map((content, index) => <p key={index} className="mt-8">{content}</p>)}
    </div>
  );
}

export default Imprint;