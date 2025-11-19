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
  List,
  ListItem,
  Input,
  Divider,
  RadioGroup,
  Radio
} from "@chakra-ui/react";
import { ChangeEvent, useState } from "react";

interface ShelfWindowProps {
  isOpen: boolean;
  onClose: () => void;
  files: { id: string; name: string; url: string }[];
  onDone: (file: { id: string; name: string; url: string }, category: string, qCount: number) => void;
}

export default function ShelfWindow({ isOpen, onClose, files, onDone }: ShelfWindowProps) {
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [qCount, setQCount] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredFiles = files.filter((file) =>
    decodeURIComponent(file.name).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleQCountChange = (e: ChangeEvent<HTMLInputElement>) => {
    let num = Number(e.target.value);
    if (num > 20) num = 20;
    if (num < 1) num = 1;
    setQCount(String(num));
  };

  const handleDone = () => {
    const file = files.find((f) => f.id === selectedFileId);
    if (!file || !selectedCategory || !qCount) return;
    onDone(file, selectedCategory, Number(qCount));
    setSelectedFileId("");
    setSelectedCategory("");
    setQCount("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select File & QA Options</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* File Selection */}
            <VStack
              align="stretch"
              spacing={3}
              h={{ base: "25vh", md: "30vh", lg: "35vh" }}
              maxH={{ base: "25vh", md: "30vh", lg: "35vh" }}
              overflow="auto"
              border="1px solid #e2e8f0"
              borderRadius="md"
              p={2}
            >
              {filteredFiles.length === 0 ? (
                <Text>No matching files.</Text>
              ) : (
                <RadioGroup value={selectedFileId} onChange={(val) => setSelectedFileId(val)}>
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

            <Divider />

            {/* Category Selection */}
            <VStack spacing={1} align="stretch">
              <Text fontWeight="bold">QA Categories</Text>
              <List spacing={1}>
                {["MCQ", "True/ False", "QA Facts"].map((cat) => (
                  <ListItem
                    key={cat}
                    border="1px solid #e2e8f0"
                    borderRadius="md"
                    p={2}
                    cursor="pointer"
                    bg={selectedCategory === cat ? "teal.50" : "transparent"}
                    _hover={{ bg: "gray.50" }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </ListItem>
                ))}
              </List>
            </VStack>

            <Divider />

            {/* Number of Questions */}
            <HStack spacing={3}>
              <Text fontWeight="medium">Number of Questions:</Text>
              <Input
                type="number"
                value={qCount}
                onChange={handleQCountChange}
                placeholder="Enter number..."
                max={20}
                min={1}
                maxW="12vw"
              />
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button onClick={onClose} colorScheme="gray">
            Close
          </Button>
          <Button onClick={handleDone} colorScheme="teal" isDisabled={!selectedFileId || !selectedCategory || !qCount}>
            Done
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
