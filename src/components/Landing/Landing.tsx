import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import globe from "../../assets/globe.mov";
import motionLogo from "../../assets/motion-logo.mp4";
import CodeOfConduct from "../CodeOfConduct/CodeOfConduct";
import TextBlock from "../TextBlock/TextBlock";

import Container from "../Container/Container";
import MotionPicture from "../MotionPicture/MotionPicture";
import "./Landing.css";
import { motion } from "framer-motion";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import { fadeInUp, parallax } from "../../animations/variants";

const Landing = () => {
  const { t } = useTranslation();
  const [ref, controls] = useScrollAnimation();

  return (
    <Container>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <MotionPicture>
          <ReactPlayer width={"100%"} url={motionLogo} playing={true} loop playsinline />
        </MotionPicture>
      </motion.div>

      <TextBlock heading={t("philosophyHeading")} content={[t("philosophyContent1")]} />

      <TextBlock heading={t("loveHeading")} content={[t("loveContent1"), t("loveContent2")]} />

      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={parallax}
      >
        <MotionPicture>
          <ReactPlayer className="videoPlayer" width={"100%"} url={globe} playing={true} loop playsinline />
        </MotionPicture>
      </motion.div>

      <CodeOfConduct />

      <TextBlock heading={t("visionHeading")} content={[t("visionContent1"), t("visionContent2")]} />
    </Container>
  );
};

export default Landing;
