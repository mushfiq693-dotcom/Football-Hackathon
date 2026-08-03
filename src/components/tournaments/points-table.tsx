'use client';

interface Standing {
  team_id: string;
  total_points: number;
  total_goal_difference: number;
  wins: number;
  draws: number;
  losses: number;
}

export function PointsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50">
          <tr>
            <th className="px-4 py-3 text-left">Team</th>
            <th className="px-4 py-3 text-center">W</th>
            <th className="px-4 py-3 text-center">D</th>
            <th className="px-4 py-3 text-center">L</th>
            <th className="px-4 py-3 text-center">GD</th>
            <th className="px-4 py-3 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => (
            <tr key={s.team_id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">{s.team_id}</td>
              <td className="px-4 py-3 text-center">{s.wins}</td>
              <td className="px-4 py-3 text-center">{s.draws}</td>
              <td className="px-4 py-3 text-center">{s.losses}</td>
              <td className="px-4 py-3 text-center">{s.total_goal_difference}</td>
              <td className="px-4 py-3 text-center font-bold">{s.total_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
