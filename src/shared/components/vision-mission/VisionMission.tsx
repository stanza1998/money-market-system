import React from "react";

export const vision =
  "Vision: To be the leading electricity regulator in Africa";
export const mission = `Mission: To regulate the Namibian Electricity Supply Industry in a
sustainable manner, in the interest of all stakeholders with regard to
efficiency, affordability, safety and accessibility.`;

const VisionMission = () => {
  return (
    <div className="header">
      <h6 className="vision">{vision}</h6>
      <h6 className="mission">{mission}</h6>
    </div>
  );
};

export default VisionMission;
