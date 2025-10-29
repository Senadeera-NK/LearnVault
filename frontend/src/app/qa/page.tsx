"use client";

import { useEffect, useState, useRef } from "react";
import { Box, Heading, Button, VStack, Text, IconButton } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage } from "../../../api/api";
import { useAuth } from "@/components/AuthContext";

export default function QA() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(null);

  const handleLocalClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;
    setUploadedFiles(Array.from(files));
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Track page usage
  usePageTimer("Q & A", async (duration) => {
    if (!user) return;
    try {
      await recordUsage(user.id, "Q & A", duration);
    } catch (err) {
      console.error(err);
    }
  });

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".file-item")) {
        setSelectedFileIndex(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <Box className="styles.page" display="flex" flexDirection="column" justifyContent="flex-start" pt="10px">
        <Heading mb="20px" textAlign="center" w="100%">Q & A</Heading>
      </Box>

      <Box display="flex" justifyContent="space-between" w="90%" mx="auto" mt={0} mb={0}>
        {/* Left panel */}
        <Box w="30%" h="80vh" mx="auto" border="1px solid" borderColor="gray.300" borderRadius="lg" p={3}>
          <Box h="65vh" p={3} overflowY="auto">
            {uploadedFiles.map((file, index) => (
              <Box
                key={index}
                className="file-item"
                position="relative"
                p={2}
                mb={2}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                bg="gray.50"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => setSelectedFileIndex(index)}
              >
                <Text
                  fontSize="sm"
                  color="gray.700"
                  flex="1"
                  isTruncated
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {file.name}
                </Text>

                <IconButton
                  aria-label="delete file"
                  icon={<Trash2 size={16} />}
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(index);
                  }}
                />

                {/* Options modal */}
                {selectedFileIndex === index && (
                  <Box
                    position="absolute"
                    left="280px" // left of the file box
                    top="0"
                    w="140px"
                    p={2}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    shadow="md"
                    zIndex={10}
                  >
                    <Button
                      w="100%"
                      size="sm"
                      variant="ghost"
                      onClick={() => console.log("MCQ selected:", file.name)}
                    >
                      MCQ
                    </Button>
                    <Button
                      w="100%"
                      size="sm"
                      variant="ghost"
                      onClick={() => console.log("True/False selected:", file.name)}
                    >
                      True/False
                    </Button>
                    <Button
                      w="100%"
                      size="sm"
                      variant="ghost"
                      onClick={() => console.log("Fact Q&A selected:", file.name)}
                    >
                      Fact Q&A
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          <VStack spacing={3} align="stretch">
            <Button colorScheme="gray" w="100%">Add from shelf</Button>
            <Button colorScheme="gray" w="100%" onClick={handleLocalClick}>Upload from the device</Button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf"
              multiple
              onChange={handleFileChange}
            />
          </VStack>
        </Box>

        {/* Right panel */}
        <Box w="60%" mx="auto" border="1px solid" borderColor="gray.300" borderRadius="lg" p={3}>
        </Box>
      </Box>
    </>
  );
}
