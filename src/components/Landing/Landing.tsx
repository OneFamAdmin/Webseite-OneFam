import { useTranslation } from "react-i18next";
import ReactPlayer from "react-player";
import ReactPlayerYoutube from "react-player/youtube";
import globe from "../../assets/globe.mov";
import motionLogo from "../../assets/motion-logo.mp4";
import CodeOfConduct from "../CodeOfConduct/CodeOfConduct";
import Form from "../Form/Form";
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

      <TextBlock
        heading={t("visionHeading")}
        content={[t("visionContent1"), t("visionContent2"), t("visionContent3")]}
      />

      <MotionPicture>
        <ReactPlayer className="videoPlayer" width={"100%"} url={globe} playing={true} loop playsinline />
      </MotionPicture>

      <TextBlock heading={t("loveHeading")} content={[t("loveContent1"), t("loveContent2")]} />

      <TextBlock heading={t("philosophyHeading")} content={[t("philosophyContent1")]} />

      <MotionPicture>
        <ReactPlayerYoutube
          className="videoPlayer"
          width={"100%"}
          url={"https://www.youtube.com/watch?v=90XeJGXA5gU"}
          controls
        />
      </MotionPicture>

      <Form />

      <CodeOfConduct />
    </Container>
  );
};

export default Landing;
