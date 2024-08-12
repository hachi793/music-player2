import React from "react";
import "../../styles/Hero.css";
import { LuDot } from "react-icons/lu";
import moment from "moment";

const Hero = ({ data, type }) => {
  const handleType = () => {
    if (type === "Album") {
      return "Album";
    } else if (type === "Artist") {
      return "Artist";
    }
    return "Song";
  };
  return (
    <div className="details-page-info">
      <div className="details-info-img">
        <img src={data.imageURL} alt={data.name} />
      </div>
      <div className="details-page-content">
        <p className="small-textBold">{handleType()}</p>
        <h1>{data.name}</h1>
        {type === "Album" ||
          ("Artist" && (
            <p className="small-text">
              {data.description?.length > 300
                ? `${data.description.slice(0, 300)}...`
                : data.description}
            </p>
          ))}
        {type === "Song" && (
          <div className="medium-text">
            <span>{data.artistId.name}</span>
            <LuDot />
            <span>{data.albumId.name}</span>
            <LuDot />
            <span>{moment(new Date(data.createdAt)).format("MMM YYYY")}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
