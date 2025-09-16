"use client"

import { useDisclosure, Box, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, IconButton, VStack, ScaleFade } from "@chakra-ui/react"
import { HamburgerIcon, AddIcon, AttachmentIcon, EditIcon} from "@chakra-ui/icons"
import Link from "next/link"
import { useState } from "react"
import { useRef } from "react"
import AttachmentButton from "./AttachmentButton"
import EditButton from "./EditButton"


export default function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showActions, setShowActions] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
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
              <Button as={Link} href="/dashboard" onClick={onClose}>
                Dashboard
              </Button>
              <Button as={Link} href="/qa" onClick={onClose}>
                Q&A
              </Button>
              <Button as={Link} href="/storage" onClick={onClose}>
                Storage
              </Button>
              <Button as={Link} href="/settings" onClick={onClose}>
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

      {showActions && 
      <>
      <AttachmentButton/>
      <EditButton/>
      </>}
    </>
  )
}
