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
  // Helper to download file
  const downloadFile = (url: string, filename: string) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url.trim().replace(/\r?\n/g, ""); // clean URL
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
                  <Button
                    size="sm"
                    colorScheme="teal"
                    onClick={() => downloadFile(file.url, file.name)}
                  >
                    Download
                  </Button>
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
