"use client"

import { Box, Avatar,Tooltip } from "@chakra-ui/react"
import { HamburgerIcon, AddIcon, AttachmentIcon, EditIcon} from "@chakra-ui/icons"
export default function UserAvatar() {
    const userName = "Segun Adebayo";
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
             src="https://bit.ly/sage-adebayo" 
             size="sm"
             cursor="pointer"
             />
     </Box>
     </Tooltip>
     )
}