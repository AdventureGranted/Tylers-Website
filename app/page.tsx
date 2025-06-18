import Navbar from "./components/NavBar";
import ProfileCard from "./components/ProfileCard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-400">
      <Navbar />
      <main className="p-8">
        <ProfileCard />
      </main>
    </div>
  );
}
