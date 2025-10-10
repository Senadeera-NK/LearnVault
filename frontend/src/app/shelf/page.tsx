"use client";
import { useEffect, useState, useCallback } from "react";
import { Box, Heading, Progress, SimpleGrid, Text } from "@chakra-ui/react";
import { usePageTimer } from "../../components/UsePageTimer";
import { recordUsage } from "../../../services/api";
import { useAuth } from "@/components/AuthContext";
import { fetch_user_pdfs } from "../../../services/api";
import FileListWindow from "./components/FileListWindow";


export default function Shelf() {
  const { user } = useAuth();
  // const [progress, setProgress] = useState(0);
  const[pdfs, setPdfs] = useState<any[]>([]);
  const[isOpen, setIsOpen] = useState(false);
  const[selectedCategory, setSelectedCategory] = useState("");
  const[selectedFiles, setSelectedFiles] = useState<any[]>([]);

  // Memoize the callback so usePageTimer doesn't re-subscribe on every render
  const recordShelfUsage = useCallback(
    async (duration:number) => {
      if (!user) return;
      console.log("Shelf page timer callback, duration:", duration);
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

  // fetch user PDFs
  useEffect(() => {
    const fetchData = async() =>{
      if(!user) return;
      try{
        const res = await fetch_user_pdfs(user.id);
        console.log("PDFS fetched: ", res.details)
        setPdfs(res.details || []);
      }catch(err){
        console.error("Error fetching PDFs: ", err);
      }
    };
    fetchData();
  }, [user]);


const uniqueCategories = Array.from(
  new Set(pdfs.map(file=> file.category || "uncategorized"))
);

const handleCategoryClick = (category:string) =>{
  const filesCategory = pdfs.filter((file)=>(file.category || "uncategorized")=== category);
  setSelectedCategory(category);
  setSelectedFiles(filesCategory);
  setIsOpen(true);
}
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

{/* grid categories */}
    <SimpleGrid       paddingTop={30} columns={{base:2, sm:3, md:4, lg:5}} spacing="30px">
     {uniqueCategories.map((category)=>(
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
            onClick={() =>handleCategoryClick(category)}
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

     <FileListWindow
     isOpen={isOpen}
     onClose={()=> setIsOpen(false)}
     category={selectedCategory}
     files={selectedFiles}
     >
     </FileListWindow>
     
     
      {/* <Box
        position="absolute"
        top="600px"
        left="50%"
        transform="translateX(-50%)"
      >
        <Heading mb="15px" alignItems="center">
          Loading.....
        </Heading>
        <Progress alignItems="center" value={progress} max={100} w="800px" size="lg" />
      </Box> */}
    </Box>
  );
}
