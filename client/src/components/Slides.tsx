import React from "react";
import Slide from "./Slide.tsx";

type Slide = {
  id: number;
  text: string;
  image: string;
  audioMp3: string;
};

export default function Slides() {
  const [currentSlide, setCurrentSlide] = React.useState<Slide | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [prevSlide, setPrevSlide] = React.useState<Slide | null>(null);

  //get first slide from server
  React.useEffect(() => {
    fetch(`../api/${currentIndex}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something is wrong with network response");
        }
        return res.json();
      })
      .then((data) => setCurrentSlide(data.element))
      .catch((error) => console.error("Error fetching currentSlide:", error));
  }, [currentIndex]);

  //get second slide from server (thought it's called previous)
  React.useEffect(() => {
    fetch("../api/1")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Something is wrong with network response");
        }
        return res.json();
      })
      .then((data) => {setPrevSlide(data.element); setTotalCount(data.totalElements)})
      .catch((error) => console.error("Error fetching prevSlide:", error));
  }, []);


  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const audioElem = React.useRef(new Audio() as HTMLAudioElement);
  const prevAudioElem = React.useRef(new Audio() as HTMLAudioElement);

  function fadeOutAudio(audioRef: React.RefObject<HTMLAudioElement>): void {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio element is not defined");
      return;
    }

    const fadeOutInterval = 10;
    const fadeOutDuration = 2000;
    const volume = audio.volume;
    const step = volume / (fadeOutDuration / fadeOutInterval);

    const fadeOutIntervalId = setInterval(() => {
      if (audio.volume >= step) {
        audio.volume -= step;
      } else {
        audio.currentTime = 0;
        audio.pause();
        clearInterval(fadeOutIntervalId);
      }
    }, fadeOutInterval);
  }

  //just play/pause logic:
  React.useEffect(() => {
    if (isPlaying) {
      setTimeout(() => {
        audioElem.current.play();
      }, 100);
    } else {
      audioElem.current.pause();
    }
  }, [isPlaying, currentIndex]);

  //fading out of previous sound:
  React.useEffect(() => {
    if (isPlaying) {
      prevAudioElem.current.play();
      fadeOutAudio(prevAudioElem);
    }
  }, [currentIndex]);

  function updateIndex(index: number): void {
    prevAudioElem.current.src = audioElem.current.src;
    prevAudioElem.current.volume = audioElem.current.volume;
    prevAudioElem.current.currentTime = audioElem.current.currentTime;

    setPrevSlide(currentSlide);
    
    // Check if the index is within the valid range
    if (index < 0) {
      index = totalCount - 1;
    } else if (index >= totalCount) {
      index = 0;
    }
    setCurrentIndex(index);
  }

  const toggleAudio = () => {
    setIsPlaying((prev) => !prev);
  };

  function handleKeyDown(e: KeyboardEvent): void {
    switch (e.code) {
      case "ArrowLeft":
        updateIndex(currentIndex - 1);
        break;
      case "ArrowRight":
        updateIndex(currentIndex + 1);
        break;
      case "Space":
        toggleAudio();
        break;
      default:
        break;
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (currentSlide && prevSlide) {
    return (
      <div className="slideshow">
        <audio
          src={currentSlide.audioMp3}
          ref={audioElem}
          preload="auto"
          loop
        />
        <audio
          src={prevSlide.audioMp3}
          ref={prevAudioElem}
          preload="auto"
          loop
        />

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
            toggleAudio={toggleAudio}
          />
          <Slide
            key={currentSlide.id}
            className="active"
            currentSlide={prevSlide}
            toggleAudio={toggleAudio}
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
  } else {
    return <h1>Loading...</h1>;
  }
}
