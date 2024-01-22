import React from "react";

export const DescBox = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
      }}
    >
      {children}
    </div>
  );
};
