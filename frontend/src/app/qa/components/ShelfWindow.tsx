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
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";

interface ShelfWindowProps {
  isOpen: boolean;
  onClose: () => void;
  files: { id: string; name: string; url: string }[];
  onFileSelect: (file: { id: string; name: string; url: string }) => void;
}

export default function ShelfWindow({
  isOpen,
  onClose,
  files,
  onFileSelect,
}: ShelfWindowProps) {
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = files.filter((file) =>
    decodeURIComponent(file.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Files</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup mb={3}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <VStack align="stretch" spacing={3}>
            {filteredFiles.length === 0 ? (
              <Text>No matching files.</Text>
            ) : (
            <RadioGroup
              value={selectedFileId}
              onChange={(val) => setSelectedFileId(val)}
            >
              <VStack align="stretch" spacing={2}>
                {filteredFiles.map((file) => {
                  const isSelected = selectedFileId === file.id;
                  return (
                    <Button
                      key={file.id}
                      onClick={() => setSelectedFileId(file.id)}
                      justifyContent="space-between"
                      variant="outline"
                      w="100%"
                      h="auto"
                      py={3}
                      px={4}
                      borderColor={isSelected ? "teal.400" : "gray.200"}
                      bg={isSelected ? "teal.50" : "white"}
                      _hover={{ bg: "gray.50" }}
                      display="flex"
                      alignItems="center"
                    >
                      <Text textAlign="left" flex="1" whiteSpace="normal">
                        {decodeURIComponent(file.name)}
                      </Text>
                      <Radio isChecked={isSelected} value={file.id} colorScheme="teal" pointerEvents="none" />
                    </Button>
                  );
                })}
              </VStack>
            </RadioGroup>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button onClick={onClose} colorScheme="gray">
            Close
          </Button>
        <Button
          isDisabled={!selectedFileId}
          onClick={() => {
            const selected = files.find((f) => f.id === selectedFileId);
            if (selected) {
              onFileSelect(selected);
              setSelectedFileId("");
              onClose();
            }
          }}
          colorScheme="teal"
        >
          Done
        </Button>

        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
