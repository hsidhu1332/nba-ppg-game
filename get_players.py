import json
from nba_api.stats.static import players
import random

def fetch_and_store_players():
    # Get list of all players
    player_list = players.get_inactive_players()

    # Save the player data to a JSON file
    with open('nba_players_inactive.json', 'w') as f:
        json.dump(player_list, f, indent=4)

# Call the function to fetch and store player data



def add_names():
    with open('nba_players.json', 'r') as f:
        players = json.load(f)

        with open('nba_ppg_active.json', 'r+') as g:
            data = json.load(g)

            for ppg in data['players']:
                for player in players:
                    if player['id'] == ppg['id']:
                        ppg['name'] = player['full_name']
            
            g.seek(0)
            json.dump(data, g, indent=4)

            # Truncate any extra data after the new write operation
            g.truncate()

def start():
    players_to_send = {}
    for i in range(12):
        value = random.randint(0,1)
        if value == 0:
            with open('nba_ppg_active.json', 'r') as f:
                data = json.load(f)
                players = data['players']
                rand_player = players[random.randint(0, len(players) - 1)]
                players_to_send[i] = {'pid': rand_player['id'], 'name': rand_player['name'], 'ppg': rand_player['ppg']}
        else:
            with open('nba_ppg_inactive.json', 'r') as f:
                data = json.load(f)
                players = data['players']
                rand_player = players[random.randint(0, len(players) - 1)]
                players_to_send[i] = {'pid': rand_player['id'], 'name': rand_player['name'], 'ppg': rand_player['ppg']}
    return players_to_send

# add_names()
# fetch_and_store_players()
print(start())