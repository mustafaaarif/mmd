import React from "react";
import { FaStar } from "react-icons/fa";
import "./promotionStars.css";

const PromotionStars = ({
  radioDisabled,
  userRating,
  onStarClick,
}) => {
  return (
    <>
      <p className="ratingPara">Rate this release</p>
      <div className="ratingWrap">
        {[...Array(10)].map((item, index) => {
          const starNum = index + 1;

          return (
            <label key={index} className="ratingLabel" htmlFor="">
              <input
                type="radio"
                disabled={radioDisabled}
                name="rating"
                value={starNum}

                onClick={() => {
                  onStarClick(starNum);
                }}
              />
              <FaStar
                color={starNum <= (userRating) ? "#000a60" : "grey"}
                className="ratingStar"
                size={20}
              />
            </label>
          );
        })}
        <p>{userRating}</p>
      </div>
    </>
  );
};
export default PromotionStars;
