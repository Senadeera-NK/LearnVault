"use client";

import { useRef, useState } from "react";
import { IconButton, Spinner, Box, Icon } from "@chakra-ui/react";
import { FiPaperclip } from "react-icons/fi";
import { insertPdfFiles } from "../../api/api";
import { useAuth } from "./AuthContext";
import { fetch_user_pdfs, classifyUserFiles } from "../../api/api";

export default function AttachmentButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setLoading(true);
    try {
      await insertPdfFiles(user.id, Array.from(files));
      console.log("✅ Files uploaded successfully");
      console.log("Triggering classification for user: ", user.id);
      // const classificationResult = await classifyUserFiles(user.id);
      // console.log("Files classified successfully", classificationResult);
    } catch (error) {
      console.error("❌ Error uploading files or classifying files", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box zIndex={9999}>
      {/* Upload Button */}
     <IconButton
        aria-label="Attach file"
        colorScheme="teal"
        // position="fixed"
        // bottom="1.5rem"
        // right="6rem"
        borderRadius="full"
        size="md"
        zIndex={9999}
        onClick={handleAttachmentClick}
      >
        <Icon as={FiPaperclip} boxSize={5} />
      </IconButton>


      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf"
        multiple
        onChange={handleFileChange}
      />

      {/* Fullscreen Spinner Overlay */}
      {loading && (
        <Box
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backdropFilter="blur(6px)"
          backgroundColor="rgba(0, 0, 0, 0.05)"
          zIndex={10000}
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}
    </Box>
  );
}
