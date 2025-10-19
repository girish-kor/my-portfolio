export function SkillsSection() {
  const skills = [
    { name: 'Java', level: 90 },
    { name: 'SpringBoot', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'SQL', level: 75 },
    { name: 'Figma (UI/UX)', level: 78 },
    { name: 'React', level: 90 },
    { name: 'Next.js', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Tailwind', level: 85 },
    { name: 'Docker', level: 70 },
    { name: 'Git', level: 65 },
  ];

  return (
    <div className=" grid grid-cols-2 lg:grid-cols-1 gap-2">
      {skills.map((skill) => (
        <div key={skill.name}>
          <div className="relative w-full h-6 bg-black/10 dark:bg-white/10  overflow-hidden flex items-center rounded border-black/80 dark:border-white/80 border-1">
            <div
              className={`flex items-center h-full pl-2  transition-all duration-500 hover:opacity-50  opacity-80 text-sm
                          ${
                            skill.level > 50
                              ? 'bg-black text-white dark:bg-white dark:text-black'
                              : 'bg-black text-white dark:bg-black dark:text-white'
                          }`}
              style={{ width: `${skill.level}%` }}
            >
              {skill.name}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
