import { About } from "@/components/sections/About";
import { Articles } from "@/components/sections/Articles";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { LiveDemos } from "@/components/sections/LiveDemos";
import { Projects } from "@/components/sections/Projects";
import { ResumeAnalyzer } from "@/components/sections/ResumeAnalyzer";
import { Skills } from "@/components/sections/Skills";
import {
  getArticles,
  getCertifications,
  getExperiences,
  getFeaturedProject,
  getProjects,
  getSiteConfig,
  getSkills
} from "@/lib/sanity/data";

export default async function Home() {
  const [siteConfig, skills, projects, featuredProject, articles, experiences, certifications] = await Promise.all([
    getSiteConfig(),
    getSkills(),
    getProjects(),
    getFeaturedProject(),
    getArticles(),
    getExperiences(),
    getCertifications()
  ]);

  return (
    <>
      <Hero config={siteConfig} />
      <About config={siteConfig} />
      <Skills skills={skills} />
      <Projects projects={projects} featuredProject={featuredProject} />
      <LiveDemos />
      <ResumeAnalyzer />
      <Articles articles={articles} />
      <Experience experiences={experiences} />
      <Certifications certifications={certifications} />
      <Contact config={siteConfig} />
    </>
  );
}
