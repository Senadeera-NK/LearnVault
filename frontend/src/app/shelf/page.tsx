"use client";
import { useEffect, useState } from "react";
import { Box, Heading, Progress } from "@chakra-ui/react";

export default function Shelf() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1)); // loop from 0 to 100
    }, 20); // faster increment for smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      className="styles.page"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      pt="10px" // padding from top
    >
      <Heading mb="20px" alignItems="center">Shelf</Heading>
      <Progress alignItems="center" value={progress} max={100} w="400px" size="lg" />
    </Box>
  );
}
