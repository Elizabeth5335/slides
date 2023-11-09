import React, { useState, useEffect } from "react";
import Slide from "./Slide.tsx";

type Slide = {
  id: number;
  text: string;
  image: string;
  audioMp3: string;
  audioWav: string;
};

export default function Slides() {
  const [currentSlide, setCurrentSlide] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [prevSlide, setPrevSlide] = React.useState(null);

  React.useEffect(() => {
    fetch(`../api/${currentIndex}`)
      .then((res) => res.json())
      .then((data) => setCurrentSlide(data));
  }, [currentIndex]);

  React.useEffect(() => {
    fetch("../api/1")
      .then((res) => res.json())
      .then((data) => {
        setPrevSlide(data);
      });
  }, []);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const audioElem = React.useRef(new Audio());
  const prevAudioElem = React.useRef(new Audio());

  const fadeOutAudio = (audio) => {
    const fadeOutInterval = 10;
    const fadeOutDuration = 2000;
    const volume = audio.current.volume;
    const step = volume / (fadeOutDuration / fadeOutInterval);
    const fadeOutIntervalId = setInterval(() => {
      if (audio.current.volume >= step) {
        audio.current.volume -= step;
      } else {
        audio.current.currentTime = 0;
        audio.current.pause();
        clearInterval(fadeOutIntervalId);
      }
    }, fadeOutInterval);
  };

  useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        audioElem.current.play();
      }, 100);
    } else {
      audioElem.current.pause();
    }
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    if (isPlaying) {
      prevAudioElem.current.play();
      fadeOutAudio(prevAudioElem);
    }
  }, [currentIndex]);

  function updateIndex(index) {
    prevAudioElem.current.src = audioElem.current.src;
    prevAudioElem.current.volume = audioElem.current.volume;
    prevAudioElem.current.currentTime = audioElem.current.currentTime;

    setPrevSlide(currentSlide);

    // const totalCount = !slides ? 0 : slides.length;
    const totalCount = 5;
    if (index < 0) {
      index = totalCount - 1;
    } else if (index >= totalCount) {
      index = 0;
    }
    setCurrentIndex(index);
  }

  const handleKeyDown = (e) => {
    switch (e.code) {
      case "ArrowLeft":
        updateIndex(currentIndex - 1);
        break;
      case "ArrowRight":
        updateIndex(currentIndex + 1);
        break;
      case "Space":
        setIsPlaying((prev) => !prev);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

 if (currentSlide && prevSlide) {
    return (
      <>
        <div className="slideshow">
          <audio
            src={currentSlide.audioMp3}
            ref={audioElem}
            preload="auto"
            loop
          />
          {prevSlide && (
            <audio
              src={prevSlide.audioMp3}
              ref={prevAudioElem}
              preload="auto"
              loop
            />
          )}
          {!isPlaying && (
            <div
              className="play-button-container"
              onClick={() => setIsPlaying(true)}
            >
              <div className="play-button"></div>
            </div>
          )}
          <div className="slideshow-slider">
            <Slide
              key={prevSlide.id}
              className="prev"
              currentSlide={currentSlide}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
            <Slide
              key={currentSlide.id}
              className="active"
              currentSlide={prevSlide}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>
          <button
            className="controls-button left"
            onClick={(e) => {
              e.stopPropagation();
              updateIndex(currentIndex - 1);
            }}
          >
            Prev
          </button>
          <button
            className="controls-button right"
            onClick={(e) => {
              e.stopPropagation();
              updateIndex(currentIndex + 1);
            }}
          >
            Next
          </button>
        </div>
      </>
    );
  } else {
    return (
        <h1>Loading...</h1>
    );
  }
}
