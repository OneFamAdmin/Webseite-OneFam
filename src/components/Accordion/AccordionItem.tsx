import { useRef } from "react";
import "./AccordionItem.css";

export type AccordionItem = {
    heading: string;
    content: string;
}

type AccordionItemProps = AccordionItem & {
    onClick: () => void;
    isOpen: boolean;
}

function AccordionItem({ heading, content, onClick, isOpen }: AccordionItemProps) {
    const contentHeight = useRef<HTMLParagraphElement>(null);
    
    return (
        <div className={`accordionItem-container border-b-[1px] border-zinc-600 last:border-b-0 ${isOpen ? "accordionItem-container--active" : ""}`}>
            <h2 className="accordionItem-heading" onClick={onClick}>{heading}</h2>
            <div
                ref={contentHeight}
                className={"accordionItem-bodyContainer"}
                style={
                    isOpen
                        ? { height: contentHeight?.current?.scrollHeight }
                        : { height: "0px" }
                }
            >
                <p className={"accordionItem-bodyContent text-xl"}>{content}</p>
            </div>
        </div>
    )
}

export default AccordionItem