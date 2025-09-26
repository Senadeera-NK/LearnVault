"use client";
import { useEffect, useRef } from "react";

export function usePageTimer(pageName: string, onTimeUpdate: (seconds: number) => void) {
  const startTime = useRef<number>(Date.now());
  const hasRecorded = useRef(false);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (hasRecorded.current) return;
      hasRecorded.current = true;

      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime.current) / 1000); // seconds
      onTimeUpdate(duration);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (hasRecorded.current) return;
      hasRecorded.current = true;

      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime.current) / 1000); // seconds
      onTimeUpdate(duration);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [onTimeUpdate]);

  return;
}