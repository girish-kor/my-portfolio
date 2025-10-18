import { useEffect, useState } from 'react';

interface Project {
  title: string;
  description: string;
  date: string;
  technologies: string[];
  tags: string[];
  githubUrl: string;
  demoUrl: string;
}

export function ProjectSection() {
  const username: string = 'girish-kor';

  // List of repos to exclude
  const excludedRepos = ['girish-kor', 'portfolio-dev', 'web-shop'];

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  // Fetch GitHub projects
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();
        const formattedProjects = data
          .filter((repo: any) => !excludedRepos.includes(repo.name)) // Exclude listed repos
          .map((repo: any) => ({
            title: repo.name,
            description: repo.description || 'No description provided',
            date: new Date(repo.updated_at).toLocaleDateString(),
            technologies: [],
            tags: repo.topics || [],
            githubUrl: repo.html_url,
            demoUrl: repo.homepage || '#',
          }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, []);

  // Automatically rotate projects every 10 seconds
  useEffect(() => {
    if (projects.length === 0) return;

    const interval = setInterval(() => {
      setSelectedProjectIndex((prevIndex) => (prevIndex + 1) % projects.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [projects]);

  if (projects.length === 0)
    return <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>;

  const selectedProject = projects[selectedProjectIndex];

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      {/* Header / selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>

        <div>
          <label htmlFor="project-select" className="sr-only">
            Select project
          </label>
          <select
            id="project-select"
            value={selectedProjectIndex}
            onChange={(e) => setSelectedProjectIndex(Number(e.target.value))}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm border border-gray-200 dark:border-gray-700"
          >
            {projects.map((project, index) => (
              <option key={index} value={index}>
                {project.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-col justify-between flex-1 min-h-0">
        {/* details */}
        <div className="flex flex-col gap-2">
          <h4>
            <strong>Title:</strong> {selectedProject.title}
          </h4>
          <p className="text-justify mt-2">
            <strong>Description:</strong> {selectedProject.description}
          </p>
          <p>
            <strong>Last Updated:</strong> {selectedProject.date}
          </p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2">
          {selectedProject.tags.slice(0, 8).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">
              {tag}
            </span>
          ))}
          {selectedProject.tags.length > 8 && (
            <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">
              +{selectedProject.tags.length - 8} more
            </span>
          )}
        </div>

        {/* links */}
        <div className="flex justify-between mt-2">
          <a
            href={selectedProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub
          </a>
          <a
            href={selectedProject.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
}
