window.onload = function () {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  const characterWidth = 100;
  const characterHeight = 100;
  let xPosition = canvasWidth / 2 - characterWidth / 2;
  let yPosition = canvasHeight / 2 - characterHeight / 2;

  let coinXPosition = Math.round(Math.random() * (canvasWidth - 50));
  let coinYPosition = Math.round(Math.random() * (canvasHeight - 50));

  let score = 0;
  let direction = 0;

  const keyMap = {
    ArrowDown: 1,
    ArrowUp: 2,
    ArrowRight: 3,
    ArrowLeft: 4,
    ArrowUpRight: 5,
    ArrowUpLeft: 6,
    ArrowDownRight: 7,
    ArrowDownLeft: 8,
  };

  const pressedKeys = {};

  document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (keyMap.hasOwnProperty(key)) {
      pressedKeys[keyMap[key]] = true;
      if (pressedKeys[2] && pressedKeys[3]) {
        direction = keyMap["ArrowUpRight"];
      } else if (pressedKeys[2] && pressedKeys[4]) {
        direction = keyMap["ArrowUpLeft"];
      } else if (pressedKeys[1] && pressedKeys[3]) {
        direction = keyMap["ArrowDownRight"];
      } else if (pressedKeys[1] && pressedKeys[4]) {
        direction = keyMap["ArrowDownLeft"];
      } else {
        direction = keyMap[key];
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    const key = event.key;
    if (keyMap.hasOwnProperty(key)) {
      pressedKeys[keyMap[key]] = false;
      if (pressedKeys[2] && pressedKeys[3]) {
        direction = keyMap["ArrowUpRight"];
      } else if (pressedKeys[2] && pressedKeys[4]) {
        direction = keyMap["ArrowUpLeft"];
      } else if (pressedKeys[1] && pressedKeys[3]) {
        direction = keyMap["ArrowDownRight"];
      } else if (pressedKeys[1] && pressedKeys[4]) {
        direction = keyMap["ArrowDownLeft"];
      } else if (pressedKeys[2]) {
        direction = keyMap["ArrowUp"];
      } else if (pressedKeys[3]) {
        direction = keyMap["ArrowRight"];
      } else if (pressedKeys[1]) {
        direction = keyMap["ArrowDown"];
      } else if (pressedKeys[4]) {
        direction = keyMap["ArrowLeft"];
      } else {
        direction = 0;
      }
    }
  });

  function draw() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw character
    context.beginPath();
    context.rect(xPosition, yPosition, characterWidth, characterHeight);
    context.fillStyle = "#005000";
    context.fill();

    // Draw coins
    context.beginPath();
    context.ellipse(
      coinXPosition + 20,
      coinYPosition + 20,
      20,
      15,
      (90 * Math.PI) / 180.0,
      0,
      2 * Math.PI
    );
    context.fillStyle = "#E4D00A";
    context.fill();

    const speed = (500 * (Date.now() - draw.lastTime)) / 1000;
    draw.lastTime = Date.now();

    const movements = [
      [0, 1, speed], // down
      [0, -1, speed], // up
      [1, 0, speed], // right
      [-1, 0, speed], // left
      [1, -1, speed / 1.2], // up-right
      [-1, -1, speed / 1.2], // up-left
      [1, 1, speed / 1.2], // down-right
      [-1, 1, speed / 1.2], // down-left
    ];

    if (direction) {
      const [dx, dy, s] = movements[direction - 1];
      xPosition = Math.min(
        Math.max(xPosition + dx * s, 0),
        canvasWidth - characterWidth
      );
      yPosition = Math.min(
        Math.max(yPosition + dy * s, 0),
        canvasHeight - characterHeight
      );
    }

    // Collision detection
    if (
      coinXPosition < xPosition + characterWidth &&
      coinXPosition + 40 > xPosition &&
      coinYPosition < yPosition + characterHeight &&
      coinYPosition + 40 > yPosition
    ) {
      coinXPosition = Math.round(Math.random() * (canvasWidth - 50));
      coinYPosition = Math.round(Math.random() * (canvasHeight - 50));
      score++;
    }

    // Draw Score
    context.font = "30px Arial";
    context.fillStyle = "black";
    context.fillText(`Score: ${score}`, 20, 30);

    requestAnimationFrame(draw);
  }

  draw.lastTime = Date.now();
  requestAnimationFrame(draw);






  
  // Add the joystick control
  const joystickContainer = document.getElementById("joystick-container");
  const joystickHandle = document.getElementById("joystick-handle");

  let joystickPressed = false;
  let joystickX = 0;
  let joystickY = 0;

  // Event listeners for touch events
  joystickContainer.addEventListener("touchstart", (e) => {
    joystickPressed = true;
    e.preventDefault();
  });

  joystickContainer.addEventListener("touchmove", (e) => {
    if (joystickPressed) {
      const rect = joystickContainer.getBoundingClientRect();
      joystickX = e.touches[0].clientX - rect.left;
      joystickY = e.touches[0].clientY - rect.top;
    }
  });

  joystickContainer.addEventListener("touchend", () => {
    joystickPressed = false;
    joystickX = 0;
    joystickY = 0;
  });

  // Update character position based on joystick movement
  function updateCharacterPosition() {
    if (joystickPressed) {
      const angle = Math.atan2(joystickY - 50, joystickX - 50);
      const speed = 10; // Adjust the speed as needed
      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      xPosition = Math.min(
        Math.max(xPosition + dx, 0),
        canvasWidth - characterWidth
      );
      yPosition = Math.min(
        Math.max(yPosition + dy, 0),
        canvasHeight - characterHeight
      );
    }

    // Call this function repeatedly to update character position
    requestAnimationFrame(updateCharacterPosition);
  }

  // Start updating character position
  updateCharacterPosition();
};
