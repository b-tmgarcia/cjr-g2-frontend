import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="p-4">
        <h1 className="text-4xl font-bold text-center mt-10">Bem-vindo à Stock.IO!</h1>
      </main>
    </div>
  );
}
