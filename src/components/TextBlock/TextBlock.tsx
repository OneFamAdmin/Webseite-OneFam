import "./TextBlock.css";

type TextBlockProps = {
  heading: string;
  content: string[];
};

function TextBlock({ heading, content }: TextBlockProps) {
  return (
    <div className="text-block">
      <h1 className="font-bold mb-8">{heading}</h1>

      {content.map((paragraph, index) => {
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

export default TextBlock;
