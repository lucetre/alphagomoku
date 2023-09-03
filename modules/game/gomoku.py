import numpy as np


class Gomoku:
    def __init__(self, row_count=3, column_count=3, in_a_row=3):
        self.row_count = row_count
        self.column_count = column_count
        self.in_a_row = in_a_row
        self.action_size = self.row_count * self.column_count

    def __repr__(self):
        return f"Gomoku_{self.row_count}_{self.column_count}_{self.in_a_row}"

    def get_initial_state(self):
        return np.zeros((self.row_count, self.column_count))

    def get_next_state(self, state, action, player):
        row = action // self.column_count
        column = action % self.column_count
        state[row, column] = player
        return state

    def get_valid_moves(self, state):
        return (state.reshape(-1) == 0).astype(np.uint8)

    def check_row(self, player, state, row, column):
        streak = 0
        for col in range(max(0, column - self.in_a_row + 1), min(self.column_count, column + self.in_a_row)):
            if state[row][col] == player:
                streak += 1
                if streak == self.in_a_row:
                    return True
            else:
                streak = 0
        return False

    def check_column(self, player, state, row, column):
        streak = 0
        for r in range(max(0, row - self.in_a_row + 1), min(self.row_count, row + self.in_a_row)):
            if state[r][column] == player:
                streak += 1
                if streak == self.in_a_row:
                    return True
            else:
                streak = 0
        return False

    def check_diagonal(self, player, state, row, column):
        directions = [(1, 1), (1, -1)]  # (row step, column step)

        for dr, dc in directions:
            streak = 0
            for step in range(-self.in_a_row + 1, self.in_a_row):
                r, c = row + dr * step, column + dc * step
                if 0 <= r < self.row_count and 0 <= c < self.column_count and state[r][c] == player:
                    streak += 1
                    if streak == self.in_a_row:
                        return True
                else:
                    streak = 0

        return False

    def check_win(self, state, action):
        if action == None:
            return False

        row = action // self.column_count
        column = action % self.column_count
        player = state[row, column]

        return (
            self.check_row(player, state, row, column) or
            self.check_column(player, state, row, column) or
            self.check_diagonal(player, state, row, column)
        )

    def get_value_and_terminated(self, state, action):
        if self.check_win(state, action):
            return 1, True
        if np.sum(self.get_valid_moves(state)) == 0:
            return 0, True
        return 0, False

    def get_opponent(self, player):
        return -player

    def get_opponent_value(self, value):
        return -value

    def change_perspective(self, state, player):
        return state * player

    def get_encoded_state(self, state):
        encoded_state = np.stack(
            (state == -1, state == 0, state == 1)
        ).astype(np.float32)

        if len(state.shape) == 3:
            encoded_state = np.swapaxes(encoded_state, 0, 1)

        return encoded_state
