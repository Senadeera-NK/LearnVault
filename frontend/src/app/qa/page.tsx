"use client";

import { useEffect, useState, useRef } from "react";
import { Box,Heading,Button,VStack,HStack,Text,IconButton,Portal,Flex,Spinner,} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { usePageTimer } from "../../components/UsePageTimer";
import {
  recordUsage,
  fetch_user_pdfs,
  send_qa_selection,
  uploadFile,
} from "../../../api/api";
import { useAuth } from "@/components/AuthContext";
import ShelfWindow from "./components/ShelfWindow";
import MCQskeleton from "./components/MCQskeleton";
import FactQAskeleton from "./components/FactQAskeleton";
import TrueFalseSkeleton from "./components/TrueFalseSkeleton";

export default function QA() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  type LocalFile = File & { source: "local" };
  type ShelfFile = { name: string; url: string; source: "shelf" };
  type UploadedFile = LocalFile | ShelfFile;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [shelfFiles, setShelfFiles] = useState<
    { id: string; name: string; url: string }[]
  >([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [categorySelectedIndex, setCategorySelectedIndex] = useState<
    number | null
  >(null);
  const [qaCategory, setQaCategory] = useState<string | null>(null);
  const [qaContent, setQaContent] = useState<any[]>([]);
  const [checkAnswersTrigger, setCheckAnswersTrigger] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleLocalClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const localFiles: UploadedFile[] = Array.from(files).map((file) =>
      Object.assign(file, { source: "local" as const })
    );
    setUploadedFiles((prev) => [...prev, ...localFiles]);
  };

  const handleDeleteFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  usePageTimer("Q & A", async (duration) => {
    if (!user) return;
    try {
      await recordUsage(user.id, "Q & A", duration);
    } catch (err) {
      console.error(err);
    }
  });

  const extractFileName = (url: string) => {
    if (!url) return "unknown.pdf";
    const cleanUrl = url.trim().replace(/\r?\n/g, "");
    const parts = cleanUrl.split("/");
    return parts[parts.length - 1].replace(/\?.*$/, "");
  };

  const handleCategorySelect = async (
    category: string,
    file: UploadedFile,
    index: number
  ) => {
    if (!user) return;
    setLoading(true);
    try {
      setCategorySelectedIndex(index);
      setSelectedFileIndex(null);
      let fileURL = "";

      if (file.source === "shelf") fileURL = file.url;
      else if (file.source === "local") {
        const uploadResponse = await uploadFile(user.id, file);
        if (!uploadResponse?.file_url) {
          console.error("failed to upload temp file");
          return;
        }
        fileURL = uploadResponse.file_url;
      }

      const result = await send_qa_selection(user.id, fileURL, category);
      const qa_json = result?.result?.qa_content;

      setQaCategory(category);
      setQaContent(qa_json);
    } catch (err) {
      console.error("Error sending QA selection:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserAnswer = () => setCheckAnswersTrigger((prev) => prev + 1);
  const refrehshUserAnswers = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    const fetchShelfFiles = async () => {
      if (!user) return;
      try {
        const res = await fetch_user_pdfs(user.id);
        const formatted =
          (res.details || []).map((file: any) => ({
            id: file.id,
            name: extractFileName(file.file_url),
            url: file.file_url,
          })) || [];
        setShelfFiles(formatted);
      } catch (err) {
        console.error("Error fetching shelf files:", err);
      }
    };
    fetchShelfFiles();
  }, [user]);

  return (
    <>
      <Box display="flex" flexDirection="column" pt="10px">
        <Heading mb="20px" textAlign="center">
          Q & A
        </Heading>
      </Box>

      {/* Main Layout */}
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="stretch"
        w="95%"
        mx="auto"
        gap={6}
      >
        {/* Left Panel */}
        <Box
          w={{ base: "100%", md: "40%", lg: "30%" }}
          h={{ base: "auto", md: "80vh" }}
          border="1px solid"
          borderColor="gray.300"
          borderRadius="lg"
          p={3}
        >
          <Box h={{ base: "auto", md: "65vh" }} p={3} overflowY="auto">
            {uploadedFiles.map((file, index) => {
              const isSelected = selectedFileIndex === index;
              return (
                <Box
                  key={index}
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
                  <Text fontSize="sm" color="gray.700" flex="1" isTruncated>
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

                  {isSelected && (
                    <Portal>
                      <Box
                        position="absolute"
                        left="50%"
                        top="60px"
                        transform="translateX(-50%)"
                        w="200px"
                        p={3}
                        bg="white"
                        border="1px solid"
                        borderColor="gray.300"
                        borderRadius="md"
                        shadow="md"
                        zIndex={2000}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          w="100%"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCategorySelect("mcq", file, index)
                          }
                        >
                          MCQ
                        </Button>
                        <Button
                          w="100%"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCategorySelect("true_false", file, index)
                          }
                        >
                          True / False
                        </Button>
                        <Button
                          w="100%"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleCategorySelect("fact", file, index)
                          }
                        >
                          Fact Q&A
                        </Button>
                      </Box>
                    </Portal>
                  )}
                </Box>
              );
            })}
          </Box>

          <VStack spacing={3} align="stretch" mt={4}>
            <Button
              colorScheme="gray"
              onClick={() => {
                setSelectedFileIndex(null);
                setIsShelfOpen(true);
              }}
            >
              Add from shelf
            </Button>
            <Button colorScheme="gray" onClick={handleLocalClick}>
              Upload from device
            </Button>
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

        {/* Right Panel */}
        <Flex
          direction="column"
          align="center"
          w={{ base: "100%", md: "60%", lg: "68%" }}
        >
          <Box
            w="100%"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="lg"
            p={3}
            h={{ base: "auto", md: "80vh" }}
            overflowY="auto"
          >
            {qaCategory === "mcq" && (
              <MCQskeleton
                data={qaContent}
                checkAnswerTrigger={checkAnswersTrigger}
                refreshTrigger={refreshTrigger}
              />
            )}
            {qaCategory === "true_false" && (
              <TrueFalseSkeleton
                data={qaContent}
                checkAnswerTrigger={checkAnswersTrigger}
                refreshTrigger={refreshTrigger}
              />
            )}
            {qaCategory === "fact" && (
              <FactQAskeleton
                data={qaContent}
                checkAnswerTrigger={checkAnswersTrigger}
                refreshTrigger={refreshTrigger}
              />
            )}

            {!qaCategory && (
              <Text color="gray.500" textAlign="center" mt={10}>
                Select a category to generate Q&A
              </Text>
            )}
          </Box>

          <HStack spacing={4} mt={4} flexWrap="wrap" justify="center">
            <Button onClick={checkUserAnswer}>Check Answers</Button>
            <Button onClick={checkUserAnswer}>Show Answers</Button>
            <Button onClick={refrehshUserAnswers}>Reset</Button>
          </HStack>
        </Flex>

        <ShelfWindow
          isOpen={isShelfOpen}
          onClose={() => setIsShelfOpen(false)}
          files={shelfFiles}
          onFileSelect={(file) => {
            setUploadedFiles((prev) => [
              ...prev,
              { name: file.name, url: file.url, source: "shelf" },
            ]);
            setIsShelfOpen(false);
          }}
        />
      </Flex>

      {loading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backdropFilter="blur(6px)"
          backgroundColor="rgba(0, 0, 0, 0.05)"
          zIndex={10000}
        >
          <Spinner size="xl" thickness="5px" speed="0.65s" color="blue.500" />
        </Box>
      )}
    </>
  );
}
