from flask import Flask, request, jsonify

from modules.game.gomoku import Gomoku
from modules.play import Game

import numpy as np

app = Flask(__name__)

gomoku = Game(game=Gomoku(5, 5, 3), play_args={
    'C': 2,
    'num_searches': 1000,
    'dirichlet_epsilon': 0.25,
    'dirichlet_alpha': 0.3
})


@app.route('/')
def index():
    return 'AlphaGomoku Server'


@app.route('/ready')
def ready():
    return jsonify({"message": "alphagomoku", "status": "200"}), 200


@app.route('/next_move', methods=['POST'])
def get_next_move():
    data = request.get_json()

    if data is None:
        return jsonify({"error": "Invalid JSON data"}), 400

    state = data['state']
    player = data['player']
    mcts_probs, action = gomoku.get_next_move(np.array(state), player)
    next_move = {'mcts_probs': mcts_probs.tolist(), 'action': int(action)}

    return jsonify(next_move)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
