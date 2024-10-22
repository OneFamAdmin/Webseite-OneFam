import { useState } from "react";
import { useTranslation } from "react-i18next";
import AccordionItem from "./AccordionItem";
import { AccordionItemContent } from "./AccordionProps";

import "./Accordion.css";

const Accordion = ({ accordionItems }: { accordionItems: AccordionItemContent[] }) => {
  const { t } = useTranslation();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="accordion">
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
    </div>
  );
};

export default Accordion;
