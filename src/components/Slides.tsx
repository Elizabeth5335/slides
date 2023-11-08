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
  const [activeSlide, setActiveSlide] = useState(slides[1]);
  const audioElem = React.useRef(new Audio());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevSlide, setPrevSlide] = useState(slides[0]);

  // const fadeOutAudio = () => {
  //   const fadeOutInterval = 10;
  //   const fadeOutDuration = 1000;
  //   const volume = audioElem.current.volume;
  //   const step = volume / (fadeOutDuration / fadeOutInterval);

  //   const fadeOutIntervalId = setInterval(() => {
  //     if (audioElem.current.volume >= step) {
  //       audioElem.current.volume -= step;
  //     } else {
  //       // audioElem.current.pause();
  //       audioElem.current.currentTime = 0;
  //       clearInterval(fadeOutIntervalId);
  //     }
  //   }, fadeOutInterval);
  // };

  // const fadeInAudio = () => {
  //   const fadeInInterval = 10;
  //   const fadeInDuration = 2000;
  //   const step = 1 / (fadeInDuration / fadeInInterval);

  //   audioElem.current.volume = 0;

  //   const fadeInIntervalId = setInterval(() => {
  //     if (audioElem.current.volume < 1 - step) {
  //       audioElem.current.volume += step;
  //     } else {
  //       clearInterval(fadeInIntervalId);
  //     }
  //   }, fadeInInterval);
  // };

  useEffect(() => {
    if (isPlaying) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
      audioElem.current.currentTime = 0;
    }
  }, [isPlaying, currentIndex]);



  function updateIndex(index) {
    const totalCount = slides.length;
    setPrevSlide(slides[currentIndex])
    if (index < 0) {
      index = totalCount - 1;
    } else if (index >= totalCount) {
      index = 0;
    }
    setCurrentIndex(index);
  }

  return (
    <div className="slideshow">
      <audio src={slides[currentIndex].audioMp3} ref={audioElem} />
      
      <div
        className="slideshow-slider"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <Slide
            key={slide.id}
            currentSlide={slide}
            activeSlide={activeSlide}
            audioElem={audioElem}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
          />
        ))}
      </div>
      <div className="controls">
        <button onClick={() => updateIndex(currentIndex - 1)}>Previous</button>
        <button onClick={() => updateIndex(currentIndex + 1)}>Next</button>
      </div>
    </div>
  );
}
