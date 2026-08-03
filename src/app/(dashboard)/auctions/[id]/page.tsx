import { AuctionDashboard } from '@/components/auctions/auction-dashboard';

export default async function AuctionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Auction Room</h1>
      <AuctionDashboard auctionId={id} />
    </div>
  );
}
