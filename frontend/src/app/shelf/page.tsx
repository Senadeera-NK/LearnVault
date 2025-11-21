"use client";
import { useEffect, useState, useCallback } from "react";
import { Box, Heading, SimpleGrid, Text,Image } from "@chakra-ui/react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage } from "../../../api/api";
import { useAuth } from "@/components/AuthContext";
import { fetch_user_pdfs } from "../../../api/api";
import FileListWindow from "./components/FileListWindow";
import  fileCategoryPic from "./../../../pics/file_category.jpg"

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
      pt={{base:"10px",md:"20px"}}
      px={{base:3,sm:5,md:8}}
      // paddingLeft={5}
      // paddingRight={5}
    >
      <Heading mb="20px" textAlign="center" w="100%"
       fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
      >
        Shelf
      </Heading>

      {/* Grid of categories */}
      <SimpleGrid
        paddingTop={30}
        columns={{ base: 2, sm: 3, md: 4, lg: 5, xl:8}}
        gap={{ base: "6px", md: "10px" }}
        mt="4px"
      >
        {uniqueCategories.map((category) => (
          <Box
            key={category}
            cursor="pointer"
            onClick={() => handleCategoryClick(category)}
            textAlign="center"
            w={{ base: "110px", sm: "130px", md: "150px" }}
          >
            {/* Image */}
            <Box
              overflow="hidden"
              p="0"
              _hover={{ transform: "scale(1.03)" }}
              transition="all 0.2s ease"
            >
              <Image
                src={fileCategoryPic.src}
                alt="Category"
                w="100%"
                h={{base:"70px",sm:"90px",md:"110px"}}
                objectFit="cover"
                borderRadius="md"
              />
            </Box>

            {/* Category Name Under Image */}
            <Text
              mt="8px"
              fontWeight="semibold"
              fontSize={{ base: "sm", md: "md" }}
              color="gray.700"
            //  noOfLines={2}
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