import requests
import os
# import json
# import time

def obtainHeadshot(pid):
    if os.path.exists(f"headshots/{pid}.png"):
        return
    else:
        image_url = f"https://cdn.nba.com/headshots/nba/latest/260x190/{pid}.png"

        output_file = f"headshots/{pid}.png"

        response = requests.get(image_url)

        if response.status_code == 200:
            with open(output_file, "wb") as f:
                f.write(response.content)
        else:
            print('failed to get headshot')

# with open('nba_ppg_inactive.json', 'r') as f:
#     data = json.load(f)
#     players = data['players']
#     for player in players:
#         obtainHeadshot(player['id'])
