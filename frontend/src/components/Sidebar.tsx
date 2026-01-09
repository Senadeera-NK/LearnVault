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
import {useAuth} from "./AuthContext";

export default function Sidebar() {
  const {user} = useAuth();
  const { open, onOpen, onClose, setOpen } = useDisclosure();
  const [collapsed, setCollapsed] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const drawerContentRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  if (!user || pathname === "/") return null;

  // Close floating actions when clicking outside
  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest('[role="dialog"]')) return;
      if (actionsRef.current && !actionsRef.current.contains(target)) {
        setShowActions(false);
      }
    }

    if (showActions) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [showActions]);

  // Close drawer when clicking outside
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

      {/* Hamburger Button */}
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

      {/* Sidebar Drawer */}
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
          {/* Close button */}
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
            {[{href:"/dashboard", label:"Dashboard"},
            {href:"/qa", label:"Q & A"},
             {href:"/shelf", label:"Shelf"},
              {href:"/settings",label:"Settings"}].map(({href,label}) => (
              <Link key={href} href={href}>
                <Button
                  w="full"
                  colorScheme={isActive(href) ? "teal" : undefined}
                  variant={isActive(href) ? "solid" : "ghost"}
                  onClick={onClose}
                  fontWeight="bold"
                  fontSize={{base:18, md:15, sm:15}}
                >
                  {label}
                </Button>
              </Link>
            ))}
          </VStack>
        </Box>
      )}

      {/* Collapsed Narrow Sidebar */}
      {/* {collapsed && (
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
          <IconButton
            aria-label="Open menu"
            onClick={() => { setCollapsed(false); onOpen(); }}
            size="sm"
            bg="black"
            color="white"
            w="full"
            h="48px"
          >
            <FaBars />
          </IconButton>

          <VStack gap={3} mt={4}>
            {["/dashboard", "/qa", "/shelf", "/settings"].map((href) => (
              <Link key={href} href={href}>
                <IconButton
                  title={href.slice(1)}
                  aria-label={href.slice(1)}
                  size="sm"
                  variant={isActive(href) ? "solid" : "ghost"}
                  colorScheme={isActive(href) ? "teal" : undefined}
                  onClick={() => setCollapsed(false)}
                  w="full"
                  h="40px"
                  display="flex"
                  justifyContent="center"
                >
                  <Box
                    width="6px"
                    height="6px"
                    borderRadius="full"
                    bg={isActive(href) ? "teal.500" : "gray.400"}
                  />
                </IconButton>
              </Link>
            ))}
          </VStack>

          <Box flex={1} />

          <Link href="/settings">
            <IconButton
              aria-label="Profile"
              size="sm"
              variant="ghost"
              title="Settings"
              w="full"
              h="48px"
              display="flex"
              justifyContent="center"
            >
              <Box
                width="20px"
                height="20px"
                borderRadius="full"
                bg="gray.400"
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="12px"
              >
                N
              </Box>
            </IconButton>
          </Link>
        </Box>
      )} */}

      {/* Floating Plus Button */}
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

      {/* Floating Action Buttons */}
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
