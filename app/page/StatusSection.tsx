import { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

export function StatusSection() {
  const status = [
    {
      position: 'Frontend Developer Intern',
      organization: 'STOOFERS',
      timeline: 'JUN 25 - SEP 25',
    },
    {
      position: 'B.E. in Computer Science',
      organization: 'Mumbai University',
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
      <div className="flex flex-col flex-1">
        <div className="flex flex-row justify-between gap-2 w-full">
          <h3 className="font-semibold text-lg">{currentStatus.position}</h3>
          <p className="text-xs text-gray-500">{currentStatus.timeline}</p>
        </div>
        <p className="text-sm ">{currentStatus.organization}</p>
      </div>

      {/* Navigation buttons */}
      <div className="flex flex-col gap-1 ml-4">
        <button
          className="flex items-center justify-center border rounded-full p-1 hover:opacity-70"
          onClick={handlePrev}
        >
          <FaArrowUp />
        </button>
        <button
          className="flex items-center justify-center border rounded-full p-1 hover:opacity-70"
          onClick={handleNext}
        >
          <FaArrowDown />
        </button>
      </div>
    </div>
  );
}
