
import Navbar from "@/app/components/navbar";
import Loja from "@/app/components/loja";
import { getLoja } from "../../services/lojas";

export default async function LojaPage({ params }: { params: { id?: string } }) {
  const id = Number(params.id) || 1;
  const lojaData = await getLoja(id);

  return (
    <div className="min-h-screen" style={{ background: "#F5F0E8" }}>
      <Navbar />
      <Loja loja={lojaData} />
    </div>
  );
}