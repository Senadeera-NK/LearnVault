"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  IconButton,
  Portal,
  Flex
} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { usePageTimer } from "../../components/UsePageTimer";
import {
  recordUsage,
  fetch_user_pdfs,
  send_qa_selection,
  uploadFile
} from "../../../api/api";
import { useAuth } from "@/components/AuthContext";
import ShelfWindow from "./components/ShelfWindow";
import MCQskeleton from "./components/MCQskeleton";
import FactQAskeleton from "./components/FactQAskeleton";
import TrueFalseSkeleton from "./components/TrueFalseSkeleton";

export default function QA() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Types
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
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [categorySelectedIndex, setCategorySelectedIndex] = useState<number|null>(null);
  const [qaCategory, setQaCategory] = useState<string | null>(null);
  const [qaContent, setQaContent] = useState<any[]>([]);
  const [checkAnswersTrigger, setCheckAnswersTrigger] = useState(0);

  // Upload from local
  const handleLocalClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const localFiles: UploadedFile[] = Array.from(files).map((file) =>
      Object.assign(file, { source: "local" as const })
    );
    setUploadedFiles((prev) => [...prev, ...localFiles]);
  };

  // Delete a file
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

  // Helper: extract filename from URL
  const extractFileName = (url: string) => {
    if (!url) return "unknown.pdf";
    const cleanUrl = url.trim().replace(/\r?\n/g, "");
    const parts = cleanUrl.split("/");
    return parts[parts.length - 1].replace(/\?.*$/, "");
  };

  // Send category selection (handles both local and shelf)
  const handleCategorySelect = async (category: string, file: UploadedFile, index:number) => {
    if (!user) return;

    try {
      // highlighting the category selected file box
      setCategorySelectedIndex(index);
      // Close popup after selecting category
      setSelectedFileIndex(null);

      let fileURL = "";
      if (file.source === "shelf") fileURL = file.url;
      else if (file.source === "local"){
        console.log("uploading temporary file to backend..");
        const uploadResponse = await uploadFile(user.id, file);
        console.log("temp upload response: ", uploadResponse);

        if(!uploadResponse?.file_url){
          console.error("failed to upload temp file");
          return;
        }
        fileURL = uploadResponse.file_url;
      }

      console.log("Sending QA request:", { userId: user.id, fileURL, category });
      const result = await send_qa_selection(user.id, fileURL, category);

      const qa_json = result?.result?.qa_content;
      console.log("QA generation result:", result?.result?.qa_content);

      setQaCategory(category);
      setQaContent(qa_json);
    } catch (err) {
      console.error("Error sending QA selection:", err);
    }
  };

  const checkUserAnswer = () =>{
    setCheckAnswersTrigger(prev=>prev+1)
  }
  // Fetch shelf files
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

      <Box display="flex" justifyContent="space-between" w="90%" mx="auto">
        {/* Left panel */}
        <Box
          w="30%"
          h="80vh"
          mx="auto"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="lg"
          p={3}
        >
          <Box h="65vh" p={3} overflowY="auto">
            {uploadedFiles.map((file, index) => {
              const isSelected = selectedFileIndex ===index;
              const isCategoryChosen = categorySelectedIndex === index;

              return(
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
                      left="35%"
                      top={`${100 + index * 60}px`}
                      transform="translate(-50%)"
                      w={["90%", "200px"]}
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
                        onClick={() => handleCategorySelect("mcq", file, index)}
                      >
                        MCQ
                      </Button>
                      <Button
                        w="100%"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCategorySelect("true_false", file, index)}
                      >
                        True / False
                      </Button>
                      <Button
                        w="100%"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCategorySelect("fact", file, index)}
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

          <VStack spacing={3} align="stretch">
            <Button
              colorScheme="gray"
              w="100%"
              onClick={() => {
                // ensure any inline popup is closed before modal
                setSelectedFileIndex(null);
                setIsShelfOpen(true);
              }}
            >
              Add from shelf
            </Button>
            <Button colorScheme="gray" w="100%" onClick={handleLocalClick}>
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

        <Flex direction="column" align="center" w="60%">
        {/* Right panel */}
        <Box
          w="100%"
          mx="auto"
          border="1px solid"
          borderColor="gray.300"
          borderRadius="lg"
          p={3}
          h="80vh"
          overflowY="auto"
          overflowX="hidden"
        >
          {qaCategory === "mcq" && (<MCQskeleton data={qaContent} checkAnswerTrigger={checkAnswersTrigger} />)}
          {qaCategory === "true_false" && (<TrueFalseSkeleton data={qaContent} checkAnswerTrigger={checkAnswersTrigger}/>)}
          {qaCategory === "fact" && <FactQAskeleton data={qaContent}/>}

          {!qaCategory && (
            <Text color="gray.500" textAlign="center" mt={10}>
              Select a category to generate Q&A
            </Text>
          )}
        </Box>

        <HStack spacing={4} mt={4}>
          <Button onClick={checkUserAnswer}>Check Answers</Button>
          <Button>Refresh</Button>
        </HStack>
        </Flex>

        {/* Shelf modal */}
        <ShelfWindow
          isOpen={isShelfOpen}
          onClose={() => setIsShelfOpen(false)}
          files={shelfFiles}
          onFileSelect={(file) => {
            // when user clicks Done, this will run
            setUploadedFiles((prev) => [
              ...prev,
              { name: file.name, url: file.url, source: "shelf" },
            ]);
            setIsShelfOpen(false);
          }}
        />
      </Box>
    </>
  );
}
