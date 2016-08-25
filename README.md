Tic-tac-toe
===========

- To keep track of the game board, I created an array of rows which contains all possible winning combinations of 3 spaces. The Board object inside of TicTacToe contains a list of each space and which of these rows it is a part of. This made it easy to check for a win condition after each move.

- Easy AI difficulty moves randomly.

- Hard AI should never lose, but please let me know if I missed a case. AI play style was based on Arjun Subramaniam's extremely helpful visual guide found at https://www.quora.com/Is-there-a-way-to-never-lose-at-Tic-Tac-Toe.

    I used a variety of boolean helper methods including isEdge, isCorner, attemptBlock, attemptWin, etc., in order to keep the main cpuTurn method readable.

Unminified CodePen version: http://codepen.io/Meepasaurus/full/xOoaGx/
----------------------------------------------------------------------
