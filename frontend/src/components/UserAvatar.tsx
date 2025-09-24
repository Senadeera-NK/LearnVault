"use client"

import { Box, Avatar,Tooltip } from "@chakra-ui/react"
import { HamburgerIcon, AddIcon, AttachmentIcon, EditIcon} from "@chakra-ui/icons"
import {useAuth} from "./AuthContext"

export default function UserAvatar() {
    const {user} = useAuth();
    const userName = user?.name || "Guest";
    const userInitials = userName.charAt(0).toUpperCase();

      return(
     <Tooltip label={userName} placement="bottom" hasArrow>
      <Box
        position="fixed"
        top="1.5rem"
        right="1.5rem"
        borderRadius="full"
      >
            <Avatar
             name={userName}
             src="" // no image? will fallback to intials
             size="sm"
             cursor="pointer"
             >
              {userInitials}
              </Avatar>
     </Box>
     </Tooltip>
     )
}