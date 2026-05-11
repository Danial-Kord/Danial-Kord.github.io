import { Header3D } from "@/components/header3d/Header3D";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { EducationSection } from "@/components/sections/EducationSection";
import { AwardsSection } from "@/components/sections/AwardsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ChatSection } from "@/components/sections/ChatSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <Header3D />
      <AboutSection />
      <ProjectsSection />
      <ExperienceSection />
      <EducationSection />
      <AwardsSection />
      <SkillsSection />
      <ChatSection />
      <ContactSection />
    </>
  );
}
