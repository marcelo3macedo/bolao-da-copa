export interface Participant {
  id: number;
  name: string;
  token: string;
  created_at: string;
}

export interface Game {
  id: number;
  home_team: string;
  away_team: string;
  home_flag: string;
  away_flag: string;
  game_date: string;
  stage: string;
  group_name: string | null;
  home_score: number | null;
  away_score: number | null;
  is_finished: boolean;
}

export interface Bet {
  id: number;
  participant_id: number;
  game_id: number;
  home_score: number;
  away_score: number;
}

export interface LeaderboardEntry {
  participant_id: number;
  name: string;
  total_points: number;
  exact_scores: number;
  correct_results: number;
  total_bets: number;
}

export interface BetWithGame extends Bet {
  home_team: string;
  away_team: string;
  home_flag: string;
  away_flag: string;
  game_date: string;
  stage: string;
  actual_home: number | null;
  actual_away: number | null;
  is_finished: boolean;
  points: number | null;
}
