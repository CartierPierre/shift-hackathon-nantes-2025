"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Settings, ChevronUp, LockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { Event } from "@/types/events";
import fetch from "cross-fetch";
import { getImagePath } from "@/lib/img";

interface SliderItemProps {
  event: Event;
  onClick: () => void;
  imageTask?:
    | {
        event_id: string;
        task_id: string;
      }
    | undefined;
}

const SliderItem = ({ event, onClick, imageTask }: SliderItemProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollImageStatus = async () => {
      if (!imageTask?.task_id || isPolling) return;

      setIsPolling(true);

      try {
        const response = await fetch(
          `https://uchronia-backend.deploymate.xyz/image-status/${imageTask.task_id}`,
          {
            method: "GET",
            cache: "no-store",
            keepalive: false,
            headers: { "Cache-Control": "no-cache" },
          }
        );
        const data = await response.json();

        if (data.status === "completed" && data.image_url) {
          setImageUrl(data.image_url);
          clearInterval(intervalId);
          setIsPolling(false);
        }
      } catch (error) {
        console.error("Error polling image status:", error);
      }
    };

    if (imageTask?.task_id) {
      // Initial call
      setTimeout(() => {
        pollImageStatus();
      }, 2000);

      // Set up polling interval (every 5 seconds)
      intervalId = setInterval(pollImageStatus, 10000);
    }

    // Clean up interval on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [imageTask]);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
      }).format(date);
    } catch {
      return dateString; // Fallback to the original string if parsing fails
    }
  };

  return (
    <div
      className="flex flex-col h-full w-[350px] rounded-lg overflow-hidden transition-transform duration-300 ease-in-out py-4 px-1"
      {...(!event.isDone && { onClick })}
    >
      <div className="p-4">
        <div className="flex items-center justify-center">
          <div className="w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-r-[16px] border-r-white" />
          <h3 className="text-xl font-bold text-black bg-white text-center px-9 py-2">
            {formatDate(event.date)}
          </h3>
          <div className="w-0 h-0 border-t-[22px] border-t-transparent border-b-[22px] border-b-transparent border-l-[16px] border-white" />
        </div>
      </div>

      <div className="flex-grow relative overflow-hidden bg-black m-h-[300px]">
        <div
          className={` absolute inset-0 transition-all duration-500 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        >
          {(event.image || imageUrl) && (
            <Image
              key={imageUrl || event.image}
              src={
                imageUrl ? getImagePath(imageUrl) : getImagePath(event.image)
              }
              alt={event.title}
              fill
              sizes="342px"
              className="object-cover transition-transform duration-500 ease-in-out"
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
              unoptimized
            />
          )}
        </div>
        {(imageUrl
          ? imageUrl?.includes("amazonaws.com")
          : event.image.includes("amazonaws.com")) && (
          <div className="absolute top-0 left-0 w-full h-full bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/20" />
        )}
        <div
          className={cn(
            "absolute top-[calc(100%-40px)] left-0 right-0 flex flex-col h-full",
            {
              "top-0": isExpanded,
            }
          )}
        >
          <div
            className={clsx("group flex items-start justify-center", {
              "cursor-pointer": !event.isDisabled,
            })}
            {...((event.isDone || event.isDisabled) && {
              onClick: () => {
                setIsExpanded(!isExpanded);
              },
            })}
          >
            <div
              className={clsx(
                "w-0 h-0 border-t-[40px] border-t-transparent border-b-[0px] border-b-transparent border-r-[22px] border-r-black opacity-60 duration-300",
                {
                  "opacity-100": isExpanded,
                  "group-hover:opacity-100": !event.isDisabled,
                }
              )}
            />
            <div
              className={clsx(
                "py-2 bg-black w-full flex items-center justify-center opacity-60  duration-300",
                {
                  "opacity-100": isExpanded,
                  "group-hover:opacity-100": !event.isDisabled,
                }
              )}
            >
              {event.isDone ? (
                <ChevronUp className="text-white bg-black w-6 h-6 transition-transform group-hover:rotate-180 duration-300" />
              ) : event.isDisabled ? (
                <LockIcon className="text-white bg-black w-6 h-6" />
              ) : (
                <Settings className="text-white bg-black w-6 h-6 transition-transform group-hover:rotate-90 duration-300" />
              )}
            </div>
            <div
              className={clsx(
                "w-0 h-0 border-t-[40px] border-t-transparent border-b-[0px] border-b-transparent border-l-[22px] border-black opacity-60 duration-300",
                {
                  "opacity-100": isExpanded,
                  "group-hover:opacity-100": !event.isDisabled,
                }
              )}
            />
          </div>
          {event.isDone ||
            (event.isDisabled && (
              <div className="bg-black flex-grow p-6">
                <p
                  className={`text-white text-base transition-opacity duration-300`}
                >
                  {event.description}
                </p>
              </div>
            ))}
        </div>
      </div>
      <div className="py-4 px-2">
        <div className="flex items-center justify-center">
          <div className="w-0 h-0 border-t-[36px] border-t-transparent border-b-[36px] border-b-transparent border-r-[22px] border-r-white" />
          <h3 className="text-l font-bold text-black bg-white text-center px-9 py-2 overflow-hidden min-h-[72px] flex items-center justify-center">
            {event.title}
          </h3>
          <div className="w-0 h-0 border-t-[36px] border-t-transparent border-b-[36px] border-b-transparent border-l-[22px] border-white" />
        </div>
      </div>
    </div>
  );
};

export default SliderItem;
