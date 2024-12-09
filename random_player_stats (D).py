import random
import time
from nba_api.stats.endpoints import playercareerstats
import json


def get_random_player():
    with open('nba_players.json', 'r') as f:
        player_names = json.load(f)

    random_player = random.choice(player_names)

    return random_player['id'], random_player['full_name']

def ppg():
    pid, name = get_random_player()
    pid = 2082

    player_career = playercareerstats.PlayerCareerStats(pid)
    data = player_career.career_totals_regular_season.get_data_frame()
    points = data['PTS'].values[0] / data['GP'].values[0]
    points = round(points, 1)
    return points, name



start_time = time.time()
print(ppg())
end_time = time.time()

print(end_time - start_time)