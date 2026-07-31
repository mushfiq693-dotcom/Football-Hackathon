export default async function TournamentDetailPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tournament Details</h1>
        <p className="text-muted-foreground">Tournament ID: {tournamentId}</p>
      </div>
      {/* Tournament detail content will go here */}
    </div>
  );
}
