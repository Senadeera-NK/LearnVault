"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Button, VStack } from "@chakra-ui/react";
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
    <>
     <Box className="styles.page"
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            pt="10px" >
      <Heading mb="20px" textAlign="center" w="100%">Q & A</Heading>
      </Box>
      <Box
      display="flex"
      justifyContent="space-between"
      w="90%"
      mx="auto"
      mt={0}
      mb={0}>
      <Box
        w="30%"
        mx="auto"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        p={3}
        >
          <VStack spacing={3} align="stretch">
          <Button colorScheme="gray" w="100%">Add from shelf</Button>
          <Button colorScheme="gray" w="100%">Upload from the device</Button>
          </VStack>

        </Box>
        <Box
        w="60%"
        mx="auto"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        p={3}
        >

          
        </Box>
        </Box>
      </>
  );}