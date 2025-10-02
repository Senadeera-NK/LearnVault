"use client"

import { useRef } from "react"
import { IconButton } from "@chakra-ui/react"
import { AttachmentIcon } from "@chakra-ui/icons"
import { insertPdfFiles } from "../../services/api"
import { useAuth } from "./AuthContext"


export default function AttachmentButton() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
  }

 const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files || !user) return;

  insertPdfFiles(user.id, Array.from(files))
    .then(data => console.log("Files uploaded successfully", data))
    .catch(error => console.error("Error uploading files", error));
};


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
        zIndex={9999} // <-- add this
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
