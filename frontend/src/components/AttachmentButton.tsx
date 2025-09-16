"use client"

import { useRef } from "react"
import { IconButton } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"

export default function AttachmentButton() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      console.log("Selected file:", files[i].name)
      // You can now upload or process the file
    }
  }

  return (
    <>
      <IconButton
        icon={<AttachmentIcon />}
        aria-label="Attach file"
        colorScheme="teal"
        position="fixed"
        bottom="1.5rem"
        right="6rem"
        borderRadius="full"
        size="md"
        onClick={handleAttachmentClick}
      />

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".pdf"
        multiple
        onChange={handleFileChange}
      />
    </>
  )
}
