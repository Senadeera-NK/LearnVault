import Image from "next/image";
import styles from "./page.module.css";
import {redirect} from "next/navigation";
import { useAuth } from "./../components/AuthContext";

export default function Home() {
  return (
    <div className={styles.page}>
      redirect("/dashboard");
    </div>
  );
}
