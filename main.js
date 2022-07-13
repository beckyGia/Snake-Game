//Declare global variables to track game board size
const LINE_PIXEL_COUNT = 40;
const TOTAL_PIXEL_COUNT = LINE_PIXEL_COUNT ** 2;

//Track scores to display to user
let totalFoodEaten = 0;
let totalDistanceTraveled = 0;

//Shorten reference to game board
const gameContainter = document.getElementById("gameContainer");

//Generate the game board
const createGameBoardPixels = () => {
  for (let i = 1; i <= TOTAL_PIXEL_COUNT; i++) {
    gameContainter.innerHTML = `${gameContainter.innerHTML} <div class="gameBoardPixel" id="pixel${i}"><div>`;
  }
};

//Shorten reference to game pixels
const gameBoardPixels = document.getElementsByClassName("gameBoardPixel");

let currentFoodPosition = 0;

//create the randomly generated foo items in the game board
const createFood = () => {
  //remove food off the board
  gameBoardPixels[currentFoodPosition].classList.remove("food");

  currentFoodPosition = Math.floor(Math.random() * TOTAL_PIXEL_COUNT);

  gameBoardPixels[currentFoodPosition].classList.add("food");
};

//Start setting up snake behavior
const LEFT_DIR = "ArrowLeft";
const UP_DIR = "ArrowUp";
const RIGHT_DIR = "ArrowRight";
const DOWN_DIR = "ArrowDown";

let snakeCurrentDirection = RIGHT_DIR;

//Make sure thta the user input is valid and change snake direction variable
const changeDirection = (newDirectionCode) => {
  if (newDirectionCode == snakeCurrentDirection) return;

  if (newDirectionCode == LEFT_DIR && snakeCurrentDirection !== RIGHT_DIR) {
    snakeCurrentDirection = newDirectionCode;
  } else if (newDirectionCode == UP_DIR && snakeCurrentDirection !== DOWN_DIR) {
    snakeCurrentDirection = newDirectionCode;
  } else if (
    newDirectionCode == RIGHT_DIR &&
    snakeCurrentDirection !== LEFT_DIR
  ) {
    snakeCurrentDirection = newDirectionCode;
  } else if (newDirectionCode == DOWN_DIR && snakeCurrentDirection !== UP_DIR) {
    snakeCurrentDirection = newDirectionCode;
  }
};

//set starting point snake on load
let currentHeadPosition = TOTAL_PIXEL_COUNT / 2;

//set initial length
let snakeLength = 200;

//Start moving snake, wrap around to other side of screen if needed
const moveSnake = () => {
  switch (snakeCurrentDirection) {
    case LEFT_DIR:
      //move the direction to left is like going one back
      --currentHeadPosition;
      //check to see if the snake is at the edge of the screen
      const isHeadAtLeft =
        currentHeadPosition % LINE_PIXEL_COUNT == LINE_PIXEL_COUNT - 1 ||
        currentHeadPosition < 0;
      if (isHeadAtLeft) {
        //if true (so at the edge), add the total pixel count(total pixel length) to the current position to move it all the way to right.
        currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT;
      }
      break;
    case RIGHT_DIR:
      ++currentHeadPosition;
      const isHeadAtRight = currentHeadPosition % LINE_PIXEL_COUNT == 0;
      if (isHeadAtRight) {
        currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT;
      }
      break;
    case UP_DIR:
      currentHeadPosition = currentHeadPosition - LINE_PIXEL_COUNT;
      const isHeadAtTop = currentHeadPosition < 0;
      if (isHeadAtTop) {
        //move the snake from the edge of the top to the bottom
        currentHeadPosition = currentHeadPosition + TOTAL_PIXEL_COUNT;
      }
      break;
    case DOWN_DIR:
      currentHeadPosition = currentHeadPosition + LINE_PIXEL_COUNT;
      const isHeadAtBottom = currentHeadPosition > TOTAL_PIXEL_COUNT - 1;
      if (isHeadAtBottom) {
        currentHeadPosition = currentHeadPosition - TOTAL_PIXEL_COUNT;
      }
      break;
    default:
      break;
  }

  //Accessed the correct pixel within the HTML collection
  let nextSnakeHeadPixel = gameBoardPixels[currentHeadPosition];

  //Check if snake head is about to intersect with its own body
  if (nextSnakeHeadPixel.classList.contains("snakeBodyPixel")) {
    clearInterval(moveSnakeInterval);
    alert(
      `You have eaten ${totalFoodEaten} food and traveled ${totalDistanceTraveled} blocks.`
    );

    //reloads the page
    window.location.reload();
  }

  //Assuming an empty pixel, add snake body styling
  nextSnakeHeadPixel.classList.add("snakeBodyPixel");

  //Remove snake styling to keep snake appropriate length
  setTimeout(() => {
    //essentially waiting a certain amount of time based on the snake length to remove the class of snakeBody from the end of our snake
    nextSnakeHeadPixel.classList.remove("snakeBodyPixel");
  }, snakeLength);

  //Describe what to do if the snake encounters a food pixel
  if (currentHeadPosition == currentFoodPosition) {
    //increasing the food count by one
    totalFoodEaten++;

    //changing the food count on the display
    document.getElementById("pointsEarned").innerText = totalFoodEaten;

    //simulating adding one pixel to the snakes length
    snakeLength = snakeLength + 100;

    //remove the existing food and create a new one on the screen
    createFood();
  }

  //Added distance traveled count
  totalDistanceTraveled++;
  document.getElementById("blocksTraveled").innerText = totalDistanceTraveled;
};

//Call initial functions to create board and start game
createGameBoardPixels();
createFood();

//Set animation speed
let moveSnakeInterval = setInterval(moveSnake, 100);

//Add event listener for keyboard
//e is the short var reference for event object which will be passed to event handlers.
addEventListener("keydown", (e) => changeDirection(e.key));

//The key property returns the identifier of the key that was pressed when a key event occured
//keyCode is deprecated

//Adding variables for on-scrren buttons
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");

//Add listeners for on-screen buttons
leftButton.onclick = () => changeDirection(LEFT_DIR);
rightButton.onclick = () => changeDirection(RIGHT_DIR);
upButton.onclick = () => changeDirection(UP_DIR);
downButton.onclick = () => changeDirection(DOWN_DIR);
