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
  Link,
} from "@chakra-ui/react";

interface FileListWindowProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  files: { id: string; name: string; url: string }[];
}

export default function FileListWindow({
  isOpen,
  onClose,
  category,
  files,
}: FileListWindowProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{category || "Uncategorized"} Files</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="stretch" spacing={3}>
            {files.length === 0 ? (
              <Text>No files in this category.</Text>
            ) : (
              files.map((file) => (
                <HStack
                  key={file.id}
                  justifyContent="space-between"
                  border="1px solid #E2E8F0"
                  borderRadius="md"
                  p={2}
                >
                  <Text>{file.name}</Text>
                  <Link href={file.url} isExternal>
                    <Button size="sm" colorScheme="teal">
                      Download
                    </Button>
                  </Link>
                </HStack>
              ))
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} colorScheme="gray">
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
