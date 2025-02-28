import Image from "next/image";
import styles from "./page.module.css";
import LoginAdmin from "../app/LoginAdmin/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <LoginAdmin />
    </div>
  );
}
