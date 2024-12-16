from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import random
#from random_player_ppg_async import main as get_players
import json

app = Flask(__name__)

CORS(app)

# @app.route('/api/start', methods=['GET'])
# def start():
#     players_to_send = {}
#     for i in range(12):
#         value = random.randint(0,1)
#         if value == 0:
#             with open('nba_ppg_active.json', 'r') as f:
#                 data = json.load(f)
#                 players = data['players']
#                 rand_player = players[random.randint(0, len(players) - 1)]
#                 players_to_send[i] = {'pid': rand_player['id'], 'name': rand_player['name'], 'ppg': rand_player['ppg']}
#         else:
#             with open('nba_ppg_inactive.json', 'r') as f:
#                 data = json.load(f)
#                 players = data['players']
#                 rand_player = players[random.randint(0, len(players) - 1)]
#                 players_to_send[i] = {'pid': rand_player['id'], 'name': rand_player['name'], 'ppg': rand_player['ppg']}
#     return jsonify(players_to_send)


# @app.route('/api/send_players', methods=['GET'])
# async def send_players():
#     """
#     Start the game with 12 players
#     """
#     players = await get_players()
#     players_to_send = {}
#     index = 0
#     for pid, name, ppg, active, needs_updating in players:
#         players_to_send[index] = {'pid': pid, 'name': name, 'ppg': ppg}
#         index += 1
#     return jsonify(players_to_send)


@app.route('/api/active_players', methods=['GET'])
def active_players():
    with open('nba_ppg_active.json', 'r') as f:
        data = json.load(f)
        players = data['players']
        return jsonify(players)

@app.route('/api/inactive_players', methods=['GET'])
def inactive_players():
    with open('nba_ppg_inactive.json', 'r') as f:
        data = json.load(f)
        players = data['players']
        return jsonify(players)

@app.route('/api/all_players', methods=['GET'])
def all_players():
    rand = random.randint(0,1)
    if rand == 0:
        with open('nba_ppg_active.json', 'r') as f:
            data = json.load(f)
            players = data['players']
            return jsonify(players)
    else:
        with open('nba_ppg_inactive.json', 'r') as f:
            data = json.load(f)
            players = data['players']
            return jsonify(players)

@app.route('/api/prolific_scorers', methods=['GET'])
def prolific_scorers():
    prolific_scorers = []
    inactive_players = None
    active_players = None
    with open('nba_ppg_active.json', 'r') as f:
        data = json.load(f)
        active_players = data['players']
        
    with open('nba_ppg_inactive.json', 'r') as f:
        data = json.load(f)
        inactive_players = data['players']
    all_players = active_players + inactive_players
    for player in all_players:
        if player['ppg'] > 14:
            prolific_scorers.append(player)
    return jsonify(prolific_scorers)
        


@app.route('/api/image/<pid>')
def get_image(pid):
    try:
        image_path = f'headshots/{pid}.png'
        return send_file(image_path, mimetype='image/png')
    except FileNotFoundError:
        return "Image not found", 404

if __name__ == "__main__":
    port = int(7000) 
    #                                 ^^^^
    #              You can replace this number with any valid port
   
    app.run(host='0.0.0.0', port=port, debug=True)