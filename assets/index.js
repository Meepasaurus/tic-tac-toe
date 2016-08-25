'use strict';

var TicTacToe = function(){

	var statusDOM = $('#status'),
		playerMarker = '',
		cpuMarker = '',
		difficulty = '',
		currentPlayer = null,
		turnNumber = 0,
		previousMove = null,
		previousMoves = [],
		openSpaces = [1, 2, 3, 4, 5, 6, 7, 8, 9],
		edges = [2, 4, 6, 8],
		corners = [1, 3, 7, 9],
		//array of all possible winning rows and their space IDs
		//      [  0  ], [  1  ], [  2  ], [  3  ], [  4  ], [  5  ], [  6  ], [  7  ]
		rows = [[1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7]],
		//object of space objects, each one containing a list of which rows it belongs to and its current marker (X or O or null/empty)
		Board = function() {
			return {
				1 : {
					rows : [0, 3, 6],
					marker : '-'
				},
				2 : {
					rows : [0, 4],
					marker : '-'
				},
				3 : {
					rows : [0, 5, 7],
					marker : '-'
				},
				4 : {
					rows : [1, 3],
					marker : '-'
				},
				5 : {
					rows : [1, 4, 6, 7],
					marker : '-'
				},
				6 : {
					rows : [1, 5],
					marker : '-'
				},
				7 : {
					rows : [2, 3, 7],
					marker : '-'
				},
				8 : {
					rows : [2, 4],
					marker : '-'
				},
				9 : {
					rows : [2, 5, 6],
					marker : '-'
				}
			};
		},
		myBoard = {};

	return {
		moveRandomly: function(){
			var space = openSpaces[Math.floor(Math.random() * openSpaces.length)];
			this.markSpace(cpuMarker, space);
		},

		cpuTurn: function(){
			if (difficulty === 'easy'){
				this.moveRandomly();
			} else {
				//hard
				switch(turnNumber){
					case 1:
						//mark center
						this.markSpace(cpuMarker, 5);
						break;
					case 2:
						var turn1 = previousMove;
						switch(turn1){
							case 1:
								break;
						}
						break;
					case 3:
						var turn2 = previousMove;
						
						//if opponent marked an edge
						if (myBoard[5].marker === cpuMarker && this.isEdge(turn2)){
							//mark either corner opposite previousMove
							switch(turn2){
								case 2:
									this.markSpace(cpuMarker, 7);
									break;
								case 4:
									this.markSpace(cpuMarker, 9);		
									break;
								case 6:
									this.markSpace(cpuMarker, 1);
									break; 
								case 8:
									this.markSpace(cpuMarker, 3);
									break;
							}
						}

						//if opponent marked a corner
						if (myBoard[5].marker === cpuMarker && this.isCorner(turn2)){
							//mark the opposite corner
							switch(turn2){
								case 1:
									this.markSpace(cpuMarker, 9);
									break;
								case 3:
									this.markSpace(cpuMarker, 7);
									break;
								case 7:
									this.markSpace(cpuMarker, 3);
									break;
								case 9:
									this.markSpace(cpuMarker, 1);
									break;
							}
						}
						break;
					case 5:
						//if opponent first marked an edge
						if (this.isEdge(previousMoves[1])){
							if (!this.attemptWin()){
								this.attemptBlock();
							}
						} else {
							//opponent first marked a corner
							if (!this.attemptBlock()){
								this.attemptTriangle();
							}
						}
						break;
					case 7:
						//if opponent first marked an edge
						if (this.isEdge(previousMoves[1])){
							if (!this.attemptWin()){
								this.attemptBlock();
							}
						} else {
							//opponent first marked a corner
							//if opponent's second move was a corner
							if (this.isCorner(previousMoves[3])){
								if (!this.attemptWin()){
									if (!this.attemptBlock()){
										this.attemptSetup();
									}
								}
							//opponent's second move was an edge
							} else {
								this.attemptWin();
							}

						}
						break;
					case 9:
						this.moveRandomly();
						break;
				}
			}
		},

		//tries to get [CPU-blank-CPU] in a row, used in conjunction with a winning triangle setup
		attemptTriangle: function(){
			var triangleSpace = null;
			
			for (var i=0; i<=7; i++){
				triangleSpace = null;

				if (myBoard[rows[i][0]].marker === cpuMarker && myBoard[rows[i][1]].marker === '-' && myBoard[rows[i][2]].marker === '-'){
					triangleSpace = rows[i][2];
				}
				if (myBoard[rows[i][0]].marker === '-' && myBoard[rows[i][1]].marker === '-' && myBoard[rows[i][2]].marker === cpuMarker){
					triangleSpace = rows[i][0];
				}
				//console.log(triangleSpace);

				//found a move
				if (triangleSpace !== null){
					this.markSpace(cpuMarker, triangleSpace);
					return true;
				}
			}
			return false;
		},

		//tries to get two in row with one blank remaining
		attemptSetup: function(){
			var cpuCounter = 0,
				emptyCounter = 0,
				setupSpace = null;
			
			for (var i=0; i<=7; i++){
				cpuCounter = 0;
				emptyCounter = 0;
				setupSpace = null;

				for (var j=0; j<=2; j++){
					if (myBoard[rows[i][j]].marker === cpuMarker){
						cpuCounter++;
					} else if (myBoard[rows[i][j]].marker === '-'){
						setupSpace = rows[i][j];
						emptyCounter++;
					}
				}

				//found a move
				if (cpuCounter === 1 && emptyCounter === 2){
					this.markSpace(cpuMarker, setupSpace);
					return true;
				}
			}
			return false;
		},

		attemptWin: function(){
			var cpuCounter = 0,
				winSpace = null;
			
			for (var i=0; i<=7; i++){
				cpuCounter = 0;
				winSpace = null;

				for (var j=0; j<=2; j++){
					if (myBoard[rows[i][j]].marker === cpuMarker){
						cpuCounter++;
					} else if (myBoard[rows[i][j]].marker === '-'){
						winSpace = rows[i][j];
					}
				}

				//found a winning move
				if (cpuCounter === 2 && winSpace !== null){
					this.markSpace(cpuMarker, winSpace);
					return true;
				}
			}
			return false;
		},

		//search rows for two of playerMarker and block it, else return false
		attemptBlock: function(){
			var playerCounter = 0,
				blockSpace = null;
			
			for (var i=0; i<=7; i++){
				playerCounter = 0;
				blockSpace = null;

				for (var j=0; j<=2; j++){
					if (myBoard[rows[i][j]].marker === playerMarker){
						playerCounter++;
					} else if (myBoard[rows[i][j]].marker === '-'){
						blockSpace = rows[i][j];
					}
				}

				//found a row to block
				if (playerCounter === 2 & blockSpace !== null){
					this.markSpace(cpuMarker, blockSpace);
					return true;
				}
			}
			return false;
		},

		isCorner: function(spaceID){
			return (corners.indexOf(spaceID) !== -1) ? true : false;
		},

		isEdge: function(spaceID){
			return (edges.indexOf(spaceID) !== -1) ? true : false;
		},

		checkRow: function(row){
			var rowToCheck = rows[row],
				a = myBoard[rowToCheck[0]].marker,
				b = myBoard[rowToCheck[1]].marker,
				c = myBoard[rowToCheck[2]].marker;
			//console.log('Checking ' + rowToCheck);

			//assuming checking a row with at least one marker
			if ( a === b && a === c ){
				if (a === cpuMarker){
					statusDOM.text('You lose!');
				} else {
					statusDOM.text('You win!');
				}
				//style winning markers
				for (var i=0; i<3; i++){
					$('#space-' + rowToCheck[i]).find('span').css({'color':'#ee6e73'});
				}

				currentPlayer = null;
			} else {
				//console.log('Not yet...');
			}
		},

		markSpace: function(marker, spaceID){
			console.log('Turn: ' + turnNumber + ' - Space: ' + spaceID + ' - ' + marker);
			turnNumber++;
			previousMove = spaceID;
			previousMoves.push(previousMove);
			myBoard[spaceID].marker = marker;
			$('#space-' + spaceID).find('span').text(marker);
			openSpaces.splice(openSpaces.indexOf(spaceID), 1);
			//console.log(openSpaces);
			//this.printCurrentBoard();

			//check for win
			var rowsToCheck = myBoard[spaceID].rows;
			for (var i=0, x=rowsToCheck.length; i<x; i++){
				this.checkRow(rowsToCheck[i]);
			}

			if (currentPlayer === 'player'){
				this.disableHover();
				currentPlayer = 'cpu';

				if (openSpaces.length === 0){
					statusDOM.text('NOBODY WINS');
					currentPlayer = null;
				} else {
					statusDOM.text('Thinking...');
					this.cpuTurn();
				}
			} else if (currentPlayer === 'cpu') {
				if (openSpaces.length === 0){
					statusDOM.text('NOBODY WINS');
					currentPlayer = null;
				} else {
					this.enableHover();
					currentPlayer = 'player';
					statusDOM.text('Your turn');
				}
			} else if (currentPlayer === null){
				//game over
				this.disableHover();
			}
		},

		//allow highlighting on hover for all open spaces
		enableHover: function(){
			var thisTicTacToe = this;

			for (var i=1; i<=9; i++){
				if (myBoard[i].marker === '-'){
					$('#space-' + i).addClass('space-hover');
				}
			}
		},

		disableHover: function(){
			for (var i=1; i<=9; i++){
				$('#space-' + i).removeClass('space-hover');
			}
		},

		getPlayerMarker: function(){
			return playerMarker;
		},

		isLegalMove: function(spaceID){
			return (openSpaces.indexOf(spaceID) !== -1) ? true : false;
		},

		canMove: function(){
			return currentPlayer === 'player';
		},

		printCurrentBoard: function(){
			var toPrint = '';
			for (var i=1; i<=9; i++){
				toPrint += myBoard[i].marker;
				if (i%3 === 0){
					toPrint += '\n';
				}
			}
			console.log(toPrint);
		},

		//'easy' or 'hard', 'X' or 'O', 'player' or 'cpu'
		newGame: function(newDifficulty, newPlayerMarker, newCPUMarker, first){
			myBoard = new Board();
			openSpaces = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			turnNumber = 1;
			previousMove = null;
			previousMoves = [];
			difficulty = newDifficulty;
			playerMarker = newPlayerMarker;
			cpuMarker = newCPUMarker;

			for (var i=1; i<=9; i++){
				$('#space-' + i).find('span').text('');
				$('#space-' + i).find('span').css({'color':'#e0f2f1'});
			}
			
			console.log('Starting new ' + difficulty + ' game.\nPlayer:' + playerMarker + ' CPU:' + cpuMarker + '\n' + first + ' goes first.');
			//this.printCurrentBoard();

			if (first === 'player'){
				this.enableHover();
				currentPlayer = 'player';
				statusDOM.text('Your turn');
			} else {
				this.disableHover();
				currentPlayer = 'cpu';
				statusDOM.text('Thinking...');
				this.cpuTurn();
			}
		}
	};
};

$(document).ready(function(){
	var myTicTacToe = new TicTacToe(),
		myPlayerMarker = 'X',
		myCPUMarker = 'O',
		nextPlayerMarker = 'X',
		nextCPUMarker = 'O',
		myDifficulty = 'easy';
	
	myTicTacToe.newGame(myDifficulty, myPlayerMarker, myCPUMarker, 'player');
			
	$('.container').on('click', function(){
		var id = $(this).data('id');
		if (myTicTacToe.canMove() && myTicTacToe.isLegalMove(id)){
			myTicTacToe.markSpace(myTicTacToe.getPlayerMarker(), id);
		}
	});

	$('.new-game-btn').on('click', function(){
		myTicTacToe.newGame(myDifficulty, nextPlayerMarker, nextCPUMarker, $(this).data('first'));
	});

	$('.marker-btn').on('click', function(){
		var currentPlayerMarker = $(this).text();
		if (currentPlayerMarker === 'X'){
			nextPlayerMarker = 'O';
			nextCPUMarker = 'X';
			$(this).text('O');
		} else {
			nextPlayerMarker = 'X';
			nextCPUMarker = 'O';
			$(this).text('X');
		}
	});

	$('.difficulty-btn').on('click', function(){
		if (myDifficulty === 'easy'){
			myDifficulty = 'hard';
			$(this).text('Hard');
		} else {
			myDifficulty = 'easy';
			$(this).text('Easy');
		}
	});
});