"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  HStack,
  Text,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import { IconButton , Input, InputGroup, InputLeftElement} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";
import { useEffect, useState, useRef } from "react";
interface ShelfWindowProps {
  isOpen: boolean;
  onClose: () => void;
  files: { id: string; name: string; url: string }[];
}

export default function ShelfWindow({
  isOpen,
  onClose,
  files,
}: ShelfWindowProps) {

const [selectedFileId, setSelectedFileId] = useState<string>("");

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Files</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={3}>
            {files.length === 0 ? (
              <Text>No files.</Text>
            ) : (
              <RadioGroup value={selectedFileId} onChange={setSelectedFileId}>
                <VStack align="stretch" spacing={2}>
              {files.map((file) => (
                <HStack
                  key={file.id}
                  justifyContent="space-between"
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                  p={2}
                >
                  <Text>{decodeURIComponent(file.name)}</Text>
                    <Radio value={file.id} colorScheme="teal"/>
                </HStack>
              ))}
              </VStack>
              </RadioGroup>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button onClick={onClose} colorScheme="gray">
            Close
          </Button>
          <Button isDisabled={!selectedFileId} onClick={()=>{
            const selected = files.find((f)=>f.id === selectedFileId);
            console.log("selected file: ", selected);
            onClose();
          }} colorScheme="gray">
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}