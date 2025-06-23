export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-900 px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-8">About Me</h1>

      <section className="w-full max-w-2xl bg-gray-800 rounded-3xl shadow-lg p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Hobbies</h2>
        <p className="text-gray-200"></p>
      </section>
      <section className="w-full max-w-2xl bg-gray-800 rounded-3xl shadow-lg p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Family</h2>
        <p className="text-gray-200"></p>
      </section>
      <section className="w-full max-w-2xl bg-gray-800 rounded-3xl shadow-lg p-6 mb-8 border border-gray-700">
        <h2 className="text-2xl font-semibold text-yellow-300 mb-2">Other</h2>
        <p className="text-gray-200"></p>
      </section>
    </main>
  );
}
