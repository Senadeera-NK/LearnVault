"use client"

import { Box } from "@chakra-ui/react"
import {useAuth} from "./AuthContext"

export default function UserAvatar() {
    const {user} = useAuth();
    const userName = user?.name || "Guest";
    const userInitials = userName.charAt(0).toUpperCase();

    // Use a simple Box-based avatar and native title tooltip to avoid
    // runtime issues from Chakra composite exports in v3.
    return (
      <Box
        as="button"
        title={userName}
        position="fixed"
        top="1.5rem"
        right="1.5rem"
        borderRadius="full"
        zIndex={1000}
        width="32px"
        height="32px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.200"
        cursor="pointer"
      >
        <Box fontSize="14px" fontWeight="600" color="gray.700">
          {userInitials}
        </Box>
      </Box>
    );
}