import ReactPlayer from "react-player";
import ReactPlayerYoutube from "react-player/youtube";
import motionLogo from "../../assets/motion-logo.mp4";
import globe from "../../assets/globe.mov";
import Form from "../Form/Form";
import TextBlock from "../TextBlock/TextBlock";
import { useTranslation } from "react-i18next";
import CodeOfConduct from "../CodeOfConduct/CodeOfConduct";

import "./Landing.css";

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="my-16 bg-black rounded-2xl">
        <ReactPlayer
          width={"100%"}
          url={motionLogo}
          playing={true}
          loop
          playsinline
        />
      </div>

      <TextBlock
        heading={t("visionHeading")}
        content={[
          t("visionContent1"),
          t("visionContent2"),
          t("visionContent3"),
        ]}
      />

      <div className="my-16 rounded-2xl overflow-hidden">
        <ReactPlayer
          className="videoPlayer"
          width={"100%"}
          url={globe}
          playing={true}
          loop
          playsinline
        />
      </div>

      <TextBlock
        heading={t("loveHeading")}
        content={[t("loveContent1"), t("loveContent2")]}
      />

      <TextBlock
        heading={t("philosophyHeading")}
        content={[t("philosophyContent1")]}
      />

      <div className="my-16 rounded-2xl overflow-hidden">
        <ReactPlayerYoutube
          className="videoPlayer"
          width={"100%"}
          url={"https://www.youtube.com/watch?v=90XeJGXA5gU"}
          controls
        />
      </div>

      <Form />

      <CodeOfConduct />
    </div>
  );
};

export default Landing;
