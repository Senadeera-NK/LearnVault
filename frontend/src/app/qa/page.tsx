"use client";

import { useEffect, useState, useRef } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  IconButton,
  Portal
} from "@chakra-ui/react";
import { Trash2 } from "lucide-react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage, fetch_user_pdfs } from "../../../api/api";
import { useAuth } from "@/components/AuthContext";
import ShelfWindow from "./components/ShelfWindow";
import { projectHmrEvents } from "next/dist/build/swc/generated-native";

export default function QA() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [shelfFiles, setShelfFiles] = useState<
    { id: string; name: string; url: string }[]
  >([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number | null>(
    null
  );
  const [isShelfOpen, setIsShelfOpen] = useState(false);

  // Upload from device
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

  // Helper function to extract file name from URL
  const extractFileName = (url: string) => {
    if (!url) return "unknown.pdf";
    const cleanUrl = url.trim().replace(/\r?\n/g, "");
    const parts = cleanUrl.split("/");
    return parts[parts.length - 1].replace(/\?.*$/, "");
  };

  // Fetch shelf files on load
  useEffect(() => {
    const fetchShelfFiles = async () => {
      if (!user) return;
      try {
        const res = await fetch_user_pdfs(user.id);
        const formattedPdfs =
          (res.details || []).map((file: any) => ({
            id: file.id,
            name: extractFileName(file.file_url),
            url: file.file_url,
          })) || [];
        setShelfFiles(formattedPdfs);
      } catch (err) {
        console.error("Error fetching shelf files:", err);
      }
    };

    fetchShelfFiles();
  }, [user]);

  // Close options modal when clicking outside
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

  // Merge local and shelf files for ShelfWindow
  const allFiles = [
    ...uploadedFiles.map((file, index) => ({
      id: `local-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
    })),
    ...shelfFiles.map((file) => ({
      id: `server-${file.id}`,
      name: file.name,
      url: file.url,
    })),
  ];

  return (
    <>
      <Box display="flex" flexDirection="column" justifyContent="flex-start" pt="10px">
        <Heading mb="20px" textAlign="center" w="100%">
          Q & A
        </Heading>
      </Box>

      <Box display="flex" justifyContent="space-between" w="90%" mx="auto">
        {/* Left panel: uploaded files */}
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
                  <Portal>
                  <Box
                    position="absolute"
                    left="35%"
                    top={`${100+index*60}px`}
                    transform="translate(-50%)"
                    w={["90%","200px"]} //responsive for mobile-desktop
                    p={3}
                    bg="white"
                    border="1px solid"
                    borderColor="gray.300"
                    borderRadius="md"
                    shadow="md"
                    zIndex={2000}
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
                  </Portal>
                )}
              </Box>
            ))}
          </Box>

          <VStack spacing={3} align="stretch">
            <Button colorScheme="gray" w="100%" onClick={() => setIsShelfOpen(true)}>
              Add from shelf
            </Button>
            <Button colorScheme="gray" w="100%" onClick={handleLocalClick}>
              Upload from the device
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

        {/* Right panel */}
        <Box w="60%" mx="auto" border="1px solid" borderColor="gray.300" borderRadius="lg" p={3}></Box>

        {/* Shelf window modal */}
        <ShelfWindow
          isOpen={isShelfOpen}
          onClose={() => setIsShelfOpen(false)}
          files={allFiles}
          onFileSelect={(file)=>{
            //add selected shelf file to uploaded files
            setUploadedFiles((prev)=>[
              ...prev,
              new File([], file.name, {type:"applicatoin/pdf"}),
            ]);
          }}
        />
      </Box>
    </>
  );
}
