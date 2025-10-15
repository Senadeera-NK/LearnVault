"use client";
import { useEffect, useState, useCallback } from "react";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage } from "../../../api/api";
import { useAuth } from "@/components/AuthContext";
import { fetch_user_pdfs } from "../../../api/api";
import FileListWindow from "./components/FileListWindow";

export default function Shelf() {
  const { user } = useAuth();
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  // Memoized page usage recorder
  const recordShelfUsage = useCallback(
    async (duration: number) => {
      if (!user) return;
      try {
        await recordUsage(user.id, "Shelf", duration);
        console.log("✅ Recorded usage:", duration, "seconds");
      } catch (err) {
        console.error("❌ Failed to record usage", err);
      }
    },
    [user]
  );

  // Track page usage
  usePageTimer("Shelf", recordShelfUsage);

  // Fetch user PDFs and map to correct shape
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const res = await fetch_user_pdfs(user.id);
        console.log("PDFS fetched: ", res.details);

        const formattedPdfs = (res.details || []).map((file: any) => ({
          id: file.id,
          name: extractFileName(file.file_url), // extract file name from URL
          url: file.file_url.trim(), // remove extra whitespace/newlines
          category: file.category || "Uncategorized",
        }));

        setPdfs(formattedPdfs);
      } catch (err) {
        console.error("Error fetching PDFs: ", err);
      }
    };

    fetchData();
  }, [user]);

  // Helper function to get file name from URL
const extractFileName = (url: string) => {
  if (!url) return "unknown.pdf";
  // Remove leading/trailing whitespace and newlines
  const cleanUrl = url.trim().replace(/\r?\n/g, "");
  const parts = cleanUrl.split("/");
  // Take the last part and remove query string if exists
  return parts[parts.length - 1].replace(/\?.*$/, "");
};

  // Get unique categories
  const uniqueCategories = Array.from(
    new Set(pdfs.map((file) => file.category))
  );

  // When a category is clicked
  const handleCategoryClick = (category: string) => {
    const filesCategory = pdfs.filter((file) => file.category === category);
    setSelectedCategory(category);
    setSelectedFiles(filesCategory);
    setIsOpen(true);
  };

  return (
    <Box
      className="styles.page"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      pt="10px"
      paddingLeft={5}
      paddingRight={5}
    >
      <Heading mb="20px" textAlign="center" w="100%">
        Shelf
      </Heading>

      {/* Grid of categories */}
      <SimpleGrid
        paddingTop={30}
        columns={{ base: 2, sm: 3, md: 4, lg: 5 }}
        spacing="30px"
      >
        {uniqueCategories.map((category) => (
          <Box
            key={category}
            border="2px solid"
            borderColor="gray.300"
            borderRadius="md"
            p="20px"
            h="90px"
            w="200px"
            display="flex"
            alignItems="left"
            justifyContent="center"
            cursor="pointer"
            _hover={{ bg: "gray.100", transform: "scale(1.03)" }}
            transition="all 0.2s ease"
            onClick={() => handleCategoryClick(category)}
          >
            <Text
              fontWeight="semibold"
              textAlign="center"
              color="gray.700"
              noOfLines={2}
            >
              {category}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* File list modal */}
      <FileListWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={selectedCategory}
        files={selectedFiles}
      />
    </Box>
  );
}