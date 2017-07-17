/**
 * @author Jatin Chauhan
 * @date 17 July 2017
 * @version 1.0
 */

angular.module("hiLowGame", [])
         
         .controller("MainController", function($scope,$http) {
				  
				  $scope.bootstrapGame = function(){
							$scope.dealer = {
									deck: '',
									draw: ''
								};
							$scope.game = {
								status: '',
								deckId: '',
								remaining: '',
								result: '',
								player: '',
								drawn: '',
							};
							$scope.deck = "https://deckofcardsapi.com/api/deck/new/shuffle/"
							
							$scope.card = null;
							$scope.shuffle = null;
							$scope.player = "blank.jpg"  
							$scope.start = true
							$scope.restart = false
							$scope.state = false
							$scope.isRemain = false
							$scope.result = ""
							$scope.choice = ""
							$scope.remain = ""
							$scope.game.status = "NEW"
							
							$scope.cards = [{'1': 0}, {'2': 1}, {'3': 2}, {'4': 3}, {'5': 4}, {'6': 5}, {'7': 6}, {'8': 7}, {'9': 8}, {'10': 9}, {'J': 10}, {'Q': 11}, {'K': 12}, {'A': 13}];
							
							$scope.messages = {
								start: 'Please choose lower or higher!',
								remaining: 'You have ' + $scope.game.remaining + ' cards remaining!',
								lower: 'You chose Lower!',
								higher: 'You chose Higher!',
								win: 'You have won!',
								correct: 'You are correct!',
								incorrect: 'You are incorrect, please start again!',
							};
				  
				    }
					
					$scope.bootstrapGame(); //initializibg game
					
					$scope.startGame = function(){
							$scope.shuffle = "https://deckofcardsapi.com/api/deck/" + $scope.game.deckId + "/shuffle/";
				  
							$scope.dealer.deck === '' ? $scope.handleData($scope.deck) : $scope.handleData($scope.shuffle);
							$scope.start = false
							$scope.state = true
							$scope.restart = true
					
					}
					
					$scope.handleData = function(stateUrl) {
									var promise = $http.get(stateUrl);
										promise.then(
											function(payload) {
												$scope.game.deckId = payload.data.deck_id
												if ($scope.dealer.deck === '') {
													$scope.dealer.deck = payload.data;
												}else{
													$scope.dealer.draw = payload.data;
												}
													$scope.handleStatus();
												
										});
					}
					
					
					$scope.handleStatus = function () {
						   //console.log($scope.dealer)
						   $scope.card = "https://deckofcardsapi.com/api/deck/" + $scope.game.deckId + "/draw/?count=1";
							switch ($scope.game.status) {
								case "NEW":
									$scope.game.status = 'STARTED';
									$scope.handleData($scope.card);
									break;
								case "STARTED":
									$scope.player = $scope.dealer.draw.cards[0].image
									$scope.choice = $scope.messages.start
									//$scope.predictCard();
									break;
								case "CORRECT":
									//$scope.predictCard();
									break;
								case "SELECTED":
									$scope.calculateResult();
									break;
								case "LOSE":
									//lose animation
									break;
								default:
									console.log('no status');
							}
					}
					
					$scope.calculateResult = function () {
							$scope.player = $scope.dealer.draw.cards[0].image
							$scope.game.remaining = $scope.dealer.draw.remaining;
							$scope.isRemain = true  
							$scope.remain = 'You have ' + $scope.game.remaining + ' cards remaining!'
							
							if ($scope.game.remaining === 0) {
								$scope.game.status = 'WIN';
								$scope.result = $scope.messages.win
								 
							} else if ($scope.dealer.draw.cards[0].value >= $scope.game.drawn && $scope.game.player === 'higher' || $scope.dealer.draw.cards[0].value <= $scope.game.drawn && $scope.game.player === 'lower') {
								$scope.game.status = 'CORRECT';
								$scope.result = $scope.messages.correct
								//$scope.predictCard();
							} else {
								$scope.game.status = 'LOSE';
								$scope.result = $scope.messages.incorrect
								$scope.isRemain = false
								$scope.state = false
							}
					}
					
					$scope.predictCard = function (type) {
							$scope.game.status = 'SELECTED';
							$scope.choice = $scope.messages[type]
							$scope.game.drawn = $scope.dealer.draw.cards[0].value;
							$scope.game.player = type;
							$scope.handleData($scope.card);
       
					}
					
					$scope.restartGame = function(){
						$scope.bootstrapGame();
					}
				
	
         });