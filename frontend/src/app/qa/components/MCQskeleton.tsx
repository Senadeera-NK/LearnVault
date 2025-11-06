"use client";

import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";

interface MCQItem {
  question: string;
  options: string[];
  answer: string;
}

interface MCQskeletonProps {
  data: MCQItem[];
  checkAnswerTrigger: number; // used to trigger answer checking externally
}

export default function MCQskeleton({ data, checkAnswerTrigger }: MCQskeletonProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<Record<number, string>>({});
  const [result, setResult] = useState<Record<number, boolean>>({});

  const handleClick = (questionIndex: number, value: string) => {
    setSelectedAnswer((prev) => ({ ...prev, [questionIndex]: value }));
  };

  // Whenever the trigger changes (for example, a "Check Answers" button on the main page is pressed)
  useEffect(() => {
    if (checkAnswerTrigger > 0) {
      checkAnswers();
    }
  }, [checkAnswerTrigger]);

  const checkAnswers = () => {
    const newResults: Record<number, boolean> = {};
    data.forEach((qa, index) => {
      const userAnswer = selectedAnswer[index];
      newResults[index] = userAnswer?.trim().toLowerCase() === qa.answer.trim().toLowerCase();
    });
    setResult(newResults);
  };

  return (
    <VStack align="stretch" spacing={3}>
      {data.map((qa, index) => {
        const userAnswer = selectedAnswer[index];
        const isCorrect = result[index];

        return (
          <Box
            key={index}
            p={3}
            border="1px solid"
            borderColor={
              result[index] !== undefined
                ? isCorrect
                  ? "green.400"
                  : "red.400"
                : "gray.200"
            }
            borderRadius="md"
          >
            <Text fontWeight="semibold" pb={3}>
              {index + 1}. {qa.question}
            </Text>

            <VStack align="stretch" spacing={2}>
              {qa.options?.map((opt, i) => {
                const isSelected = userAnswer === opt;
                const isCorrectAnswer = result[index] !== undefined && qa.answer === opt;

                return (
                  <Button
                    key={i}
                    width="100%"
                    justifyContent="flex-start"
                    variant="solid"
                    colorScheme={
                      result[index] !== undefined
                        ? isCorrectAnswer
                          ? "green"
                          : isSelected
                          ? "red"
                          : "gray"
                        : isSelected
                        ? "blue"
                        : "gray"
                    }
                    onClick={() => handleClick(index, opt)}
                  >
                    {i + 1}. {opt}
                  </Button>
                );
              })}
            </VStack>
          </Box>
        );
      })}
    </VStack>
  );
}
