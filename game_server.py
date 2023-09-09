from http.server import BaseHTTPRequestHandler, HTTPServer
import logging
import json

from modules.game.gomoku import Gomoku
from modules.play import Game

import numpy as np

gomoku = Game(game=Gomoku(5, 5, 3), play_args={
    'C': 2,
    'num_searches': 1000,
    'dirichlet_epsilon': 0.25,
    'dirichlet_alpha': 0.3
})


class GameServer(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_GET(self):
        logging.info("GET request,\nPath: %s\nHeaders:\n%s\n",
                     str(self.path), str(self.headers))
        self._set_response()
        self.wfile.write("GET request for {}".format(
            self.path).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        logging.info("POST request,\nPath: %s\nHeaders:\n%s\n\nBody:\n%s\n",
                     str(self.path), str(self.headers), post_data.decode('utf-8'))

        if self.path == '/next_move':
            state = json.loads(post_data)
            mcts_probs, action = gomoku.get_next_move(
                np.array(state), player=1)

            next_move = {'mcts_probs': mcts_probs.tolist(),
                         'action': int(action)}

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(next_move).encode('utf-8'))
        else:
            self._set_response()
            self.wfile.write("POST request for {}".format(
                self.path).encode('utf-8'))


def run(server_class=HTTPServer, handler_class=GameServer, port=8080):
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    logging.info('Starting httpd...\n')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping httpd...\n')


if __name__ == '__main__':
    from sys import argv

    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()
