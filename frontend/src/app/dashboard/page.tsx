"use client";

import Image from "next/image";
import styles from "../page.module.css";
import {useAuth} from "./../../components/AuthContext"
import { Heading } from "@chakra-ui/react"


export default function Dashboard() {
      const {user} = useAuth();
      const userName = user?.name || "Guest";
  return (
    <div className={styles.page}>
      <Heading position="absolute" top={5}>Welcome, Back! {userName}</Heading>
    </div>
  );
}
