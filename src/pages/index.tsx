import React from "react";
import Layout from "@theme/Layout";
// import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import styles from "./index.module.css";

export default function Home(): JSX.Element {
  return (
    <Layout title="Frontend. Backend. DevOps. For full stack engineers.">
      <main>
        <div className={styles.hero}>
          <h1 className={styles.hero__title}>
            <span className={styles.hero__title__text}>Frontend.</span>
            <span className={styles.hero__title__text}>Backend.</span>
            <span className={styles.hero__title__text}>DevOps.</span>
          </h1>
          <div className={styles.hero__buttons}></div>
          <h2 className={styles.hero_description}></h2>
        </div>
      </main>
    </Layout>
  );
}
