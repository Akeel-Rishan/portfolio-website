import { About } from "@/components/sections/About";
import { AIDemo } from "@/components/sections/AIDemo";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { LiveDemos } from "@/components/sections/LiveDemos";
import { Projects } from "@/components/sections/Projects";
import { ResumeAnalyzer } from "@/components/sections/ResumeAnalyzer";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <LiveDemos />
      <ResumeAnalyzer />
      <Experience />
      <Certifications />
      <Contact />
      <AIDemo />
    </>
  );
}
