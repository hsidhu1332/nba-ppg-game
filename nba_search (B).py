from nba_api.stats.static import players
from nba_api.stats.static import teams


def nba_search(name):
    player_list = players.get_active_players()
    team_list = teams._get_teams()
    results = []
    for player in player_list:
        if name.lower() in player['full_name'].lower():
            results.append(player)
    for team in team_list:
        if name.lower() in team['full_name'].lower():
            results.append(team)
    return results
