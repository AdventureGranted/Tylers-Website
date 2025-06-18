import Navbar from "./components/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-8">
        <section id="projects">
          <h2 className="text-2xl font-semibold">Projects</h2>
        </section>
      </main>
    </div>
  );
}
