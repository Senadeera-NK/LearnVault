"use client";

import { Box, Button, IconButton, VStack } from "@chakra-ui/react";
import { FaPlus, FaBars } from "react-icons/fa";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import AttachmentButton from "./AttachmentButton";
import EditButton from "./EditButton";
import UserAvatar from "./UserAvatar";
import { useDisclosure } from "@chakra-ui/react";
import { useAuth } from "./AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const { open, onOpen, onClose } = useDisclosure(); // Removed setOpen
  const [_, setCollapsed] = useState(false);        // Changed collapsed to _
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  // Check visibility status here instead of returning early
  const isVisible = user && pathname !== "/";

  useEffect(() => {
    // Only run logic if the sidebar should actually be visible
    if (!isVisible || !showActions) return;

    function handleOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest('[role="dialog"]')) return;
      if (actionsRef.current && !actionsRef.current.contains(target)) {
        setShowActions(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showActions, isVisible]);

  useEffect(() => {
    // Only run logic if the sidebar should actually be visible
    if (!isVisible || !open) return;

    function handleDocClick(event: MouseEvent) {
      const target = event.target as Node;
      if (drawerContentRef.current && !drawerContentRef.current.contains(target)) {
        onClose();
        setCollapsed(true);
      }
    }

    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [open, onClose, isVisible]);

  // FINAL RENDER LOGIC
  if (!isVisible) return null;

  return (
    <>
      <UserAvatar />
      <IconButton
        aria-label="Open menu"
        onClick={() => { setCollapsed(false); onOpen(); }}
        position="fixed"
        top="1rem"
        left="1rem"
        zIndex={1100}
        bg="black"
        color="white"
        borderRadius="md"
      >
        <FaBars />
      </IconButton>

      {open && (
        <Box
          ref={drawerContentRef}
          position="fixed"
          top={0}
          left={0}
          w="250px"
          h="100vh"
          bg="white"
          shadow="md"
          zIndex={1000}
        >
          <IconButton
            aria-label="Close menu"
            onClick={onClose}
            position="fixed"
            top="1rem"
            left="1rem"
            zIndex={1100}
            bg="black"
            color="white"
            borderRadius="md"
          >
            <FaBars />
          </IconButton>

          <VStack align="stretch" gap={4} p={4}>
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/qa", label: "Q & A" },
              { href: "/shelf", label: "Shelf" },
              { href: "/settings", label: "Settings" }
            ].map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button
                  w="full"
                  colorScheme={isActive(href) ? "teal" : undefined}
                  variant={isActive(href) ? "solid" : "ghost"}
                  onClick={onClose}
                  fontWeight="bold"
                  fontSize={{ base: 18, md: 15, sm: 15 }}
                >
                  {label}
                </Button>
              </Link>
            ))}
          </VStack>
        </Box>
      )}

      <IconButton
        aria-label="Add new item"
        colorScheme="teal"
        position="fixed"
        bottom="1.5rem"
        right="1.5rem"
        borderRadius="full"
        size="lg"
        zIndex={1000}
        onClick={() => setShowActions(!showActions)}
      >
        <FaPlus />
      </IconButton>

      {showActions && (
        <Box
          ref={actionsRef}
          position="fixed"
          bottom="1.5rem"
          right="5.5rem"
          display="flex"
          flexDirection="row"
          gap={4}
          zIndex={10000}
          alignItems="center"
        >
          <AttachmentButton />
          <EditButton />
        </Box>
      )}
    </>
  );
}