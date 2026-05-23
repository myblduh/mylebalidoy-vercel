import { Cpu, Terminal, Palette, type LucideIcon } from "lucide-react";
import skillsData from "@/data/skills.json";

const iconMap: Record<string, LucideIcon> = {
  Terminal,
  Cpu,
  Palette,
};

export default function Skills() {
  const skillCategories = skillsData.map((category) => {
    const Icon = iconMap[category.icon] || Cpu;
    return {
      ...category,
      icon: <Icon className="w-5 h-5" />,
    };
  });

  return (
    <section id="skills" className="py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand/10 dark:bg-brand/15 border border-brand/20 mb-4">
            <Cpu className="w-4 h-4 md:w-5 md:h-5 text-brand" />
            <span className="text-xs md:text-sm uppercase tracking-[0.2em] text-brand font-bold">
              Core Competencies
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
            Skills
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl">
            The technical toolkit and professional skills I've honed through
            experience and education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <div
              key={index}
              className="project-card p-10 flex flex-col items-start text-left"
            >
              <div className="bg-brand/5 dark:bg-brand/10 p-4 rounded-2xl mb-6 text-brand border border-brand/10">
                {category.icon}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 uppercase tracking-[0.1em]">
                {category.title}
              </h2>
              <div className="flex flex-wrap gap-2.5 justify-start">
                {category.skills.map((skill, skillIndex) => (
                  <div
                    key={skillIndex}
                    className="px-4 py-1.5 rounded-full text-[11px] font-bold bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-500 dark:text-gray-400 transition-all duration-300 md:hover:border-brand md:hover:text-brand md:hover:bg-brand/5"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
