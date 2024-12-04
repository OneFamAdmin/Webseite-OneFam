import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeInUp } from "../../animations/variants";
import "./TextBlock.css";

type TextBlockProps = {
  heading: string;
  content: string[];
};

function TextBlock({ heading, content }: TextBlockProps) {
  const [ref, controls] = useScrollAnimation(0.1);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={fadeInUp}
      className="textBlock"
    >
      <motion.h2
        variants={fadeInUp}
        className="textBlock-heading"
      >
        {heading}
      </motion.h2>
      {content.map((paragraph, index) => (
        <motion.p
          key={index}
          variants={fadeInUp}
          custom={index}
          transition={{ delay: index * 0.1 }}
        >
          {paragraph}
        </motion.p>
      ))}
    </motion.div>
  );
}

export default TextBlock;
