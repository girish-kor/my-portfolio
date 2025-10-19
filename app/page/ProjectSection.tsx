import { useEffect, useState } from 'react';
import { FaExternalLinkSquareAlt, FaLink } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

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

  if (projects.length === 0) return <p>Loading projects...</p>;

  const selectedProject = projects[selectedProjectIndex];

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      {/* Header / selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Projects</h3>

        <div>
          <Select
            value={String(selectedProjectIndex)}
            onValueChange={(value) => setSelectedProjectIndex(Number(value))}
          >
            <SelectTrigger size="default">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>

            <SelectContent>
              {projects.map((project, index) => (
                <SelectItem key={index} value={String(index)} title={project.title}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Card */}
      <div className="flex flex-col justify-between flex-1 min-h-0">
        {/* details */}
        <div className="flex flex-col gap-2">
          <h4>Title: {selectedProject.title}</h4>
          <p className="text-justify mt-2 opacity-80">Description: {selectedProject.description}</p>
          <p>Last Updated: {selectedProject.date}</p>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-2  ">
          {selectedProject.tags.slice(0, 8).map((tag, idx) => (
            <span key={idx} className=" pl-1 pr-1 bg-black/30 dark:bg-white/30 text-sm rounded ">
              {tag}
            </span>
          ))}
          {selectedProject.tags.length > 8 && (
            <span className="px-2 py-1 rounded text-sm ">
              +{selectedProject.tags.length - 8} more
            </span>
          )}
        </div>

        {/* links */}
        <div className="flex justify-between mt-2  ">
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-0 no-underline"
                aria-label={`GitHub repository for ${selectedProject.title}`}
              >
                <p className="flex opacity-80 hover:opacity-100 items-center pl-2 rounded bg-black dark:bg-white text-white dark:text-black ">
                  REPO
                  <FaExternalLinkSquareAlt className="ml-1 w-6 h-6" aria-hidden="true" />
                </p>
              </a>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>{selectedProject.githubUrl}</TooltipContent>
          </Tooltip>
          <a
            href={selectedProject.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline flex items-center gap-2  opacity-80 hover:opacity-100 "
            aria-label={`Live demo for ${selectedProject.title}`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <span aria-hidden="true">
                  <FaLink className="w-5 h-5" />
                </span>
              </TooltipTrigger>
              <TooltipContent sideOffset={4}>{selectedProject.demoUrl}</TooltipContent>
            </Tooltip>
          </a>
        </div>
      </div>
    </div>
  );
}
