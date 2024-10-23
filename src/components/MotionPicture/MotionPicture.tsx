import { PropsWithChildren } from "react";

import "./MotionPicture.css";

function MotionPicture({ children }: PropsWithChildren) {
  return <div className="motion-picture">{children}</div>;
}

export default MotionPicture;
