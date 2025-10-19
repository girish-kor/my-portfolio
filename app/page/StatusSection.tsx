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
          <h3 className="text-lg">{currentStatus.position}</h3>
        </div>
        <div className="flex flex-row justify-between gap-2 w-full items-baseline opacity-80 ">
          <p className="text-sm">{currentStatus.organization}</p>
          <p className="text-sm">{currentStatus.timeline}</p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col ml-4 h-20 justify-between">
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
