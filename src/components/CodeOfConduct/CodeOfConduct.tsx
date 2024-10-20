import { useTranslation } from "react-i18next";
import Accordion from "../Accordion/Accordion";
import TextBlock from "../TextBlock/TextBlock";
import { codeOfConductItems } from "./codeOfConductItems";

function CodeOfConduct() {
  const { t } = useTranslation();

  return (
    <>
      <TextBlock heading={t("kodexHeading")} content={[t("kodexContent")]} />
      <Accordion accordionItems={codeOfConductItems} />
    </>
  );
}

export default CodeOfConduct;
