import BigButton from "@/components/BigButton";
import HeaderBar from "@/components/HeaderBar";

export default function NewEventPage({ params }: { params: { babyId: string } }) {
  return (
    <main className="container-md">
      <HeaderBar title="New Event" backHref={`/baby/${params.babyId}`} />
      <div className="space-y-3">
        <BigButton href={`/baby/${params.babyId}/feed`}>Feed</BigButton>
        <BigButton href={`/baby/${params.babyId}/sleep`}>Sleep</BigButton>
        <BigButton href={`/baby/${params.babyId}/change`}>Change</BigButton>
      </div>
    </main>
  );
}

