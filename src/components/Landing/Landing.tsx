import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import globe from "../../assets/globe.mov";
import motionLogo from "../../assets/motion-logo.mp4";
import CodeOfConduct from "../CodeOfConduct/CodeOfConduct";
import TextBlock from "../TextBlock/TextBlock";

import Container from "../Container/Container";
import MotionPicture from "../MotionPicture/MotionPicture";
import "./Landing.css";

const Landing = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <MotionPicture>
        <ReactPlayer width={"100%"} url={motionLogo} playing={true} loop playsinline />
      </MotionPicture>

      <TextBlock heading={t("philosophyHeading")} content={[t("philosophyContent1")]} />

      <TextBlock heading={t("loveHeading")} content={[t("loveContent1"), t("loveContent2")]} />

      <MotionPicture>
        <ReactPlayer className="videoPlayer" width={"100%"} url={globe} playing={true} loop playsinline />
      </MotionPicture>

      <CodeOfConduct />

      <TextBlock heading={t("visionHeading")} content={[t("visionContent1"), t("visionContent2")]} />

      {/* <MotionPicture>
        <ReactPlayerYoutube
          className="videoPlayer"
          width={"100%"}
          url={"https://www.youtube.com/watch?v=90XeJGXA5gU"}
          controls
        />
      </MotionPicture> */}

      {/* <Form /> */}
    </Container>
  );
};

export default Landing;
