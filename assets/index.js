'use strict';

var TicTacToe = function(){

	var playerMarker = '',
		cpuMarker = '',
		difficulty = '',
		turnNumber = 0,
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

		checkRow: function(row){
			var rowToCheck = rows[row],
				a = myBoard[rowToCheck[0]].marker,
				b = myBoard[rowToCheck[1]].marker,
				c = myBoard[rowToCheck[2]].marker;
			console.log('Checking ' + rowToCheck);

			//assuming checking a row with at least one marker
			if ( a === b && a === c ){
				console.log(a + 'won!');
			} else {
				console.log('Not yet...');
			}
		},

		markSpace: function(spaceID, marker){
			console.log('Marking space ' + spaceID + ' with ' + marker);
			myBoard[spaceID].marker = marker;

			var rowsToCheck = myBoard[spaceID].rows;
			for (var i=0, x=rowsToCheck.length; i<x; i++){
				this.checkRow(rowsToCheck[i]);
			}
		},

		//allow highlighting on hover for all open spaces
		enableHover: function(){
			for (var i=1; i<=9; i++){
				if (myBoard[i].marker !== '_'){
					$('#space-' + i).addClass('space-hover');
				}
			}
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
			difficulty = newDifficulty;
			playerMarker = newPlayerMarker;
			cpuMarker = newCPUMarker;
			console.log('Starting new ' + difficulty + ' game.\nPlayer:' + playerMarker + ' CPU:' + cpuMarker + '\n' + first + ' goes first.');
			this.printCurrentBoard();

			if (first === 'player'){
				this.enableHover();
			}
		}
	};
};

$(document).ready(function(){
	var myTicTacToe = new TicTacToe();
	myTicTacToe.newGame('easy', 'X', 'O', 'player');
});