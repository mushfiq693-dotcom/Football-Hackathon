import { AuctionDashboard } from '@/components/auctions/auction-dashboard';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ auctionId: string }>;
}) {
  const { auctionId } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Auction Room</h1>
      <AuctionDashboard auctionId={auctionId} />
    </div>
  );
}
