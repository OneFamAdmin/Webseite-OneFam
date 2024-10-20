import { useState } from "react";
import { AccordionItemContent } from "./AccordionProps";
import { useTranslation } from "react-i18next";
import AccordionItem from "./AccordionItem";

import "./Accordion.css";

const Accordion = ({
  accordionItems,
}: {
  accordionItems: AccordionItemContent[];
}) => {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <>
      {accordionItems.map((item, index) => {
        return (
          <AccordionItem
            key={index}
            heading={t(item.heading)}
            content={t(item.content)}
            onClick={() => handleClick(index)}
            isOpen={activeIndex === index}
          />
        );
      })}
    </>
  );
};

export default Accordion;
