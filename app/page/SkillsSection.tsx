export function SkillsSection() {
  const skills = [
    { name: 'Java', level: 90 },
    { name: 'SpringBoot', level: 85 },
    { name: 'MongoDB', level: 80 },
    { name: 'SQL', level: 75 },
    { name: 'React', level: 90 },
    { name: 'Next.js', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Tailwind', level: 85 },
    { name: 'Docker', level: 70 },
    { name: 'Git', level: 65 },
  ];

  return (
    <div className="font-sans grid grid-cols-2 gap-2">
      {skills.map((skill) => (
        <div key={skill.name}>
          <div className="relative w-full h-6 bg-gray-200 dark:bg-black rounded overflow-hidden flex items-center text-xs font-semibold border-black dark:border-white border-1">
            <div
              className={`flex items-center h-full pl-2 rounded transition-all duration-500 hover:opacity-70
                          ${
                            skill.level > 50
                              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-black'
                              : 'bg-blue-500 text-white dark:bg-blue-400 dark:text-black'
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
