"use client"

import { useState } from "react"
import {IconButton,Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton,Button,Textarea,} from "@chakra-ui/react"
import { EditIcon } from "@chakra-ui/icons"

export default function EditNotepad() {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState("")

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleSave = () => {
    console.log("Saved text:", text)
    // You can save to localStorage, backend, or state here
    closeModal()
  }

  return (
    <>
      <IconButton
        icon={<EditIcon />}
        aria-label="Edit"
        colorScheme="teal"
        position="fixed"
        bottom="6rem"
        right="1.5rem"
        borderRadius="full"
        size="md"
        onClick={openModal}
      />

      <Modal isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your note here..."
              size="md"
              minH="200px"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeModal}>
              Cancel
            </Button>
            <Button colorScheme="teal" onClick={handleSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
