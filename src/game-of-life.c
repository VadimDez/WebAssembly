#include <stdio.h>

unsigned int rows = 100;
unsigned int columns = 100;
int board[100][100];
int newBoard[100][100];

int countNeighbors(int row, int col) {
  unsigned int neighbors = 0;

  if ((row - 1) >= 0) {
    neighbors = neighbors + board[row - 1][col - 1]  + board[row - 1][col]  + board[row - 1][col + 1];
  }

  if ((row + 1) < rows) {
    neighbors = neighbors + board[row + 1][col - 1]  + board[row + 1][col]  + board[row + 1][col + 1];
  }

  return neighbors + board[row][col - 1] + board[row][col + 1];
}

void setValue(int row, int col, int value) {
  board[row][col] = value;
}

int getNewValue(int row, int col) {
  int neighbors = countNeighbors(row, col);

  if (board[row][col]) {
    if (neighbors <= 1 || neighbors >= 4) {
      return 0;
    }
  } else if (neighbors == 3) {
    return 1;
  }

  return board[row][col];
}

void updateBoard() {
  for (int row = 0; row < rows; row++) {
    for (int col = 0; col < columns; col++) {
      newBoard[row][col] = getNewValue(row, col);
    }
  }

  for (int row = 0; row < rows; row++) {
    for (int col = 0; col < columns; col++) {
      board[row][col] = newBoard[row][col];
    }
  }
}

int getValue(int row, int col) {
  return board[row][col];
}
