import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeInUp } from "../../animations/variants";
import "./TextBlock.css";

type TextBlockProps = {
  heading: string;
  content: string[];
};

function TextBlock({ heading, content }: TextBlockProps) {
  const [ref, controls] = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className="textBlock"
    >
      <h2 className="textBlock-heading">{heading}</h2>
      {content.map((paragraph, index) => (
        <motion.p
          key={index}
          variants={fadeInUp}
          initial="hidden"
          animate={controls}
          transition={{ delay: index * 0.2 }}
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
}

export default TextBlock;
