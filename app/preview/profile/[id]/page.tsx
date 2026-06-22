import Perfil from "../../../components/perfil";

export default async function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Perfil userId={Number(id)} />;
}