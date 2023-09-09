import requests
import json

state = [[0,  0,  0,  0,  0],
         [0,  1,  1, -1,  0],
         [0,  0,  0,  0,  0],
         [0,  1,  0,  0,  0],
         [0,  0,  0,  0,  0]]

# mcts_probs, action = gomoku.get_next_move(np.array(state), player=1)
# print({'mcts_probs': mcts_probs, 'action': action})

json_data = json.dumps(state)
url = "http://localhost:8080/next_move"

headers = {"Content-Type": "application/json"}
response = requests.post(url, data=json_data, headers=headers)

if response.status_code == 200:
    next_move = json.loads(response.content)
    print(next_move)
else:
    print(f"Request failed with status code {response.status_code}")
