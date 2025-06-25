export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12">
      <h1 className="mb-8 text-4xl font-bold text-white">About Me</h1>

      <section className="mb-8 w-full max-w-2xl rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-2 text-2xl font-semibold text-yellow-300">Hobbies</h2>
        <p className="text-gray-200"></p>
      </section>
      <section className="mb-8 w-full max-w-2xl rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-2 text-2xl font-semibold text-yellow-300">Family</h2>
        <p className="text-gray-200"></p>
      </section>
      <section className="mb-8 w-full max-w-2xl rounded-3xl border border-gray-700 bg-gray-800 p-6 shadow-lg">
        <h2 className="mb-2 text-2xl font-semibold text-yellow-300">Other</h2>
        <p className="text-gray-200"></p>
      </section>
    </main>
  );
}
