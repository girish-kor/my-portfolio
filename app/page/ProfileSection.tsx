import { FaFileAlt, FaGithub, FaLinkedin } from 'react-icons/fa';

export function ProfileSection() {
  return (
    <div className="flex flex-col items-start  h-full justify-between">
      {/* DIVISION 1: Profile Image + Name & Title */}
      <div className="flex flex-row items-start gap-4 mb-4">
        {/* Profile Image */}
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="rounded w-32 h-32 object-cover bg-black dark:bg-white "
        />

        {/* Name & Title */}
        <div className="flex flex-col justify-start">
          <h2 className="text-xl font-bold">Girish Kor</h2>
          <p className="text-gray-600 dark:text-gray-300">Software Developer</p>
        </div>
      </div>
      {/* DIVISION 2: Description & Social Links */}
      <div>
        <div>
          <p className="text-gray-700 dark:text-gray-200">
            Passionate software developer with experience in building scalable web applications.
            Skilled in React, JavaScript, and modern web technologies, with a strong focus on clean
            code and user-friendly interfaces.
          </p>
        </div>

        <div className="flex gap-4 items-center mt-2 justify-between w-full">
          <div className="flex gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-100 hover:text-blue-500"
            >
              <FaGithub size={24} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-100 hover:text-blue-700"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
          <div>
            {/* Resume */}
            <a
              href="./resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-1 p-1 items-center bg-black dark:bg-white text-white dark:text-black rounded hover:opacity-80"
            >
              <span>RESUME</span>
              <FaFileAlt size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
