import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import About from "@/components/about";
import Events from "@/components/events";
import Team from "@/components/team";
import Projects from "@/components/projects";
import JoinSection from "@/components/join-section";
import Footer from "@/components/footer";
import styles from "@/styles/page.module.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <hr className={styles.divider} />
      <About />
      <hr className={styles.divider} />
      <Events />
      <hr className={styles.divider} />
      <Team />
      <hr className={styles.divider} />
      <Projects />
      <JoinSection />
      <Footer />
    </>
  );
}
