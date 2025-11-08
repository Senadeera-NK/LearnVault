"use client";

import { useEffect, useState } from "react";
import { Box, Heading, VStack, HStack, Text, Switch } from "@chakra-ui/react";
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

       const settingsOptions = [
            {label:"Enable Notifications", key:"notifications"},
            {label:"Dark Mode", key:"DarkMode"},
            {label:"Auto-Save", key:"autoSave"},
            {label:"Enable/Disable show answers function",key:"Enable/Disable show answers function"}
       ];
  return(
      <>
     <Box className="styles.page"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            pt="10px" >
      <Heading mb="20px" textAlign="center" w="100%">Settings</Heading>
      </Box>
      <Box
            w="70%"
            mx="auto"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="lg"
            mt={8}
            mb={8}
            p={3}
            >
            <VStack spacing={4} align="stretch">
            {settingsOptions.map((option) => (
                  <HStack
                  key={option.key}
                  justifyContent="space-between"
                  p={3}
                  w="100%"
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="md"
                  >
                  <Text>{option.label}</Text>
                  <Switch />
                  </HStack>
            ))}
            </VStack>
            </Box>
      </>
  );}