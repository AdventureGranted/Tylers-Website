import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="max-w-full mx-auto bg-gray-800 rounded-4xl shadow-md overflow-hidden flex md:flex-row flex-col items-center p-6 mt-8">
      <Image
        src="/profile.jpg"
        alt="Profile Picture of Tyler"
        width={240}
        height={240}
        className="rounded-4xl mb-4 shadow-lg rotate-5 shadow-indigo-500/30"
      />
      <div className="m-2 flex flex-col items-center justify-center h-full w-full text-center">
        <h1 className="text-4xl font-bold text-gray-200 w-full">
          Hi, I&apos;m Tyler Grant. Nice to meet you!
        </h1>
        <p className="text-gray-200 text-2xl mt-2 w-2/3">
          I&apos;m a passionate web developer with experience in building
          modern, responsive websites and applications. I love learning new
          technologies and creating projects that make a difference.
        </p>
      </div>
    </div>
  );
}
