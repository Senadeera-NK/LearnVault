"use client"

import { useState } from "react"
import { IconButton, DialogRoot as Modal, DialogBackdrop as ModalOverlay, DialogContent as ModalContent, DialogHeader as ModalHeader, DialogFooter as ModalFooter, DialogBody as ModalBody, DialogCloseTrigger as ModalCloseButton, Button, Textarea, } from "@chakra-ui/react"
import { FiEdit } from "react-icons/fi";
import {txt_file_convert} from "../../api/api"
import { useAuth } from "./AuthContext";

export default function EditNotepad() {
  const [isOpen, setIsOpen] = useState(false)
  const [text, setText] = useState("")
  const [title, setTitle] = useState("")

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const { user } = useAuth();

  const handleSave = async () => {
    console.log("Title: ", title)
    console.log("Saved text:", text)

    //calling the API, for txt to pdf conversion
    if (!user) return;
    try{
      await txt_file_convert(user.id,title, text);
      console.log("successfully passed the text, and title");
    }
    catch(error){
      console.log("Error occured:",error);
    }
    closeModal()
  }

  return (
    <>
      <IconButton
        aria-label="Edit"
        colorScheme="teal"
        position="fixed"
        bottom="6rem"
        right="1.5rem"
        borderRadius="full"
        size="md"
        zIndex={1}
        onClick={openModal}
      >
        <FiEdit />
      </IconButton>

      <Modal open={isOpen} onOpenChange={(open) => { if (!open) closeModal(); }} size="xl">
        <ModalOverlay zIndex={1400} />
        <ModalContent zIndex={1500}>
          <ModalHeader>Edit Note</ModalHeader>
          <ModalCloseButton />
           <ModalBody>
            <Textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write the document title..."
              size="md"
              minH="50px"
            />
          </ModalBody>

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
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
