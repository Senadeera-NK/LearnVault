"use client";
import { useEffect, useState } from "react";
import { Heading, Progress } from "@chakra-ui/react";

export default function Shelf() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval); // stop at 100%
          return 100;
        }
        return prev + 1; // increase by 1 every 50ms
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="styles.page">
      <Heading position="absolute" left={200}>Shelf</Heading>  
      <Progress position="absolute" top={200} value={progress} max={100} w="800px" />
    </div>
  );
}
