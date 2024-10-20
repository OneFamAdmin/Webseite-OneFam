export type AccordionItemContent = {
  heading: string;
  content: string;
};

export type AccordionItemProps = AccordionItemContent & {
  onClick: () => void;
  isOpen: boolean;
};
