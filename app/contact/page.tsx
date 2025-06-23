export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-900 px-4 py-12 flex flex-col items-center">
      <section className="w-full max-w-xl bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-700 flex flex-col items-center">
        <p className="text-lg text-gray-200 mb-4 text-center">
          Feel free to reach out to me via email or phone!
        </p>
        <div className="flex flex-col gap-4 w-full items-center">
          <a
            href="mailto:recruit.tyler.grant@gmail.com"
            className="text-yellow-300 text-xl font-semibold hover:underline break-all"
          >
            recruit.tyler.grant@gmail.com
          </a>
          <a
            href="tel:8016084675"
            className="text-yellow-300 text-xl font-semibold hover:underline"
          >
            (801) 608-4675
          </a>
        </div>
      </section>
    </main>
  );
}
