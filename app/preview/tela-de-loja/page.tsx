import Navbar from "../../components/navbar";
import Loja from "../../components/loja"; // Ajuste o caminho se necessário

export default function LojaPage({ params }: { params: { id?: string } }) {
  // Define o ID (padrão 1 se não for passado na URL)
  const id = Number(params.id) || 1;

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <Navbar />
      {/* Passa apenas o ID, o fetch real acontece dentro do componente Loja */}
      <Loja lojaId={id} />
    </div>
  );
}