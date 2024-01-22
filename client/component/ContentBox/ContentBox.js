import React from "react";

export const ContentBox = ({ children }) => {
  return (
    <div
      style={{
        background: "rgb(258,412,286)",
        marginTop: "12px",
        padding: "12px 8px",
        borderTopColor: "#D60000",
        borderTopWidth: "3px",
        borderTopStyle: "solid",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        borderBottomLeftRadius: "3px",
        borderBottomRightRadius: "3px",
        boxShadow: "0 1px 1px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{overflowX: "auto",paddingRight: "12px"}}>{children}</div>
    </div>
  );
};
