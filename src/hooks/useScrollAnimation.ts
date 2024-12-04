import { useInView } from "react-intersection-observer";
import { useAnimation, AnimationControls } from "framer-motion";
import { useEffect } from "react";

export const useScrollAnimation = (threshold = 0.2): [any, AnimationControls] => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return [ref, controls];
};
