import styles from "../home.module.css";

export default function HomeBackdrop() {
  return (
    <>
      <div className={styles.heroOrb1} />
      <div className={styles.heroOrb2} />
      <div className={styles.heroOrb3} />
      <div className={styles.heroNoise} />
    </>
  );
}
