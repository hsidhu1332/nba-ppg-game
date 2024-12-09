import random
import json
import asyncio
import time
from nba_api.stats.endpoints import playercareerstats
from datetime import datetime
from dateutil.relativedelta import relativedelta
from obtain_headshot import obtainHeadshot

async def get_random_player():
    # Read the player names from 'nba_players.json'
    with open('nba_players_inactive.json', 'r') as f:
        player_names = json.load(f)

    # Pick a random player
    random_player = random.choice(player_names)
    return random_player['id'], random_player['full_name'], random_player['is_active']

async def ppg(pid, name, active, needs_updating=False):
    try:
        obtainHeadshot(pid)
        if not active:
            # Read the existing players' PPG data from 'nba_ppg.json'
            with open('nba_ppg_inactive.json', 'r') as f:
                data = json.load(f)

                if str(pid) in data['id_map']:
                    index = data['id_map'][str(pid)]

                    player = data['players'][index]
                    return pid, name, player['ppg'], active, needs_updating
        else:
            with open('nba_ppg_active.json', 'r') as f:
                data = json.load(f)
                if str(pid) in data['id_map']:
                    index = data['id_map'][str(pid)]

                    player = data['players'][index]
                    current_time = datetime.now()
                    timestamp = datetime.fromisoformat(player['timestamp'])
                    difference = relativedelta(current_time, timestamp)
                    if difference.months >= 1:
                        player_career = playercareerstats.PlayerCareerStats(pid)
                        data = player_career.career_totals_regular_season.get_data_frame()
                        points = data['PTS'].values[0] / data['GP'].values[0]
                        points = round(points, 1)
                        needs_updating = True
                        return pid, name, points, active, needs_updating
                    else:
                        return pid, name, player['ppg'], active, needs_updating
        
        # Fetch career stats using nba_api
        player_career = playercareerstats.PlayerCareerStats(pid)
        data = player_career.career_totals_regular_season.get_data_frame()
        points = data['PTS'].values[0] / data['GP'].values[0]
        points = round(points, 1)

        return pid, name, points, active, needs_updating
    except Exception as e:
        print(f"Error fetching PPG for player {pid}: {e}")
        return None

async def fetch_multiple_ppg(player_ids):
    tasks = []
    for pid, name, active in player_ids:
        tasks.append(ppg(pid, name, active))  # Add each player PPG request to the task list
    results = await asyncio.gather(*tasks)  # Run the tasks concurrently
    return results

# Example usage:
async def main():
    # Use await here to get the random player IDs
    player_ids = await asyncio.gather(*[get_random_player() for _ in range(12)])  # Get 12 random player IDs
    ppgs = await fetch_multiple_ppg(player_ids)  # Extract the player IDs from the tuple
    for pid, name, ppg, active, needs_updating in ppgs:
        if not active:
            with open('nba_ppg_inactive.json', 'r+') as f:
                data = json.load(f)
                if str(pid) not in data['id_map']:
                    # Add the new player to the list
                    data['players'].append({
                        "id": pid,
                        "ppg": ppg,
                        "name": name
                    })

                    # Add the player ID to the map with the index in the list
                    data['id_map'][str(pid)] = len(data['players']) - 1

                    # Move the file pointer to the beginning and write the updated content
                    f.seek(0)
                    json.dump(data, f, indent=4)

                    # Truncate any extra data after the new write operation
                    f.truncate()
        else:
            with open('nba_ppg_active.json', 'r+') as f:
                data = json.load(f)
                if str(pid) not in data['id_map']:
                    # Add the new player to the list
                    data['players'].append({
                        "id": pid,
                        "ppg": ppg,
                        "timestamp": datetime.now().isoformat(),
                        "name": name
                    })

                    # Add the player ID to the map with the index in the list
                    data['id_map'][str(pid)] = len(data['players']) - 1

                    # Move the file pointer to the beginning and write the updated content
                    f.seek(0)
                    json.dump(data, f, indent=4)

                    # Truncate any extra data after the new write operation
                    f.truncate()
                elif needs_updating:
                    index = data['id_map'][str(pid)]
                    player = data['players'][index]
                    current_time = datetime.now()
                    timestamp = datetime.fromisoformat(player['timestamp'])
                    difference = relativedelta(current_time, timestamp)
                    if difference.months >= 1:
                        player['timestamp'] = datetime.now().isoformat()
                        player['ppg'] = ppg
                        f.seek(0)
                        json.dump(data, f, indent=4)

                        # Truncate any extra data after the new write operation
                        f.truncate()
    print(ppgs)

# # Run the asynchronous main function
# start = time.time()
# asyncio.run(main())
# end = time.time()

# print(end-start)

while True:
    asyncio.run(main())
    time.sleep(300)
