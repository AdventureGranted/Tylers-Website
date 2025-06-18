import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="max-w-7xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden flex md:flex-row flex-col items-center p-6 mt-8">
      <Image
        src="/TylerProfile.jpg"
        alt="Profile Picture of Tyler"
        width={240}
        height={240}
        className="rounded-4xl mb-4 shadow-2xl rotate-5"
      />
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-200">
          Hi, I&apos;m Tyler Grant. Nice to meet you!
        </h1>
        <p className="text-gray-200 text-center text-xl md:ml-5 mt-2">
          I&apos;m a passionate web developer with experience in building
          modern, responsive websites and applications. I love learning new
          technologies and creating projects that make a difference.
        </p>
      </div>
    </div>
  );
}
