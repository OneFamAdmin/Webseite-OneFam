import "./TextBlock.css";

type TextBlockProps = {
  heading: string;
  content: string[];
};

function TextBlock({ heading, content }: TextBlockProps) {
  return (
    <div className="textBlock">
      <h2 className="textBlock-heading">{heading}</h2>

      {content.map((paragraph, index) => {
        return <p key={index}>{paragraph}</p>;
      })}
    </div>
  );
}

export default TextBlock;
