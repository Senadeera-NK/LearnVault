"use client";

import { Box, Button, VStack, Text, HStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface TrueFalseItem {
  question: string;
  answer: string;
}

interface TrueFalseSkeletonProps {
  data?: TrueFalseItem[];          // optional to avoid undefined errors
  checkAnswerTrigger: number;
  refreshTrigger: number;
}

export default function TrueFalseSkeleton({
  data,
  checkAnswerTrigger,
  refreshTrigger,
}: TrueFalseSkeletonProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, string>>({});
  const [result, setResult] = useState<Record<number, "correct" | "wrong" | "skipped">>({});

  // Select handler
  const handleSelect = (index: number, value: string) => {
    setSelectedAnswer((prev) => ({ ...prev, [index]: value }));
  };

  // Check answers when trigger updates
  useEffect(() => {
    if (checkAnswerTrigger === 0 || !Array.isArray(data)) return;

    const newResults: Record<number, "correct" | "wrong" | "skipped"> = {};

    data.forEach((qa, index) => {
      const userAnswer = selectedAnswer[index];

      if (!userAnswer) {
        newResults[index] = "skipped";
      } else if (userAnswer.toLowerCase() === qa.answer.toLowerCase()) {
        newResults[index] = "correct";
      } else {
        newResults[index] = "wrong";
      }
    });

    setResult(newResults);
  }, [checkAnswerTrigger, data]);

  // Reset when refresh trigger changes
  useEffect(() => {
    setSelectedAnswer({});
    setResult({});
  }, [refreshTrigger]);

  // Defensive check for invalid or empty data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box textAlign="center" py={10} color="gray.500">
        No Q&A data available. Try generating again.
      </Box>
    );
  }

  // Main render
  return (
    <VStack align="stretch" spacing={3}>
      {data.map((qa, index) => {
        const status = result[index];
        return (
          <Box
            key={index}
            p={3}
            border="1px solid"
            borderColor={
              status === "correct"
                ? "green.400"
                : status === "wrong"
                ? "red.400"
                : "gray.200"
            }
            bg={
              status === "correct"
                ? "green.50"
                : status === "wrong"
                ? "red.50"
                : "white"
            }
            borderRadius="md"
            shadow="sm"
          >
            <Text fontWeight="semibold" pb={2}>
              {index + 1}. {qa.question}
            </Text>

            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme={selectedAnswer[index] === "true" ? "blue" : "gray"}
                onClick={() => handleSelect(index, "true")}
              >
                True
              </Button>
              <Button
                size="sm"
                colorScheme={selectedAnswer[index] === "false" ? "blue" : "gray"}
                onClick={() => handleSelect(index, "false")}
              >
                False
              </Button>
            </HStack>
          </Box>
        );
      })}
    </VStack>
  );
}