import { motion, useScroll, useTransform } from "framer-motion";
import { PropsWithChildren, useRef } from "react";

import "./MotionPicture.css";

function MotionPicture({ children }: PropsWithChildren) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, 
    [0, 0.5, 1], 
    ["30%", "0%", "-30%"]
  );
  
  const opacity = useTransform(scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.6, 1, 1, 0.6]
  );

  return (
    <motion.div
      ref={ref}
      className="motion-picture"
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
}

export default MotionPicture;
