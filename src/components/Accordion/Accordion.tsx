import { useState } from "react";
import { accordionItems } from "./accordionItems";
import AccordionItem from "./AccordionItem";

import "./Accordion.css";
import TextBlock from "../TextBlock/TextBlock";

import { useTranslation } from "react-i18next";

function Accordion() {

    const { t } = useTranslation()

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    }

    return (
        <>
            <TextBlock
                heading={t("kodexHeading")}
                content={[t("kodexContent")]}
            />

            {accordionItems.map((item, index) => {
                return (
                    <AccordionItem
                        key={index}
                        heading={t(item.heading)}
                        content={t(item.content)}
                        onClick={() => handleClick(index)}
                        isOpen={activeIndex === index}
                    />
                )
            })}
        </>
    )
}

export default Accordion