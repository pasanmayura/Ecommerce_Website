import styles from "./page.module.css";
import HomePage from "../app/HomePage/page";

export default function Home() {
  return (
    <div className={styles.page}>
      <HomePage />
    </div>
  );
}
