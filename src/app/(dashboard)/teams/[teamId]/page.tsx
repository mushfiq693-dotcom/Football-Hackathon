export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Team Details</h1>
        <p className="text-muted-foreground">Team ID: {teamId}</p>
      </div>
      {/* Team detail + roster will go here */}
    </div>
  );
}
