import { FaFileAlt, FaGithub, FaLinkedin } from 'react-icons/fa';

export function ProfileSection() {
  return (
    <div className="flex flex-col items-start  h-full justify-between">
      {/* DIVISION 1: Profile Image + Name & Title */}
      <div className="flex flex-row items-end justify-between gap-4 mb-4 w-full">
        {/* Profile Image */}
        <img
          src="/profile.jpeg"
          alt="Profile"
          className="rounded w-32 h-32 object-cover bg-black dark:bg-white "
        />

        {/* Name & Title */}
        <div className="flex-1 flex flex-col justify-end items-end text-right">
          <h2 className="text-xl font-bold">Girish Kor</h2>
          <p className="text-gray-600 dark:text-gray-300">Software Developer</p>
        </div>
      </div>
      {/* DIVISION 2: Description & Social Links */}
      <div>
        <div className="">
          <p className="text-gray-700 dark:text-gray-200 text-justify">
            Passionate software developer with experience in building scalable web applications.
            Skilled in React, JavaScript, and modern web technologies, with a strong focus on clean
            code and user-friendly interfaces.
          </p>
        </div>

        <div className="flex gap-4 items-center mt-2 justify-between w-full">
          <div className="flex gap-4">
            {/* GitHub */}
            <a
              href="https://github.com/girish-kor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-100 hover:text-blue-500"
            >
              <FaGithub size={27} />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/girish-kor-52078a349"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 dark:text-gray-100 hover:text-blue-700"
            >
              <FaLinkedin size={27} />
            </a>
          </div>
          <div>
            {/* Resume */}
            <a
              href="./resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:opacity-80"
            >
              <span className="border-2 border-black dark:border-white pl-2 border-r-0">
                RESUME
              </span>
              <FaFileAlt size={27} className="" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
