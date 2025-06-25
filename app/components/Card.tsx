type CardProps = {
  title: string;
  children: React.ReactNode;
};

export default function Card({ title, children }: CardProps) {
  return (
    <div className="mx-auto mt-8 flex min-h-[420px] w-full flex-1 flex-col justify-start overflow-hidden rounded-4xl bg-gray-800 p-6 shadow-md">
      <div className="flex w-full flex-col items-center">
        <h1 className="mx-auto w-4/5 text-center text-3xl font-bold text-gray-200">
          {title}
        </h1>
        <div className="mx-auto mt-2 mb-2 h-1 w-4/5 rounded bg-gray-400" />
        <div className="mt-2 flex w-full flex-1 flex-col justify-start text-center text-xl text-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
