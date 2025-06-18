type CardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="bg-gray-800 rounded-4xl shadow-md overflow-hidden flex flex-col justify-start p-6 mt-8 flex-1 w-full mx-auto min-h-[420px]">
      <div className="flex flex-col items-center w-full">
        <h1 className="text-3xl font-bold text-gray-200 text-center w-4/5 mx-auto">
          {title}
        </h1>
        <div className="w-4/5 h-1 bg-gray-400 rounded mx-auto mt-2 mb-2" />
        <div className="flex-1 flex flex-col justify-start w-full">
          <p className="text-gray-200 text-center text-xl mt-2 w-full">
            {children}
          </p>
        </div>
      </div>
    </div>
  );
}
