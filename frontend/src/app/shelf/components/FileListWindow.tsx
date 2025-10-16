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

import { DownloadIcon } from "@chakra-ui/icons";
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
const downloadFile = async (url: string, filename: string) => {
  if (!url) return;

  let cleanUrl = url.trim().replace(/\r?\n/g, "");
  if (cleanUrl.endsWith("?")) cleanUrl = cleanUrl.slice(0, -1);

  try {
    const response = await fetch(cleanUrl);
    if (!response.ok) throw new Error("Network response was not ok");

    const blob = await response.blob(); // fetch binary data
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", filename || "file.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl); // clean up
  } catch (err) {
    console.error("❌ Failed to download file:", err);
  }
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
                  <Box
                    size="sm"
                    colorScheme="teal"
                    onClick={() => downloadFile(file.url, file.name)}
                  >
                    <DownloadIcon/>
                  </Box>
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
