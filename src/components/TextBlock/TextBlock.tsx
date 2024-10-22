import "./TextBlock.css";

type TextBlockProps = {
  heading: string;
  content: string[];
};

function TextBlock({ heading, content }: TextBlockProps) {
  return (
    <div className="text-block">
      <h1 className="font-bold text-2xl mb-8">{heading}</h1>

      {content.map((paragraph, index) => {
        return (
          <p key={index} className="text-xl leading-10 mt-8">
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}

export default TextBlock;
