import Navbar from "./components/NavBar";
import ProfileCard from "./components/ProfileCard";
import Starfield from "./components/Starfield";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Starfield
        starCount={1500}
        starColor={[255, 255, 255]}
        speedFactor={0.05}
        backgroundColor="black"
      />
      <Navbar />
      <main className="p-8">
        <div className="z-20 relative">
          <ProfileCard />
        </div>
      </main>
    </div>
  );
}
