"use client";

import { useEffect, useState } from "react";
import { Box, Heading, Button, VStack, Spinner, Flex, IconButton} from "@chakra-ui/react";
import { FaPlus } from 'react-icons/fa';
import ShelfWindow from "./components/ShelfWindow";
import MCQskeleton from "./components/MCQskeleton";
import TrueFalseSkeleton from "./components/TrueFalseSkeleton";
import FactQAskeleton from "./components/FactQAskeleton";
import { fetch_user_pdfs, send_qa_selection } from "../../../api/api";
import { useAuth } from "@/components/AuthContext";


export default function QA() {
  const { user } = useAuth();
  const [shelfFiles, setShelfFiles] = useState<{ id: string; name: string; url: string }[]>([]);
  const [isShelfOpen, setIsShelfOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qaCategory, setQaCategory] = useState<string | null>(null);
  const [qaContent, setQaContent] = useState<any[]>([]);
  const [checkAnswersTrigger, setCheckAnswersTrigger] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchShelfFiles = async () => {
      if (!user) return;
      try {
        const res = await fetch_user_pdfs(user.id);
        setShelfFiles((res.details || []).map((f: any) => ({
          id: f.id,
          name: f.file_url.split("/").pop() || "unknown.pdf",
          url: f.file_url
        })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchShelfFiles();
  }, [user]);

  const categoryMap: Record<string, "mcq"|"true_false"|"fact">={
    "MCQ":"mcq",
    "True/False":"true_false",
    "Facts Questions":"fact"
  };

const handleDoneFromShelf = async (file: { id: string; name: string; url: string }, category: string, qCount: number) => {
  if (!user) return;
  setIsShelfOpen(false);
  setLoading(true);

  try {
    const backendCategory = categoryMap[category];
    const result = await send_qa_selection(user.id, file.url, backendCategory, qCount);
    setQaCategory(backendCategory);

    // Normalize response
    let qaData: any[]=[];
    if(backendCategory=="fact"){
      qaData = result?.results|| result?.cachedQA||[];
    }else{
    qaData = result?.qa_content || result?.cachedQA || [];
    }
    setQaContent(qaData);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
    setCheckAnswersTrigger((prev) => prev + 1);
  }
};


  const handleCheckAnswers = () => setCheckAnswersTrigger((prev) => prev + 1);
  const handleResetAnswers = () => setRefreshTrigger((prev) => prev + 1);

  return (
    <>
      <Box p={6} bg="white"position="sticky" top={0} zIndex="999" w="100%">
      <Heading top="0" textAlign="center" mb={0}>Q & A</Heading>
      </Box>
      <VStack gap={4}>


        {loading && (<Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bg="rgba(255,255,255,0.6)"
        zIndex={10}
        display="flex"
        justifyContent="center"
        alignItems="center"
        backdropFilter="blur(4px)"
        ><Spinner size="xl" /></Box>)}

        {qaContent.length===0 && !loading &&(
        <VStack gap={12} minH="60vh" justify="center" align="center">
            <Heading color="gray.600" textAlign="center">
              Select file to generate questions
            </Heading>

            <IconButton
              aria-label="Add item"
              onClick={() => setIsShelfOpen(true)}
              colorScheme="gray"
              size="2xs"
              borderRadius="full"
              boxSize="60px"
            >
              <FaPlus size={8} />
              </IconButton>
          </VStack>
        )}

        {!loading && qaCategory === "mcq" && (
          <MCQskeleton data={qaContent} checkAnswerTrigger={checkAnswersTrigger} refreshTrigger={refreshTrigger} />
        )}
        {!loading && qaCategory === "true_false" && (
          <TrueFalseSkeleton data={qaContent} checkAnswerTrigger={checkAnswersTrigger} refreshTrigger={refreshTrigger} />
        )}
        {!loading && qaCategory === "fact" && (
          <FactQAskeleton data={qaContent} checkAnswerTrigger={checkAnswersTrigger} refreshTrigger={refreshTrigger} />
        )}

        {!loading && qaContent.length > 0 && (
        <Flex gap={{ base: 8, md: 12, lg: 16 }}>
          <Button
            onClick={handleCheckAnswers}
            w={{ base: "140px", md: "160px", lg: "180px" }}
          >
            Check Answers
          </Button>

          <Button
            onClick={handleResetAnswers}
            w={{ base: "140px", md: "160px", lg: "180px" }}
          >
            Reset
          </Button>
        </Flex>
        )}
      </VStack>

      <ShelfWindow
        isOpen={isShelfOpen}
        onClose={() => setIsShelfOpen(false)}
        files={shelfFiles}
        onDone={handleDoneFromShelf}
      />
    </>
  );
}
