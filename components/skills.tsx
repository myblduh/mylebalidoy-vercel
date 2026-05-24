import Image from "next/image";
import skillsData from "@/data/skills.json";

const iconMap: Record<string, string> = {
  Terminal: "/assets/icons/frontend_icon.png",
  Cpu: "/assets/icons/backend_icon.png",
  Palette: "/assets/icons/design_icon.png",
};

export default function Skills() {
  const skillCategories = skillsData.map((category) => {
    const iconSrc = iconMap[category.icon] || iconMap.Cpu;
    return {
      ...category,
      iconSrc,
    };
  });

  return (
    <section id="skills" className="py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 max-w-3xl">
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
              className="project-card p-5 sm:p-6 flex flex-row sm:flex-col items-start gap-5 sm:gap-0 text-left"
            >
              <div className="flex-shrink-0 w-12 sm:w-16 flex items-center justify-center pt-1 sm:pt-0 sm:mb-6">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16">
                  <Image
                    src={category.iconSrc}
                    alt={`${category.title} Icon`}
                    fill
                    sizes="(max-width: 640px) 48px, 64px"
                    className="object-contain"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-3 sm:mb-4 uppercase tracking-[0.1em] leading-tight">
                  {category.title}
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-2.5 justify-start">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[9px] sm:text-[11px] uppercase tracking-widest font-bold bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-500 dark:text-gray-400 transition-all duration-300 md:hover:border-brand md:hover:text-brand md:hover:bg-brand/5"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
