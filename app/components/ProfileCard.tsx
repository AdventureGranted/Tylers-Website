import Image from 'next/image';
import { useState } from 'react';
import Modal from './Modal';

export default function ProfileCard() {
  const [showModal, setShowModal] = useState(false);

  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowModal(true);
    // Trigger download after a short delay so the modal is visible
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '/Tyler_Grant_Resume_2025.pdf';
      link.download = 'Tyler_Grant_Resume_2025.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);
  };

  return (
    <div className="mx-auto mt-4 flex max-w-full flex-col items-center overflow-hidden rounded-4xl bg-gray-800 p-6 shadow-md md:flex-row">
      <Image
        src="/profile.jpg"
        alt="Profile Picture of Tyler"
        width={240}
        height={240}
        className="mb-4 rotate-5 rounded-4xl shadow-lg shadow-indigo-500/30 transition-transform duration-300 hover:scale-105"
      />
      <div className="m-2 flex h-full w-full flex-col items-center justify-center text-center">
        <h1 className="font-bold00 w-full text-4xl">
          Hi, I&apos;m Tyler Grant. Nice to meet you!
        </h1>
        <p className="mt-2 text-2xl md:w-2/3">
          I&apos;m a passionate software engineer with experience in building
          modern, responsive websites and applications. I love learning new
          technologies and creating projects that make a difference.
        </p>
        <a
          href="/Tyler_Grant_Resume_2025.pdf"
          download
          onClick={handleDownload}
          className="mt-6 inline-block rounded-full bg-gray-400 px-6 py-2 font-bold text-gray-900 shadow transition-colors duration-200 hover:scale-105 hover:bg-yellow-300"
        >
          Download Resume
        </a>
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Thank You!</h2>
          <p className="mb-6 text-gray-700">
            I hope youe consider my resume for your next project or opportunity.
          </p>
        </Modal>
      </div>
    </div>
  );
}
