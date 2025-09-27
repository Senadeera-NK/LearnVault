"use client";
import { useEffect, useState } from "react";
import { Box, Heading, Progress } from "@chakra-ui/react";
import {usePageTimer} from "../../components/UsePageTimer";
import {recordUsage} from "../../../services/api";
import { useAuth } from "@/components/AuthContext";

export default function Shelf() {
   const { user } = useAuth();
    // Track page usage
  usePageTimer("Shelf", async (duration) => {
    if (!user) return; // skip if not logged in
    console.log("Shelf page timer callback, duration:", duration);
    console.log("user logged in, recording usage...");
    try {
      await recordUsage(user.id, "Shelf", duration);
      console.log("✅ Recorded usage:", duration, "seconds");
    } catch (err) {
      console.error("❌ Failed to record usage", err);
    }
  });

  console.log("Rendering Shelf for user:", user);
  
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
            justifyContent="flex-start"
            pt="10px" // padding from top
      >
      <Heading mb="20px" textAlign="center" w="100%">Shelf</Heading>
       <Box position="absolute" top="600px" left="50%" transform="translateX(-50%)">
        <Heading mb="15px" alignItems="center">Loading.....</Heading>
        <Progress alignItems="center" value={progress} max={100} w="800px" size="lg" />
      </Box>
    </Box>
  );
}
