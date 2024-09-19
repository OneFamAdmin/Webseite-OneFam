import ReactPlayer from "react-player"
import ReactPlayerYoutube from "react-player/youtube";
import motionLogo from "../../assets/motion-logo.mp4";
import globe from "../../assets/globe.mov";
import Form from "../Form/Form";
import Imprint from "../Imprint/Imprint";
import TextBlock from "../TextBlock/TextBlock";
import Accordion from "../Accordion/Accordion";

import "./Landing.css";


function Landing() {
  return (
    <div>
        <div className="my-16 bg-black rounded-2xl">
            <ReactPlayer width={"100%"} url={motionLogo} playing={true} loop playsinline />
        </div>

        <TextBlock
          heading={"UNSERE VISION"}
          content={["Unsere Vision ist es eine Plattform zu schaffen, welche Menschen mit begrenzten *finanziellen Mitteln die Möglichkeit gibt, ihre Reiseträume zu verwirklichen, während gleichzeitig bedürftigen Menschen auf der Welt geholfen wird.", "Vertrauen ist der Kern unserer Werte, gefolgt von Ehrlichkeit, Transparenz, Solidarität und Gemeinschaft. Wir sind fest entschlossen, durch fair gestaltete und transparente Mechanismen dieses unserer Mitglieder zu gewinnen und zu stärken.", "Wir freuen uns auf Dich und auf Gesellschaft, welche seinesgleichen findet."]}
        />

        <div className="my-16 rounded-2xl overflow-hidden">
            <ReactPlayer className="videoPlayer" width={"100%"} url={globe} playing={true} loop playsinline />
        </div>

        <TextBlock
          heading={"ONE LOVE — ONE CULTURE — ONE FAM"}
          content={["Mit jedem T-Shirt, das du kaufst, tust du etwas Großartiges! Du unterstützt nicht nur wichtige Hilfsorganisationen, die wirklich etwas bewegen, sondern trägst auch zu etwas ganz Besonderem bei: einem Gemeinschaftsfonds, der unsere Community zu neuen Abenteuern führt. Stell dir vor, wir alle entscheiden gemeinsam – spielerisch und voller Begeisterung – wohin die nächste Reise geht. Diese T-Shirts sind mehr als nur Kleidung, sie sind der Schlüssel zu unvergesslichen Erlebnissen, die wir zusammen als Gemeinschaft erschaffen. Sei Teil dieser aufregenden Bewegung und lass uns gemeinsam die Welt verändern!"]}
        />

        <TextBlock
          heading={"PHILOSOPHIE"}
          content={["Wir umgeben uns mit Menschen, welche uns anspornen die beste Version unserer Selbst zu werden. Wir distanzieren uns von Drama oder negativen Einflüssen, sowie Eifersucht oder Hass. Stattdessen fokussieren wir uns auf unser Ziel, positive Energie zu verbreiten, um somit das Beste aus jedem Einzelnen herauszuholen."]}
        />

        <div className="my-16 rounded-2xl overflow-hidden">
            <ReactPlayerYoutube className="videoPlayer" width={"100%"} url={"https://www.youtube.com/watch?v=90XeJGXA5gU"} controls />
        </div>

        <Form />

        <Accordion />
    </div>
  )
}

export default Landing