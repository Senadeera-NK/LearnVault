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
  refreshTrigger:number;
}

export default function MCQskeleton({ data, checkAnswerTrigger,refreshTrigger }: MCQskeletonProps) {
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
    const letters = ["A", "B","C","D"]

    data.forEach((qa, index) => {
      const userAnswer = selectedAnswer[index];
    //   find the correct letter for the answer
    const selectedLetter = letters[qa.options.findIndex(opt=>opt===userAnswer)];

    newResults[index]=selectedLetter===qa.answer;
    });
    setResult(newResults);
  };

// useEffect for refreshing
useEffect(()=>{
    setSelectedAnswer({});
    setResult({});
},[refreshTrigger]);

  return (
    <VStack align="stretch" gap={3}>
      {data.map((qa, index) => {
        const userAnswer = selectedAnswer[index];
        const isCorrect = result[index];
        const letters = ["A", "B","C","D"]

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
            bg={
              result[index] !== undefined
                ? isCorrect
                  ? "green.200"
                  : "red.200"
                : "white"
            }
            borderRadius="md"
          >
            <Text fontWeight="semibold" pb={3}>
              {index + 1}. {qa.question}
            </Text>

            <VStack align="stretch" gap={2}>
              {qa.options?.map((opt, i) => {
                const letter = letters[i];
                const isSelected = userAnswer === opt;
                const isCorrectAnswer =
                 result[index] !== undefined && qa.answer === letter;

                // Determine appearance: use outline for unselected, solid for selected
                let variant: "solid" | "outline" = "outline";
                let colorScheme: string | undefined = undefined;

                if (result[index] !== undefined) {
                  // After checking answers: highlight correct in green, wrong selection in red
                  if (isCorrectAnswer) {
                    variant = "solid";
                    colorScheme = "green";
                  } else if (isSelected) {
                    variant = "solid";
                    colorScheme = "red";
                  } else {
                    variant = "outline";
                    colorScheme = undefined;
                  }
                } else {
                  // Before checking: selected = blue solid, unselected = outline
                  if (isSelected) {
                    variant = "solid";
                    colorScheme = "blue";
                  } else {
                    variant = "outline";
                    colorScheme = undefined;
                  }
                }

                return (
                  <Button
                    key={i}
                    width="100%"
                    justifyContent="flex-start"
                    variant={variant}
                    colorScheme={colorScheme}
                    onClick={() => handleClick(index, opt)}
                    aria-pressed={isSelected}
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
