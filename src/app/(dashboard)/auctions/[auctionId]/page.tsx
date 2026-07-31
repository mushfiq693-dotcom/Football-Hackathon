export default async function AuctionDetailPage({
  params,
}: {
  params: Promise<{ auctionId: string }>;
}) {
  const { auctionId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Auction Lobby</h1>
        <p className="text-muted-foreground">Auction ID: {auctionId}</p>
      </div>
      {/* Auction lobby content will go here */}
    </div>
  );
}
