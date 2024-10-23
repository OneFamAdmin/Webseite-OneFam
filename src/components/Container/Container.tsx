import { PropsWithChildren } from "react";

import "./Container.css";

function Container({ children }: PropsWithChildren) {
  return <div className="main-container">{children}</div>;
}

export default Container;
