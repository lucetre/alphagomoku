import requests
import json
import pprint


def get_next_move(state, player=1):
    json_data = json.dumps({
        "state": state,
        "player": player,
    })

    url = "https://alphagomoku.onrender.com/next_move"
    # url = "http://localhost:8080/next_move"

    headers = {"Content-Type": "application/json"}
    response = requests.post(
        url, data=json_data, headers=headers, timeout=5000)

    if response.status_code == 200:
        next_move = json.loads(response.content)
    else:
        print(f"Request failed with status code {response.status_code}")

    return next_move


pprint.pprint(
    get_next_move(
        state=[[0,  0,  0,  0,  1],
               [0,  0,  1, -1,  0],
               [0,  0, -1,  0,  0],
               [0,  0, -1,  0,  1],
               [0,  0,  0,  0,  0]],
        player=1,
    ))
