import React from "react";

const Alert = ({ type }) => {
  return (
    <div
      key={type}
      className={`position-fixed rounded-2 p-3 d-flex justify-content-center align-items-center ${
        type === "success" && "bg-success"
      } ${type === "danger" && "bg-danger"}`}
      style={{
        top: "10%",
        right: "5%",
        backgroundColor: "#323232",
        marginTop: "20px",
      }}
    >
      {type === "success" && (
        <div className="d-flex align-items-center justify-content-center">
          <p>Data saved</p>
        </div>
      )}

      {type === "danger" && (
        <div className="d-flex align-items-center justify-content-center">
          <p>Error , Data not saved</p>
        </div>
      )}
    </div>
  );
};

export default Alert;
