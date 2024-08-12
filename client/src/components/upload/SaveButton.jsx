import React from "react";

const SaveButton = ({ saving, isLoading }) => {
  return (
    <div className="my-3 w-100 text-end">
      <button
        className="btn btn-primary rounded-2 text-capitalize w-25 py-3 text-light fw-bold"
        style={{
          backgroundColor: "#329f08",
          border: "none",
          outline: "none",
        }}
        onClick={saving}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default SaveButton;
