"use client";

import { useDisclosure, Box, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, IconButton, VStack } from "@chakra-ui/react";
import { HamburgerIcon, AddIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import AttachmentButton from "./AttachmentButton";
import EditButton from "./EditButton";
import UserAvatar from "./UserAvatar";

export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showActions, setShowActions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname(); // get current route

  // Helper function to determine active link
  const isActive = (href: string) => pathname === href;

  return (
    <>
      <UserAvatar />
      {/* Hamburger Button (Top Left) */}
      <IconButton
        icon={<HamburgerIcon />}
        aria-label="Open menu"
        position="fixed"
        top="1rem"
        left="1rem"
        zIndex="1000"
        onClick={onOpen}
      />

      {/* Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader></DrawerHeader>

          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <Button
                as={Link}
                href="/dashboard"
                onClick={onClose}
                colorScheme={isActive("/dashboard") ? "teal" : undefined}
                variant={isActive("/dashboard") ? "solid" : "ghost"}
              >
                Dashboard
              </Button>
              <Button
                as={Link}
                href="/qa"
                onClick={onClose}
                colorScheme={isActive("/qa") ? "teal" : undefined}
                variant={isActive("/qa") ? "solid" : "ghost"}
              >
                Q&A
              </Button>
              <Button
                as={Link}
                href="/storage"
                onClick={onClose}
                colorScheme={isActive("/storage") ? "teal" : undefined}
                variant={isActive("/storage") ? "solid" : "ghost"}
              >
                Storage
              </Button>
              <Button
                as={Link}
                href="/settings"
                onClick={onClose}
                colorScheme={isActive("/settings") ? "teal" : undefined}
                variant={isActive("/settings") ? "solid" : "ghost"}
              >
                Settings
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Floating Plus Button (Bottom Right) */}
      <IconButton
        icon={<AddIcon />}
        aria-label="Add new item"
        colorScheme="teal"
        position="fixed"
        bottom="1.5rem"
        right="1.5rem"
        borderRadius="full"
        size="lg"
        zIndex="1000"
        onClick={() => setShowActions(!showActions)}
      />

      {showActions && (
        <>
          <AttachmentButton />
          <EditButton />
        </>
      )}
    </>
  );
}
