from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.endpoints import teamyearbyyearstats
import zmq


def player_stats(id):
    regular_season_stats = (playercareerstats.PlayerCareerStats
                            (player_id=id).get_data_frames()[0])

    if not regular_season_stats.empty:
        return regular_season_stats.iloc[-1]
    return 'Player has not played yet'


def team_stats(id):
    regular_season_stats = (teamyearbyyearstats.TeamYearByYearStats
                            (team_id=id).get_data_frames()[0])

    return regular_season_stats.iloc[-1]
