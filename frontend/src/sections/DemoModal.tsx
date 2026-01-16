'use client'
import { Box, Portal, IconButton } from '@chakra-ui/react';

export const DemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed" inset="0" bg="blackAlpha.800" backdropFilter="blur(5px)"
        zIndex="9999" display="flex" alignItems="center" justifyContent="center"
        onClick={onClose}
      >
        <Box 
          position="relative" w="90%" maxW="900px" aspectRatio="16/9"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking video
        >
              {/* Close Button */}
            <IconButton
            aria-label="Close"
            position="absolute"
            top="-10"
            right="0"
            color="white"
            variant="ghost"
            fontSize="2xl"
            onClick={onClose}
            _hover={{ bg: "whiteAlpha.200" }}
            >
            <span>×</span> {/* Pass the icon/text as a child here */}
            </IconButton>

          <video 
            src="/videos/hero.mp4" 
            controls 
            autoPlay 
            style={{ width: '100%', borderRadius: '15px' }} 
          />
        </Box>
      </Box>
    </Portal>
  );
};