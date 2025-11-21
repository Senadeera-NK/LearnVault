"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Heading, SimpleGrid, Text, Image } from "@chakra-ui/react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage } from "../../../api/api";
import { useAuth } from "@/components/AuthContext";
import { fetch_user_pdfs } from "../../../api/api";
import FileListWindow from "./components/FileListWindow";
import fileCategoryPic from "./../../../pics/file_category.jpg";
import { colors } from "../../theme"; // your colors object

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

  usePageTimer("Shelf", recordShelfUsage);

  // Fetch user PDFs
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const res = await fetch_user_pdfs(user.id);

        const formattedPdfs = (res.details || []).map((file: any) => ({
          id: file.id,
          name: extractFileName(file.file_url),
          url: file.file_url.trim(),
          category: file.category || "Uncategorized",
        }));

        setPdfs(formattedPdfs);
      } catch (err) {
        console.error("Error fetching PDFs: ", err);
      }
    };

    fetchData();
  }, [user]);

  // Helper function to extract file name
  const extractFileName = (url: string) => {
    if (!url) return "unknown.pdf";
    const cleanUrl = url.trim().replace(/\r?\n/g, "");
    const parts = cleanUrl.split("/");
    return parts[parts.length - 1].replace(/\?.*$/, "");
  };

  const uniqueCategories = Array.from(new Set(pdfs.map((file) => file.category)));

  const handleCategoryClick = (category: string) => {
    const filesCategory = pdfs.filter((file) => file.category === category);
    setSelectedCategory(category);
    setSelectedFiles(filesCategory);
    setIsOpen(true);
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      pt={{ base: "12px", md: "24px" }}
      px={{ base: 4, md: 8, lg: 12 }}
    >
      <Heading
        mb="24px"
        textAlign="center"
        w="100%"
        fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
        color={colors.brand[600]}
      >
        Shelf
      </Heading>

      <SimpleGrid
        columns={{ base: 2, sm: 3, md: 4, lg: 5, xl: 8 }}
        gap={{ base: 4, md: 6 }}
      >
        {uniqueCategories.map((category) => (
          <Box
            key={category}
            cursor="pointer"
            onClick={() => handleCategoryClick(category)}
            textAlign="center"
            w={{ base: "110px", sm: "130px", md: "150px" }}
            _hover={{ transform: "scale(1.05)" }}
            transition="all 0.2s ease"
          >
            <Box
              overflow="hidden"
              p={0}
              borderRadius="md"
              border={`2px solid ${colors.accent[300]}`}
              bg="white"
              boxShadow="md"
            >
              <Image
                src={fileCategoryPic.src}
                alt="Category"
                w="100%"
                h={{ base: "70px", sm: "90px", md: "110px" }}
                objectFit="cover"
              />
            </Box>
            <Text
              mt="8px"
              fontWeight="semibold"
              fontSize={{ base: "sm", md: "md" }}
              color={colors.brand[700]}
            >
              {category}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <FileListWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        category={selectedCategory}
        files={selectedFiles}
      />
    </Box>
  );
}
