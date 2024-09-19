import { useState } from "react";
import { accordionItems } from "./accordionItems";
import AccordionItem from "./AccordionItem";

import "./Accordion.css";
import TextBlock from "../TextBlock/TextBlock";

function Accordion() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handleClick = (index: number) => {
        setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
    }

    return (
    <>
        
        <TextBlock heading="Kodex" content={["Dieser Familienkodex spiegelt die Werte und Grundsätze unserer Familie wider. Er dient dazu, unsere Beziehungen zu stärken, Erwartungen zu klären und unsere gemeinsame Reise als Familie zu gestalten."]} />

        {accordionItems.map((item, index) => {
            return (
                <AccordionItem
                    key={index}
                    heading={item.heading}
                    content={item.content}
                    onClick={() => handleClick(index)}
                    isOpen={activeIndex === index}
                />
            )
        })}
    </>
    )
}

export default Accordion