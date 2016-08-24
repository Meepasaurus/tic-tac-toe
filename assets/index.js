'use strict';

var TicTacToe = function(){

	var statusDOM = $('#status'),
		playerMarker = '',
		cpuMarker = '',
		difficulty = '',
		currentPlayer = null,
		openSpaces = [1, 2, 3, 4, 5, 6, 7, 8, 9],
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

		cpuTurn: function(){
			var space = openSpaces[Math.floor(Math.random() * openSpaces.length)];
			this.markSpace(cpuMarker, space);
		},

		checkRow: function(row){
			var rowToCheck = rows[row],
				a = myBoard[rowToCheck[0]].marker,
				b = myBoard[rowToCheck[1]].marker,
				c = myBoard[rowToCheck[2]].marker;
			console.log('Checking ' + rowToCheck);

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
				console.log('Not yet...');
			}
		},

		markSpace: function(marker, spaceID){
			console.log('> Marking space ' + spaceID + ' with ' + marker);
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
					statusDOM.text('NOBODY WINS.');
					currentPlayer = null;
				} else {
					statusDOM.text('Thinking...');
					this.cpuTurn();
				}
			} else if (currentPlayer === 'cpu') {
				if (openSpaces.length === 0){
					statusDOM.text('NOBODY WINS.');
					currentPlayer = null;
				} else {
					this.enableHover();
					currentPlayer = 'player';
					statusDOM.text('Your turn.');
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
			for (var i=1; i<=9; i++){
				$('#space-' + i).find('span').text('');
				$('#space-' + i).find('span').css({'color':'#e0f2f1'});
			}

			difficulty = newDifficulty;
			playerMarker = newPlayerMarker;
			cpuMarker = newCPUMarker;
			console.log('Starting new ' + difficulty + ' game.\nPlayer:' + playerMarker + ' CPU:' + cpuMarker + '\n' + first + ' goes first.');
			//this.printCurrentBoard();

			if (first === 'player'){
				this.enableHover();
				currentPlayer = 'player';
				statusDOM.text('Your turn.');
			} else {
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
		nextCPUMarker = 'O';
	
	myTicTacToe.newGame('easy', myPlayerMarker, myCPUMarker, 'player');
			
	$('.container').on('click', function(){
		var id = $(this).data('id');
		if (myTicTacToe.canMove() && myTicTacToe.isLegalMove(id)){
			myTicTacToe.markSpace(myTicTacToe.getPlayerMarker(), id);
		}
	});

	$('.new-game-btn').on('click', function(){
		myTicTacToe.newGame('easy', nextPlayerMarker, nextCPUMarker, $(this).data('first'));
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
});