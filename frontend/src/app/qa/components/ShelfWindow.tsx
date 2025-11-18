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
  List,ListItem, Divider
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent h="90vh" maxH="90vH" minH="90vh">
        <ModalHeader>
          Files
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
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={{base:2, md:4}}>
          <VStack align="stretch" spacing={3} h="full" overflow="hidden">
          <VStack align="stretch" 
          spacing={3} 
          h={{base:"25vh", md:"30vh",lg:"35vh"}}
          maxH={{base:"25vh",md:"30vh",lg:"35vh"}} 
          overflow="auto" 
          border="1px solid #e2e88f0" 
          borderRadius="md" p={2}>
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

          <Divider borderColor="gray.500"/>
            {/* 20% CATEGORY SECTION */}
          <VStack
          align="stretch"
          h={{base:"18vh",md:"20vh",lg:"22vh"}}
          maxH={{base:"18vh",md:"20vh",lg:"22vh"}}
          border="1px solid #e2e8f0"
          borderRadius="md"
          p={{base:2,md:3}}>
            <Text fontWeight="bold">QA Categories</Text>
            <List spacing={1}>
              <ListItem border="1px solid #e2e8f0"
          borderRadius="md" p={1}>MCQ</ListItem>
              <ListItem border="1px solid #e2e8f0"
          borderRadius="md" p={1}>QA Facts</ListItem>
              <ListItem border="1px solid #e2e8f0"
          borderRadius="md" p={1}>True/ False</ListItem>
            </List>
          </VStack>

          <Divider borderColor="gray.500"/>
          {/* 10% Questions number input */}
          <VStack
          align="stretch"
          h={{base:"12vh",md:"12vh",lg:"12vh"}}
          justifyContent="center">
            <Text fontWeight="medium">Number of Questions:<Input placeholder="Enter number..."/>
            </Text>
            
          </VStack>
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
