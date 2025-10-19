import { useEffect, useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';

export function CountSection() {
  const username = 'girish-kor';
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRepoCount() {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) throw new Error('Failed to fetch GitHub user data');
        const data = await res.json();
        setRepoCount(data.public_repos); // GitHub API gives total public repos
      } catch (err: any) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchRepoCount();
  }, []);

  return (
    <div className="text-center text-black/70 dark:text-white/70">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {repoCount !== null && (
        <div className=" flex flex-col items-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="cursor-help text-4xl">
                <strong>{repoCount}</strong>
              </p>
            </TooltipTrigger>
            <TooltipContent sideOffset={4}>Total public repositories on GitHub</TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
