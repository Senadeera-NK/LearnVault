"use client";

import {
  DialogRoot,
  DialogBackdrop,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogCloseTrigger,
  DialogBody,
  DialogFooter,
  Button,
  Box,
  VStack,
  HStack,
  Text,
  
  Input,
    Separator,
} from "@chakra-ui/react";
import { ChangeEvent, useState, useRef, useEffect } from "react";

interface ShelfWindowProps {
  isOpen: boolean;
  onClose: () => void;
  files: { id: string; name: string; url: string }[];
  onDone: (file: { id: string; name: string; url: string }, category: string, qCount: number) => void;
}

export default function ShelfWindow({ isOpen, onClose, files, onDone }: ShelfWindowProps) {
  const contentRef = useRef<HTMLElement | null>(null);
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

  const handleClose = () =>{
    setSelectedFileId("");
    setSelectedCategory("");
    setQCount("");
    onClose();
  }

  useEffect(() => {
    if (!isOpen) return;

    function handleDocClick(event: MouseEvent) {
      const target = event.target as Node;
      if (contentRef.current && !contentRef.current.contains(target)) {
        handleClose();
      }
    }

    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [isOpen, handleClose]);

  return (
    <DialogRoot open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
      {/* Clicking the backdrop should close the dialog */}
      <DialogBackdrop onClick={handleClose} />
      <DialogPositioner>
        <DialogContent ref={(el: any) => (contentRef.current = el)} maxW="3xl">
          <DialogHeader>Select File & QA Options</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>
            <VStack gap={4} align="stretch">
              {/* File Selection */}
              <VStack
                align="stretch"
                gap={3}
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
                  <VStack align="stretch" gap={2}>
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
                          borderColor={isSelected ? "gray.500" : "gray.200"}
                          bg={isSelected ? "gray.500" : "white"}
                          // _hover={{ bg: "gray.50" }}
                          display="flex"
                          alignItems="center"
                        >
                          <Text textAlign="left" flex="1" whiteSpace="normal" wordBreak="break-word" maxW="100%">
                            {decodeURIComponent(file.name)}
                          </Text>
                          <input type="radio" checked={isSelected} readOnly style={{ pointerEvents: "none" }} />
                        </Button>
                      );
                    })}
                  </VStack>
                )}
              </VStack>

              <Separator />

              {/* Category Selection */}
              <VStack gap={1} align="stretch">
                <Text fontWeight="bold">QA Categories</Text>
                <VStack gap={1} align="stretch">
                  {(["MCQ", "True/False", "Facts Questions"]).map((cat) => (
                    <Box
                      key={cat}
                      border="1px solid #e2e8f0"
                      borderRadius="md"
                      p={2}
                      cursor="pointer"
                      bg={selectedCategory === cat ? "gray.500" : "transparent"}
                    //  _hover={{ bg: "gray.50" }}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Box>
                  ))}
                </VStack>
              </VStack>

              <Separator />

              {/* Number of Questions */}
              <HStack gap={3}>
                <Text fontWeight="medium">Number of Questions:</Text>
                <Input
                  type="number"
                  value={qCount}
                  onChange={handleQCountChange}
                  placeholder="Enter a number..."
                  max={20}
                  min={1}
                  maxW={{ base: "40%", md: "15vw" }}
                />
              </HStack>
            </VStack>
          </DialogBody>

          <DialogFooter justifyContent="space-between">
            <Button onClick={handleClose} colorScheme="gray" >
              Close
            </Button>
            <Button onClick={handleDone} colorScheme="teal" disabled={!selectedFileId || !selectedCategory || !qCount}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
