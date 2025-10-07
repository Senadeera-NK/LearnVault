"use client";
import { useEffect, useState, useCallback } from "react";
import { Box, Heading, Progress } from "@chakra-ui/react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage } from "../../../services/api";
import { useAuth } from "@/components/AuthContext";
import { fetch_user_pdfs } from "../../../services/api";


export default function Shelf() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);

  // Memoize the callback so usePageTimer doesn't re-subscribe on every render
  const recordShelfUsage = useCallback(
    async (duration:number) => {
      if (!user) return;
      console.log("Shelf page timer callback, duration:", duration);
      try {
        await recordUsage(user.id, "Shelf", duration);
        console.log("✅ Recorded usage:", duration, "seconds");
      } catch (err) {
        console.error("❌ Failed to record usage", err);
      }
    },
    [user]
  );

  // Track page usage
  usePageTimer("Shelf", recordShelfUsage);

  // Progress bar animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  console.log("Rendering Shelf for user:", user);

  return (
    <Box
      className="styles.page"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      pt="10px"
    >
      <Heading mb="20px" textAlign="center" w="100%">
        Shelf
      </Heading>
      <Box
        position="absolute"
        top="600px"
        left="50%"
        transform="translateX(-50%)"
      >
        <Heading mb="15px" alignItems="center">
          Loading.....
        </Heading>
        <Progress alignItems="center" value={progress} max={100} w="800px" size="lg" />
      </Box>
    </Box>
  );
}
