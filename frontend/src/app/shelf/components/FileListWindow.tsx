import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { DownloadIcon } from "@chakra-ui/icons";

export default function FileListWindow({ isOpen, onClose, category, files }: any) {
  const getFileName = (url: string) => {
    try {
      const path = url.split("/").pop() || "";
      return path.split("?")[0];
    } catch {
      return url;
    }
  };

  return (
    <Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent maxW="900px">
          <ModalHeader fontWeight="bold" fontSize="xl">
            {category}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {files.length === 0 ? (
              <Text>No files in this category</Text>
            ) : (
              <VStack align="stretch" spacing={0}>
                {files.map((file: any, index: number) => (
                  <Box
                    key={index}
                    px={6} // 👈 Equal left/right padding
                    py={3}
                    _hover={{ bg: "gray.50" }}
                  >
                    <HStack justify="space-between" align="center">
                      <Text
                        color="gray.700"
                        noOfLines={1}
                        fontWeight="medium"
                        flex="1"
                        pr={4} // small right padding before button
                      >
                        {getFileName(file.file_url)}
                      </Text>

                      <IconButton
                        aria-label="Download file"
                        icon={<DownloadIcon />}
                        as="a"
                        href={file.file_url}
                        target="_blank"
                        download
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                      />
                    </HStack>

                    {index < files.length - 1 && <Divider mt={3} />}
                  </Box>
                ))}
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
