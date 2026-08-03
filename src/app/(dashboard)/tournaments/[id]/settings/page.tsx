export default async function TournamentSettingsPage({
  params,
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tournament Settings</h1>
        <p className="text-muted-foreground">Configure tournament: {tournamentId}</p>
      </div>
      {/* Settings form will go here */}
    </div>
  );
}
