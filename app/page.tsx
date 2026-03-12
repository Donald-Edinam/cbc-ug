import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import MarqueeBand from "@/components/marquee-band";
import About from "@/components/about";
import HackathonBanner from "@/components/hackathon-banner";
import Events from "@/components/events";
import Team from "@/components/team";
import Projects from "@/components/projects";
import JoinSection from "@/components/join-section";
import Footer from "@/components/footer";
import ScrollAnimations from "@/components/scroll-animations";
import styles from "@/styles/page.module.css";

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <Navbar />
      <Hero />
      <MarqueeBand />
      <hr className={styles.divider} />
      <About />
      <hr className={styles.divider} />
      <HackathonBanner />
      <hr className={styles.divider} />
      <Events />
      <MarqueeBand />
      <hr className={styles.divider} />
      <Team />
      <hr className={styles.divider} />
      <Projects />
      <JoinSection />
      <Footer />
    </>
  );
}
