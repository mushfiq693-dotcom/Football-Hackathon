export default async function TournamentPlayersPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Player Pool</h1>
          <p className="text-muted-foreground">Players in tournament: {tournamentId}</p>
        </div>
        {/* Add Player button will go here */}
      </div>
      {/* Player pool table will go here */}
    </div>
  );
}
