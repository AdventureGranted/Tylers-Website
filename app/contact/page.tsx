export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-900 px-4 py-12">
      <section className="flex w-full max-w-xl flex-col items-center rounded-3xl border border-gray-700 bg-gray-800 p-8 shadow-lg">
        <p className="mb-4 text-center text-lg text-gray-200">
          Feel free to reach out to me via email or phone!
        </p>
        <div className="flex w-full flex-col items-center gap-4">
          <a
            href="mailto:recruit.tyler.grant@gmail.com"
            className="text-xl font-semibold break-all text-yellow-300 hover:underline"
          >
            recruit.tyler.grant@gmail.com
          </a>
          <a
            href="tel:8016084675"
            className="text-xl font-semibold text-yellow-300 hover:underline"
          >
            (801) 608-4675
          </a>
        </div>
      </section>
    </main>
  );
}
