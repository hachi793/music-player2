import React from "react";

const DeleteCard = ({ data, deleteItem, setIsDelete, type }) => {
  return (
    <div
      className="position-absolute d-flex flex-column justify-content-center align-items-center px-4 py-2 rounded-2"
      style={{
        top: "40%",
        left: "5%",
        backgroundColor: "#323232",
        width: "90%",
      }}
    >
      <p className="font-semibold text-center">Are you sure ?</p>
      <div className="d-flex align-items-center gap-3">
        <button
          className="border-0 px-2 rounded-2 bg-danger"
          onClick={() => {
            deleteItem(data);
            setIsDelete(false);
          }}
        >
          Yes
        </button>
        <button
          className="border-0 px-2 rounded-2 bg-success"
          onClick={() => setIsDelete(false)}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteCard;
