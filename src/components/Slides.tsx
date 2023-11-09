import React, { useState, useEffect } from "react";
import Slide from "./Slide.tsx";
import CatImg from "../assets/images/cat.jpg";
import CatMp3 from "../assets/sounds/cat.mp3";
import CatWav from "../assets/sounds/cat.wav";
import BirdsImg from "../assets/images/birds.jpg";
import BirdsMp3 from "../assets/sounds/birds.mp3";
import BirdsWav from "../assets/sounds/birds.wav";
import BeachImg from "../assets/images/beach.jpg";
import BeachMp3 from "../assets/sounds/waves.mp3";
import BeachWav from "../assets/sounds/waves.wav";
import FrogsImg from "../assets/images/frogs.jpg";
import FrogsMp3 from "../assets/sounds/frogs.mp3";
import FrogsWav from "../assets/sounds/frogs.wav";
import RainImg from "../assets/images/rain.jpg";
import RainMp3 from "../assets/sounds/rain.mp3";
import guitar from "../assets/sounds/guitar.mp3";
import RainWav from "../assets/sounds/rain.wav";

const slidesData = [
  {
    id: 1,
    text: "Cat purring",
    image: CatImg,
    audioMp3: CatMp3,
    audioWav: CatWav,
  },
  {
    id: 2,
    text: "Birds singing",
    image: BirdsImg,
    audioMp3: BirdsMp3,
    audioWav: BirdsWav,
  },
  {
    id: 3,
    text: "Waves sound",
    image: BeachImg,
    audioMp3: BeachMp3,
    audioWav: BeachWav,
  },
  {
    id: 4,
    text: "Frogs",
    image: FrogsImg,
    audioMp3: FrogsMp3,
    audioWav: FrogsWav,
  },
  {
    id: 5,
    text: "Rain",
    image: RainImg,
    audioMp3: RainMp3,
    audioWav: RainWav,
  },
];

type Slide = {
  id: number;
  text: string;
  image: string;
  audioMp3: string;
  audioWav: string;
};

export default function Slides() {
  const [slides] = useState<Slide[]>(slidesData);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioElem = React.useRef(new Audio());
  const prevAudioElem = React.useRef(new Audio());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevSlide, setPrevSlide] = useState(slides[1]);

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

    setPrevSlide(slides[currentIndex]);

    const totalCount = slides.length;
    if (index < 0) {
      index = totalCount - 1;
    } else if (index >= totalCount) {
      index = 0;
    }
    setCurrentIndex(index);
  }

  return (
    <div className="slideshow">
      <audio
        src={slides[currentIndex].audioMp3}
        ref={audioElem}
        preload="auto"
        loop
      />
      <audio src={prevSlide.audioMp3} ref={prevAudioElem} preload="auto" loop />
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
          currentSlide={slides[currentIndex]}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
        <Slide
          key={slides[currentIndex].id}
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
  );
}
