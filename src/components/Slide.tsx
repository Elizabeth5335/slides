import React from "react";

export default function Slide(props) {
  const { currentSlide, setIsPlaying, isPlaying } = props;

  const toggleAudio = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div className={`slide ${props.className}`}>
      <figure onClick={toggleAudio}>
        <img className="slide-image" src={currentSlide.image} alt={currentSlide.text} />
        <figcaption className="slide-text">
          {currentSlide.text}
        </figcaption>
      </figure>
    </div>
  );
}
