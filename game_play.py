from modules.game.gomoku import Gomoku
from modules.play import Game

gomoku = Game(game=Gomoku(5, 5, 3), play_args={
    'C': 2,
    'num_searches': 1000,
    'dirichlet_epsilon': 0.25,
    'dirichlet_alpha': 0.3
})

gomoku.play(player=-1)
