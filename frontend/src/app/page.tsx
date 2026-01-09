"use client";
import React, { useState } from "react";
import AuthModal from "../components/AuthModal";
import { Box, Button, Heading, Text, VStack, Container } from "@chakra-ui/react";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import FAQ from "@/sections/FAQ";
import HowItWorks from "@/sections/HowItWorks";
import Footer from "@/sections/Footer";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <Box as="main" minH="100vh" bg="white">
      {/* Hero Section */}
      <Header/>
      <Hero/>
      <Features/>
      <HowItWorks/>
      <FAQ/>
      <Footer/>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </Box>
  );
}