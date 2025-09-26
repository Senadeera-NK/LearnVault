"use client";

import { useEffect, useState, useRef } from "react";

export function usePageTimer(paneName:string, onTimeUpdate:(seconds:number)=>void) {
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
   const handleBeforeUnload = () =>{
    const endTime = Date.now();
    const duration = Math.floor((endTime - startTime.current) / 1000); //seconds
    onTimeUpdate(duration);
   };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      const endTime = Date.now();
      const duration = Math.floor((endTime - startTime.current) / 1000); //seconds
      onTimeUpdate(duration);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };

  }, [onTimeUpdate]);

  return;
}