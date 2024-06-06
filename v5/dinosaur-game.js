$(document).ready(function () {
    let gameRunning = false;
    let gameSpeed = 4;
    let score = 0;
    let dino = $('#dino');
    let jumpInProgress = false;
    let obstacleInterval;
    let pause = false;

    function openKeybindsMenu() {
        $('#keybinds-menu').removeClass('hidden');
    }

    function closeKeybindsMenu() {
        $('#keybinds-menu').addClass('hidden');
    }

    function startGame() {
        gameRunning = true;
        $('#start-button').hide();
        $('#game-canvas').removeClass('hidden');
        $('#menu').addClass('hidden');
        $('#score').removeClass('hidden');
        $('#score').text('Score: ' + score);

        obstacleInterval = setInterval(function () {
            if (gameRunning && !pause && $('.obstacle').length === 0) {
                createObstacle();
                score++;
                $('#score').text('Score: ' + score);

                if (score % 10 === 0) {
                    gameSpeed++;
                }
            }
        }, 1000);

        $('#jump-button').on('click', function () {
            if (!jumpInProgress && gameRunning && !pause) {
                jump();
            }
        });

        $(document).on('keydown', function (e) {
            if (e.keyCode === 32 && !jumpInProgress && gameRunning && !pause) {
                jump();
            } else if (e.keyCode === 80 && gameRunning) {
                pauseGame();
            }
        });

        $(window).off('blur');
    }

    
    
    function jump() {
        let jumpHeight = 250; 
        let jumpTime = 1200; 
        let initialLeft = dino.position().left;
        let targetLeft = Math.max(initialLeft - 20, 0); 
    
        jumpInProgress = true;
        
        dino.animate({ bottom: "+=" + jumpHeight + "px" }, jumpTime / 2, function () {
            dino.animate({ bottom: "0px" }, jumpTime / 2, function () {
                dino.animate({ left: targetLeft }, jumpTime / 2, function () {
                    jumpInProgress = false;
                });
            });
        });
    }
    
    

    function createObstacle() {
        let obstacle = $('<div class="obstacle"></div>').appendTo('#game-canvas');
        let obstaclePosition = $('#game-canvas').width();
        let obstacleHeight = 80; // Fixed glaub ich
        obstacle.css({ 'left': obstaclePosition, 'height': obstacleHeight });

        let obstacleMovement = setInterval(function () {
            if (gameRunning && !pause) {
                obstaclePosition -= gameSpeed;
                obstacle.css('left', obstaclePosition);

                if (checkCollision(obstacle)) {
                    endGame();
                }

                if (obstaclePosition < -250) {
                    obstacle.remove();
                    clearInterval(obstacleMovement);
                }
            }
        }, 20);
    }

    function checkCollision(obstacle) {
        let dinoTop = dino.position().top;
        let dinoBottom = dinoTop + dino.height();
        let obstacleLeft = obstacle.position().left;
        let obstacleTop = obstacle.position().top;
        let obstacleBottom = obstacleTop + obstacle.height();

        return (
            obstacleLeft < 40 &&
            obstacleLeft > 0 &&
            dinoBottom > obstacleTop &&
            dinoTop < obstacleBottom
        );
    }

    function endGame() {
        gameRunning = false;
        alert('Game Over! Your score: ' + score);
        score = 0;
        $('.obstacle').remove();
        openMenu();
    }

    function openMenu() {
        gameRunning = false;
        $('#start-button').show();
        $('#game-canvas').addClass('hidden');
        $('#menu').removeClass('hidden');
        $('#score').addClass('hidden');
    }

    function pauseGame() {
        pause = !pause;

        if (pause) {
            clearInterval(obstacleInterval);
        } else {
            startGame();
        }
    }

    $('#start-button').on('click', startGame);
    $('#settings-button').on('click', openMenu);
    $('#close-menu-button').on('click', function () {
        $('#menu').addClass('hidden');
    });
    $('#speed-slider').on('input', function () {
        gameSpeed = $('#speed-slider').val();
    });
    $('#theme-toggle').on('click', function () {
        $('body').toggleClass('dark-theme');
    });

    $('#keybinds-button').on('click', openKeybindsMenu);
    $('#close-keybinds-button').on('click', closeKeybindsMenu);
});
