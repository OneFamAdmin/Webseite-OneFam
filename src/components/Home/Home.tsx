import ReactPlayer from "react-player"
import ReactPlayerYoutube from "react-player/youtube";
import motionLogo from "../../assets/motion-logo.mp4";
import globe from "../../assets/globe.mov";
import Form from "../Form/Form";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import "./Home.css";

function Home() {
  const [selectedOption, setSelectedOption] = useState("");
  const location = useLocation();
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.currentTarget?.value);
  }

  return (
    <div id="home" className="py-8 px-16">

        <div className="my-16 bg-black rounded-2xl">
            <ReactPlayer width={"100%"} url={motionLogo} playing={true} loop playsinline />
        </div>

        <h1 className="font-bold text-2xl mb-8">ONE LOVE — ONE CULTURE — ONE FAM</h1>

        <p className="text-xl leading-10">Mit jedem T-Shirt, das du kaufst, tust du etwas Großartiges! Du unterstützt nicht nur wichtige Hilfsorganisationen, die wirklich etwas bewegen, sondern trägst auch zu etwas ganz Besonderem bei: einem Gemeinschaftsfonds, der unsere Community zu neuen Abenteuern führt. Stell dir vor, wir alle entscheiden gemeinsam – spielerisch und voller Begeisterung – wohin die nächste Reise geht. Diese T-Shirts sind mehr als nur Kleidung, sie sind der Schlüssel zu unvergesslichen Erlebnissen, die wir zusammen als Gemeinschaft erschaffen. Sei Teil dieser aufregenden Bewegung und lass uns gemeinsam die Welt verändern!</p>

        <div className="my-16 rounded-2xl overflow-hidden">
            <ReactPlayer class="videoPlayer" width={"100%"} url={globe} playing={true} loop playsinline />
        </div>

        <h1 className="font-bold text-2xl mb-8">UNSERE VISION</h1>

        <p className="text-xl leading-10">Unsere Vision ist es eine Plattform zu schaffen, welche Menschen mit begrenzten finanziellen Mitteln die Möglichkeit gibt, ihre Reiseträume zu verwirklichen, während gleichzeitig bedürftigen Menschen auf der Welt geholfen wird.</p>

        <p className="text-xl leading-10 my-8">Vertrauen ist der Kern unserer Werte, gefolgt von Ehrlichkeit, Transparenz, Solidarität und Gemeinschaft. Wir sind fest entschlossen, durch fair gestaltete und transparente Mechanismen dieses unserer Mitglieder zu gewinnen und zu stärken.</p>

        <p className="text-xl leading-10">Wir freuen uns auf Dich und auf Gesellschaft, welche seinesgleichen findet.</p>

        <div className="my-16 rounded-2xl overflow-hidden">
            <ReactPlayerYoutube class="videoPlayer" width={"100%"} url={"https://www.youtube.com/watch?v=90XeJGXA5gU"} controls />
        </div>

        <Form handleChange={handleChange} selectedOption={selectedOption} />
    </div>
    
  )
}

export default Home