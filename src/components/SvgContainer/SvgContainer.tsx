import { PropsWithChildren } from "react";

import "./SvgContainer.css";

function SvgContainer({ children }: PropsWithChildren) {
  return <div className="svg-container">{children}</div>;
}

export default SvgContainer;
