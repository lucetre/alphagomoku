import torch
import pickle
import numpy as np

from modules.mcts import MCTS
from modules.resnet import ResNet


def _get_next_move(game, mcts, state, player):
    neutral_state = game.change_perspective(state, player)
    mcts_probs = mcts.search(neutral_state)
    action = np.argmax(mcts_probs)
    return mcts_probs, action


def _play_game(game, mcts, player=1):
    state = game.get_initial_state()

    while True:
        print(state)

        if player == 1:
            valid_moves = game.get_valid_moves(state)
            print("valid_moves", [i for i in range(
                game.action_size) if valid_moves[i] == 1])
            action = int(input(f"{player}:"))

            if valid_moves[action] == 0:
                print("action not valid")
                continue

        else:
            mcts_probs, action = _get_next_move(game, mcts, state, player)

        state = game.get_next_state(state, action, player)

        value, is_terminal = game.get_value_and_terminated(state, action)

        if is_terminal:
            print(state)
            if value == 1:
                print(player, "won")
            else:
                print("draw")
            break

        player = game.get_opponent(player)


class Game:
    def __init__(self, game, play_args):
        self.game = game
        self.play_args = play_args
        self.mcts = self._load_mcts()

    def _load_mcts(self):
        with open(f"models/{self.game}/train_args.pkl", "rb") as fr:
            train_args = pickle.load(fr)

        device = "cuda" if torch.cuda.is_available() else "cpu"
        print({'train_args': train_args, 'device': device})

        model = ResNet(self.game, 4, 64, device)
        model.load_state_dict(torch.load(
            f"models/{self.game}/model_{train_args['num_iterations']-1}.pt", map_location=device))
        model.eval()

        return MCTS(self.game, self.play_args, model)

    def play(self, player=1):
        _play_game(self.game, self.mcts, player)

    def get_next_move(self, state, player=1):
        return _get_next_move(self.game, self.mcts, state, player)
