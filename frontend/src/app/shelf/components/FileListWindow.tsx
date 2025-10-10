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

  const downloadFile=async(url:string, filename:string)=>{
    const res = await fetch(url);
    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
  const handleDownloadAll =()=>{
    console.log("clicked handle download all");
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
                        onClick={()=>downloadFile(file.file_url, getFileName(file.file_url))}
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

          <ModalFooter justifyContent="space-between">
            <Button colorScheme="blue" onClick={handleDownloadAll}>
              Download All
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
