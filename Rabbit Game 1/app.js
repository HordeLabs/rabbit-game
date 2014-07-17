var myApp = angular.module("Game", ["firebase"]);

myApp.controller('ctrl', ['$scope', '$firebase', function($scope, $firebase){
	var mainRef = new Firebase("https://high-scores.firebaseio.com/Game1Scores");
	
    $scope.main = $firebase(mainRef)
    $scope.list = $firebase(mainRef.limit(5));


	var game = new Phaser.Game(400, 490, Phaser.AUTO, 'game_div');
	var audio = new Audio('imlate2.wav');
	var audio2 = new Audio('music.wav');
	var alive = false;
	$scope.playSound = false;
	$scope.increment = 0;
	$scope.chooser = 0;
	var last_score;

	// Creates a new 'main' state that wil contain the game
	var main_state = {

	    preload: function() 
	    {  
		    // Change the background color of the game
		    this.game.stage.backgroundColor = 'rgba(0,0,0,0)';

		    // Load the rabbit sprite
		    this.game.load.image('rabbit', 'rabbit.png');
		    this.game.load.image('pipe', 'heart.png'); 
		    this.game.load.image('pipe1', 'club.png'); 

		    // Laod background image
		    this.game.load.image('background', 'gamebg.jpg'); 

		    
		},

		create: function() 
			{  
				audio.pause();
				audio2.pause();
			    //Display the BG image
				this.bg = this.game.add.sprite(0, 0, 'background');

				// Display the rabbit on the screen
			    this.rabbit = this.game.add.sprite(100, 245, 'rabbit');


			    // Add gravity to the rabbit to make it fall
			    this.rabbit.body.gravity.y = 1000;  

			    // Call the 'jump' function when the up key is hit
			    var up_key = this.game.input.keyboard.addKey('38');
			    up_key.onDown.add(this.jump, this);

			    this.pipes = game.add.group();

			    for(i = 0; i < 10; i++)
			    {
			    	var coinFlip = Math.random();
			   		if(coinFlip < 0.5)
			   		{
			   			this.pipes.createMultiple(1, 'pipe');
			   		}
			    	else
			    	{
				   		this.pipes.createMultiple(1, 'pipe1');
			    	}
				}
				 

				this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);    

				this.score = -1;  
				var style = { font: "30px Arial", fill: "#ffffff" };  
				
				if($scope.playSound == true)
				{
					audio.play(); 
				
					audio2.loop = true;
					audio2.play(); 
				}
			},

		update: function() 
			{  
			    // If the rabbit is out of the world (too high or too low), call the 'restart_game' function
			    if (this.rabbit.inWorld == false)
			        this.restart_game();

			    this.game.physics.overlap(this.rabbit, this.pipes, this.restart_game, null, this); 
			   
			   	// move the BG back unless we nee to loop to the beginning
			    this.bg.x = (this.bg.x == -549) ? 0: this.bg.x - 1;

			   
			},

			// Make the rabbit jump 
		jump: function() 
			{  
			    // Add a vertical velocity to the rabbit
			    this.rabbit.body.velocity.y = -350;
			},

		// Restart the game
		restart_game: function() 
			{  
				if(alive){
					var name_input = $('#name_input').val();

					if(this.score != -1)
					{ 	
						var name = (name_input == "") ? "Player" : name_input;
						$scope.addScore(name, this.score);
				  	}
				  		
					this.game.time.events.remove(this.timer); 
				    // Start the 'main' state, which restarts the game
				    $('#menu').show();
				    alive = false;
			    }
			},

		add_one_pipe: function(x, y) 
			{  
			    // Get the first dead pipe of our group
			    var pipe = this.pipes.getFirstDead();

			    // Set the new position of the pipe
			    pipe.reset(x, y);

			    // Add velocity to the pipe to make it move left
			    pipe.body.velocity.x = -200; // -400 hard mode! 

			    // Kill the pipe when it's no longer visible 
			    pipe.outOfBoundsKill = true;

			    if(this.score >= 15 && this.score <= 19)
			    {
			    	pipe.body.velocity.x = -300;
			    }

			    if(this.score >= 20)
				{
					pipe.body.velocity.x = -400;
				} 
			},

		add_row_of_pipes: function() 
			{  
			    var hole = Math.floor(Math.random()*5)+1;

			    if(this.score > 25)
				{
					for (var i = 0; i < 4; i++)
			        if (i != hole && i != hole +1) 
			            this.add_one_pipe(400, i*Math.floor(Math.random()*200)+ 50); 
				} 
				else
				{
					for (var i = 0; i < 3; i++)
			        if (i != hole && i != hole +1) 
			            this.add_one_pipe(400, i*Math.floor(Math.random()*200)+ 50); 
				}

			    this.score += 1; 

				//update the score on the page
				document.getElementById('score').innerHTML = this.score;
			},
	}; 

	$scope.soundSettings = function()
	{
		$scope.chooser = ++$scope.increment % 2;
		$scope.playSound = $scope.chooser != 0;
		 if($scope.playSound == true)
				{
					audio.play(); 
				
					audio2.loop = true;
					audio2.play(); 
				}
				else{
					audio.pause();
					audio2.pause();
				}
	};

	// Add and start the 'main' state to start the game
	game.state.add('main', main_state);  

	$scope.play = function(){
		game.state.start('main');
		$('#menu').hide();
		alive = true;
	};
	

    $scope.addScore = function(name, score){
    	var toAdd = {
    		Scorer: name,
    		Score: score,
    		date_time: new Date().getTime()
    	}

    	$scope.main.$add(toAdd).then(function(p){
			$scope.main[p.name()].$priority = score;
			$scope.main.$save(p.name());
    	});
    	
    }
    
    $(document).keyup(function(e)
    	{
    		if(!alive && e.keyCode == 38) $scope.play();
    		if(!alive && e.keyCode == 13) $scope.play();
    	});
}]);
