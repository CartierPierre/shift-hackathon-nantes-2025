"use client";

import { useRef, useState, useEffect } from "react";
import SliderItem from "./SliderItem";
import styles from "./slider.module.css";
import { Modal } from "./Modal";
import { Event } from "@/types/events";
import { updateEvents } from "@/services/api";

export const Slider = ({ events }: { events: Event[] }) => {
  const [selectedCard, setSelectedCard] = useState<Event | null>(null);
  const [imageTasks, setImageTasks] = useState<
    {
      event_id: string;
      task_id: string;
    }[]
  >([]);
  const [cards, setCards] = useState<Event[]>(events);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Handle background audio
  useEffect(() => {
    // Only attempt to play if we've had user interaction
    if (audioInitialized) {
      if (!selectedCard) {
        if (!audioRef.current) {
          audioRef.current = new Audio(`/music-bg/background_1.mp3`);
          audioRef.current.loop = true;
        }

        if (!isMuted) {
          audioRef.current
            .play()
            .catch((err) => console.error("Error playing audio:", err));
        }
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [selectedCard, audioInitialized, isMuted]);

  // Initialize audio on first user interaction
  const initializeAudio = () => {
    if (!audioInitialized) {
      setAudioInitialized(true);
    }
  };

  // Change audio file when card is closed
  const handleCloseCard = () => {
    setSelectedCard(null);
  };

  // Toggle mute
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click handlers
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current
          .play()
          .catch((err) => console.error("Error playing audio:", err));
      } else {
        audioRef.current.pause();
      }
    }
    // Initialize audio if this is the first interaction
    if (!audioInitialized) {
      setAudioInitialized(true);
    }
  };

  // Handle mouse down event for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    initializeAudio();
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setStartY(e.pageY - (sliderRef.current?.offsetTop || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
    setScrollTop(sliderRef.current?.scrollTop || 0);
  };

  // Handle mouse move event for dragging
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    if (sliderRef.current) {
      const x = e.pageX - (sliderRef.current.offsetLeft || 0);
      const y = e.pageY - (sliderRef.current.offsetTop || 0);
      const walkX = (x - startX) * 2; // Multiply for faster scrolling
      const walkY = (y - startY) * 2;

      sliderRef.current.scrollLeft = scrollLeft - walkX;
      sliderRef.current.scrollTop = scrollTop - walkY;
    }
  };

  // Handle mouse up event for dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle wheel event to transform both vertical and horizontal scroll to slider movement
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    if (sliderRef.current) {
      // Convert both vertical (deltaY) and horizontal (deltaX) scroll to horizontal movement
      sliderRef.current.scrollLeft += e.deltaY + e.deltaX;
    }
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    initializeAudio();
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX - (sliderRef.current?.offsetLeft || 0));
      setStartY(e.touches[0].clientY - (sliderRef.current?.offsetTop || 0));
      setScrollLeft(sliderRef.current?.scrollLeft || 0);
      setScrollTop(sliderRef.current?.scrollTop || 0);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    if (sliderRef.current) {
      const x = e.touches[0].clientX - (sliderRef.current.offsetLeft || 0);
      const y = e.touches[0].clientY - (sliderRef.current.offsetTop || 0);
      const walkX = (x - startX) * 1.5;
      const walkY = (y - startY) * 1.5;

      sliderRef.current.scrollLeft = scrollLeft - walkX;
      sliderRef.current.scrollTop = scrollTop - walkY;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    document.addEventListener("touchend", handleTouchEnd);

    // Add wheel event listener to enable vertical scroll to horizontal conversion
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener
      );
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("wheel", handleWheel);
    };
  }, [isDragging, startX, startY, scrollLeft, scrollTop]);

  const onCreateNewEvent = async (optionIndex: number) => {
    if (!selectedCard) return;

    try {
      const optionChosen = `${selectedCard.id}_${optionIndex}`;
      const response = await updateEvents({
        events: cards,
        option_chosen: optionChosen,
        model: "gpt-4o",
        temperature: 0.7,
      });

      // Find the index of the current card
      const currentCardIndex = cards.findIndex(
        (card) => card.id === selectedCard.id
      );

      // Update the selected card's image with the chosen option's image
      const updatedCards = [...cards];
      updatedCards[currentCardIndex] = {
        ...updatedCards[currentCardIndex],
        title: selectedCard.options[optionIndex].title,
        image: selectedCard.options[optionIndex].img,
        description: selectedCard.options[optionIndex].consequence,
        isDone: true,
      };

      // Set isDisabled to true for all cards before the selected card
      for (let i = 0; i < currentCardIndex; i++) {
        updatedCards[i] = {
          ...updatedCards[i],
          isDisabled: true,
        };
      }

      const newCards = [
        ...updatedCards.slice(0, currentCardIndex + 1),
        ...response.events,
      ];

      setCards(newCards);
      setImageTasks(
        response.image_tasks.filter((task) => task.event_id !== selectedCard.id)
      );
    } catch (error) {
      console.error("Error updating events:", error);
    }
  };

  return (
    <>
      <div className={styles.sliderWrapper}>
        <div
          ref={sliderRef}
          className={`${styles.slider} ${styles.scrollContainer} ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          style={{
            overscrollBehavior: "contain",
          }}
        >
          {cards.map((card) => (
            <SliderItem
              key={card.id}
              event={card}
              imageTask={imageTasks.find((task) => {
                return task.event_id === card.id;
              })}
              onClick={() => {
                initializeAudio();
                setSelectedCard(card);
              }}
            />
          ))}
        </div>

        <button
          onClick={toggleMute}
          style={{
            position: "fixed",
            top: "8px",
            right: "8px",
            zIndex: 1,
            background: "rgba(0,0,0,0.7)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>
      {selectedCard && (
        <Modal
          title={selectedCard.title}
          date={selectedCard.date}
          content={selectedCard.description}
          onClose={handleCloseCard}
          onCreateNewEvent={onCreateNewEvent}
          options={selectedCard.options}
          music_file={selectedCard.music_file}
        />
      )}
    </>
  );
};
