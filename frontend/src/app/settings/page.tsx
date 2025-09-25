"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Progress } from "@chakra-ui/react";

export default function Settings() { 
  return(
     <Box className="styles.page"   
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            pt="10px" >
      <Heading mb="20px" alignItems="center">Settings</Heading>
      </Box>
  );}