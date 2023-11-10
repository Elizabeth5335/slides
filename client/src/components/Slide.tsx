import React from "react";

export default function Slide({ currentSlide, toggleAudio, className }) {


  return (
    <div className={`slide ${className}`}>
      <figure onClick={toggleAudio}>
        <img
          className="slide-image"
          src={currentSlide.image}
          alt={currentSlide.text}
        />
        <figcaption className="slide-text">{currentSlide.text}</figcaption>
      </figure>
    </div>
  );
}
