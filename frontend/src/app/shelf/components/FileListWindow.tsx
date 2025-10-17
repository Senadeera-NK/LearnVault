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
  Box,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
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

const downloadAll = () => {
  files.forEach((file) => downloadFile(file.url, file.name));
  console.log("Downloading all files in category:", category);
}

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
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
                    <IconButton
                      aria-label={`Download ${file.name}`}
                      icon={<DownloadIcon />}
                      size="sm"
                      colorScheme="teal"
                      variant="ghost"
                      onClick={() => downloadFile(file.url, file.name)}
                    />

                </HStack>
              ))
            )}
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="space-between">
          <Button onClick={onClose} colorScheme="gray">
            Close
          </Button>
          <Button onClick={downloadAll} colorScheme="gray">
            Download All
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}