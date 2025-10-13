"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Progress } from "@chakra-ui/react";
import {usePageTimer} from "../../components/UsePageTimer";
import {recordUsage} from "../../../api/api";
import { useAuth } from "@/components/AuthContext";

export default function QA() { 
  const { user } = useAuth();
    // Track page usage
  usePageTimer("Q & A", async (duration) => {
    if (!user) return; // skip if not logged in
    console.log("Q & A page timer callback, duration:", duration);
    console.log("user logged in, recording usage...");
    try {
      await recordUsage(user.id, "Q & A", duration);
      console.log("✅ Recorded usage:", duration, "seconds");
    } catch (err) {
      console.error("❌ Failed to record usage", err);
    }
  });

  console.log("Rendering Q & A for user:", user);
  return(
     <Box className="styles.page"   
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            pt="10px" >
      <Heading mb="20px" textAlign="center" w="100%">Q & A</Heading>
      </Box>
  );}