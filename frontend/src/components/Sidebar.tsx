"use client";

import { useDisclosure, Box, DrawerRoot as Drawer, DrawerBody, DrawerHeader, DrawerBackdrop as DrawerOverlay, DrawerContent, DrawerCloseTrigger as DrawerCloseButton, Button, IconButton, VStack } from "@chakra-ui/react";
import { HamburgerIcon, AddIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import AttachmentButton from "./AttachmentButton";
import EditButton from "./EditButton";
import UserAvatar from "./UserAvatar";

export default function Sidebar() {
  const { open, onOpen, onClose } = useDisclosure();
  const [collapsed, setCollapsed] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLInputElement>(null);
  const drawerContentRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname(); // get current route

  // Helper function to determine active link
  const isActive = (href: string) => pathname === href;

    useEffect(() => {
      function handleOutside(event: MouseEvent) {
        const target = event.target as HTMLElement
        if(target.closest('[role="dialog"]')){
          return
        }
        if (
          actionsRef.current &&
          !actionsRef.current.contains(target)
        ) {
          setShowActions(false);
        }
      }

      if (showActions) {
        // Detect both click and hover outside
        document.addEventListener("mousedown", handleOutside);
      //  document.addEventListener("mousemove", handleOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleOutside);
   //     document.removeEventListener("mousemove", handleOutside);
      };
    }, [showActions]);

    useEffect(() => {
      if (!open) return;

      function handleDocClick(event: MouseEvent) {
        const target = event.target as Node;
        if (drawerContentRef.current && !drawerContentRef.current.contains(target)) {
          onClose();
          setCollapsed(true);
        }
      }

      document.addEventListener("mousedown", handleDocClick);
      return () => document.removeEventListener("mousedown", handleDocClick);
    }, [open, onClose]);

        
  return (
    <>
      <UserAvatar />
      {/* Hamburger Button (Top Left) */}
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
        <HamburgerIcon />
      </IconButton>
      

      {/* Sidebar Drawer */}
      <Drawer open={open} placement="start" onOpenChange={(open) => { if (!open) onClose(); }}>
        {/* clicking the overlay will close drawer and set collapsed state to true (shrinks to narrow sidebar) */}
        <DrawerOverlay />
        <DrawerContent ref={(el: any) => (drawerContentRef.current = el)}>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>

          <DrawerBody>
            <VStack align="stretch" gap={4}>
              <Link href="/dashboard">
                <Button w="full" onClick={onClose} colorScheme={isActive("/dashboard") ? "teal" : undefined} variant={isActive("/dashboard") ? "solid" : "ghost"}>
                  Dashboard
                </Button>
              </Link>
              <Link href="/qa">
                <Button w="full" onClick={onClose} colorScheme={isActive("/qa") ? "teal" : undefined} variant={isActive("/qa") ? "solid" : "ghost"}>
                  Q&A
                </Button>
              </Link>
              <Link href="/shelf">
                <Button w="full" onClick={onClose} colorScheme={isActive("/shelf") ? "teal" : undefined} variant={isActive("/shelf") ? "solid" : "ghost"}>
                  Shelf
                </Button>
              </Link>
              <Link href="/settings">
                <Button w="full" onClick={onClose} colorScheme={isActive("/settings") ? "teal" : undefined} variant={isActive("/settings") ? "solid" : "ghost"}>
                  Settings
                </Button>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Close drawer when clicking outside the drawer content */}
      {/* Listen for clicks outside the DrawerContent and close + collapse */}
      {null}

      {/* Collapsed narrow sidebar (shows when user clicked background) */}
      {collapsed && (
        <Box
          position="fixed"
          left={0}
          top={0}
          height="100vh"
          width="56px"
          bg="gray.50"
          borderRight="1px solid"
          borderColor="gray.200"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={4}
          py={4}
          zIndex={1000}
          transition="width 200ms ease"
        >
          <IconButton aria-label="Open menu" onClick={() => { setCollapsed(false); onOpen(); }} size="sm" bg="black" color="white" w="full" h="48px">
            <HamburgerIcon />
          </IconButton>

          <VStack gap={3} mt={4}>
            <Link href="/dashboard">
              <IconButton title="Dashboard" aria-label="Dashboard" size="sm" variant={isActive("/dashboard") ? "solid" : "ghost"} colorScheme={isActive("/dashboard") ? "teal" : undefined} onClick={() => setCollapsed(false)} w="full" h="40px" display="flex" justifyContent="center">
                <Box width="6px" height="6px" borderRadius="full" bg={isActive("/dashboard") ? "teal.500" : "gray.400"} />
              </IconButton>
            </Link>

            <Link href="/qa">
              <IconButton title="Q&A" aria-label="Q&A" size="sm" variant={isActive("/qa") ? "solid" : "ghost"} colorScheme={isActive("/qa") ? "teal" : undefined} onClick={() => setCollapsed(false)} w="full" h="40px" display="flex" justifyContent="center">
                <Box width="6px" height="6px" borderRadius="full" bg={isActive("/qa") ? "teal.500" : "gray.400"} />
              </IconButton>
            </Link>

            <Link href="/shelf">
              <IconButton title="Shelf" aria-label="Shelf" size="sm" variant={isActive("/shelf") ? "solid" : "ghost"} colorScheme={isActive("/shelf") ? "teal" : undefined} onClick={() => setCollapsed(false)} w="full" h="40px" display="flex" justifyContent="center">
                <Box width="6px" height="6px" borderRadius="full" bg={isActive("/shelf") ? "teal.500" : "gray.400"} />
              </IconButton>
            </Link>

            <Link href="/settings">
              <IconButton title="Settings" aria-label="Settings" size="sm" variant={isActive("/settings") ? "solid" : "ghost"} colorScheme={isActive("/settings") ? "teal" : undefined} onClick={() => setCollapsed(false)} w="full" h="40px" display="flex" justifyContent="center">
                <Box width="6px" height="6px" borderRadius="full" bg={isActive("/settings") ? "teal.500" : "gray.400"} />
              </IconButton>
            </Link>
          </VStack>

          <Box flex={1} />
          <Link href="/settings">
            <IconButton aria-label="Profile" size="sm" variant="ghost" title="Settings" w="full" h="48px" display="flex" justifyContent="center">
              <Box width="20px" height="20px" borderRadius="full" bg="gray.400" color="white" display="flex" alignItems="center" justifyContent="center" fontSize="12px">N</Box>
            </IconButton>
          </Link>
        </Box>
      )}

      {/* Floating Plus Button (Bottom Right) */}
      <IconButton aria-label="Add new item" colorScheme="teal" position="fixed" bottom="1.5rem" right="1.5rem" borderRadius="full" size="lg" zIndex="1000" onClick={() => setShowActions(!showActions)}>
        <AddIcon />
      </IconButton>

      {showActions && (
        <Box ref={actionsRef}>
          <AttachmentButton />
          <EditButton />
        </Box>
      )}
    </>
  );
}
