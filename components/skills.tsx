export default function Skills() {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["HTML", "CSS", "JavaScript", "SCSS", "Bootstrap"],
    },
    {
      title: "Backend/Database",
      skills: ["PHP", "Node.js", "MySQL", "SQL", "Kotlin", "AWS", "Apache"],
    },
    {
      title: "Miscellaneous",
      skills: ["Python", "Java", "Git", "Android Studio", "Workbench"],
    },
    {
      title: "Design",
      skills: ["Figma", "Canva", "Adobe Photoshop"],
    },
  ];

  return (
    <section id="skills" className="py-16 px-4 md:px-10 lg:px-40">
      <p className="text-center font-semibold">Explore My</p>
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Skills</h1>

      <div className="skills__container max-w-6xl mx-auto flex flex-wrap gap-6 justify-center">
        {skillCategories.map((category, index) => (
          <div
            key={index}
            className="skill_category flex-1 basis-64 bg-white rounded-xl p-6 shadow-md transition-transform duration-300 hover:-translate-y-1 min-w-0"
          >
            <div className="skill_title flex items-center gap-4 mb-4 pb-2 border-b-2 border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
            </div>
            <div className="skill_list flex flex-wrap gap-2">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="skill_item bg-gray-50 px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-100 transition-all duration-300 hover:bg-gray-100 hover:-translate-y-0.5"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
