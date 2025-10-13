"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Progress } from "@chakra-ui/react";
import {usePageTimer} from "../../components/UsePageTimer";
import {recordUsage} from "../../../api/api";
import { useAuth } from "@/components/AuthContext";

export default function Settings() { 
      const { user } = useAuth();
      // Track page usage
      usePageTimer("Settings", async (duration) => {
      if (!user) return; // skip if not logged in
      console.log("Settings page timer callback, duration:", duration);
      console.log("user logged in, recording usage...");
      try {
            await recordUsage(user.id, "Settings", duration);
            console.log("✅ Recorded usage:", duration, "seconds");
      } catch (err) {
            console.error("❌ Failed to record usage", err);
      }
      });

       console.log("Rendering Settings for user:", user);
  return(
     <Box className="styles.page"   
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            pt="10px" >
      <Heading mb="20px" textAlign="center" w="100%">
Settings</Heading>
      </Box>
  );}