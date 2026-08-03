-- Function to recalculate tournament standings
CREATE OR REPLACE FUNCTION update_tournament_standings(p_tournament_id UUID)
RETURNS VOID AS $$
BEGIN
  -- We can use a View or a Materialized View for performance, 
  -- or a dedicated table that gets updated via triggers.
  -- Given the hackathon context, a View is simplest and always up-to-date.
END;
$$ LANGUAGE plpgsql;

-- View for standings
CREATE OR REPLACE VIEW tournament_standings AS
WITH match_results AS (
  SELECT 
    tournament_id,
    home_team_id AS team_id,
    CASE 
      WHEN home_score > away_score THEN 3
      WHEN home_score = away_score THEN 1
      ELSE 0
    END AS points,
    home_score - away_score AS goal_difference
  FROM fixtures
  WHERE status = 'completed'
  UNION ALL
  SELECT 
    tournament_id,
    away_team_id AS team_id,
    CASE 
      WHEN away_score > home_score THEN 3
      WHEN away_score = home_score THEN 1
      ELSE 0
    END AS points,
    away_score - home_score AS goal_difference
  FROM fixtures
  WHERE status = 'completed'
)
SELECT 
  tournament_id,
  team_id,
  SUM(points) AS total_points,
  SUM(goal_difference) AS total_goal_difference,
  COUNT(*) FILTER (WHERE points = 3) AS wins,
  COUNT(*) FILTER (WHERE points = 1) AS draws,
  COUNT(*) FILTER (WHERE points = 0) AS losses
FROM match_results
GROUP BY tournament_id, team_id
ORDER BY total_points DESC, total_goal_difference DESC;
