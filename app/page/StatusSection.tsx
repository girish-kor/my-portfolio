import { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { Button } from '~/components/ui/button';

export function StatusSection() {
  const status = [
    {
      position: 'Frontend Developer Intern',
      organization: 'STOOFERS',
      timeline: 'JUN 25 - SEP 25',
    },
    {
      position: 'B.E. in Computer Science Engineering',
      organization: 'University of Mumbai',
      timeline: 2024,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % status.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? status.length - 1 : prev - 1));
  };

  const currentStatus = status[currentIndex];

  return (
    <div className="flex items-center justify-between   w-full ">
      {/* Current education info */}
      <div className="flex flex-col justify-between flex-1 h-20 ">
        <div>
          <h3 className="font-semibold text-lg text-black/85 dark:text-white/85">
            {currentStatus.position}
          </h3>
        </div>
        <div className="flex flex-row justify-between gap-2 w-full items-baseline ">
          <p className="text-sm text-black/85">{currentStatus.organization}</p>
          <p className="text-[10px] text-black/50 dark:text-white/50">{currentStatus.timeline}</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col gap-1 ml-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          aria-label="Previous status"
          className="p-1"
        >
          <FaArrowUp />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          aria-label="Next status"
          className="p-1"
        >
          <FaArrowDown />
        </Button>
      </div>
    </div>
  );
}
