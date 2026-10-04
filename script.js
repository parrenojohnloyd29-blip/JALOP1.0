const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");


// ========================================
// NO BUTTON SETTINGS
// ========================================

let noX = 0;
let noY = 0;

let velocityX = 0;
let velocityY = 0;

let targetX = 0;
let targetY = 0;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let isRunning = false;


// How close the cursor can get
const AVOID_DISTANCE = 150;

// How strongly the button moves away
const ESCAPE_FORCE = 5;

// Maximum movement speed
const MAX_SPEED = 12;

// Smoothness
const FRICTION = 0.88;


// ========================================
// GET BUTTON POSITION
// ========================================

function updateButtonPosition() {

  const rect = noBtn.getBoundingClientRect();

  noX = rect.left;
  noY = rect.top;

}


// ========================================
// MOUSE TRACKING
// ========================================

document.addEventListener("mousemove", (event) => {

  mouseX = event.clientX;
  mouseY = event.clientY;

});


// ========================================
// TOUCH TRACKING
// ========================================

document.addEventListener("touchmove", (event) => {

  if (event.touches.length > 0) {

    mouseX = event.touches[0].clientX;
    mouseY = event.touches[0].clientY;

  }

}, {
  passive: true
});


// ========================================
// START POSITION
// ========================================

window.addEventListener("load", () => {

  updateButtonPosition();

});


// ========================================
// SMOOTH ESCAPE
// ========================================

function moveAwayFromCursor() {

  const rect = noBtn.getBoundingClientRect();

  const buttonCenterX =
    rect.left + rect.width / 2;

  const buttonCenterY =
    rect.top + rect.height / 2;


  // Distance between cursor and button
  const dx = buttonCenterX - mouseX;
  const dy = buttonCenterY - mouseY;

  const distance =
    Math.sqrt(dx * dx + dy * dy);


  // ========================================
  // CURSOR IS CLOSE
  // ========================================

  if (distance < AVOID_DISTANCE) {

    isRunning = true;


    // Normalize direction
    let directionX = dx / distance;
    let directionY = dy / distance;


    // Prevent NaN when cursor is exactly
    // in the center of the button

    if (!isFinite(directionX)) {
      directionX = Math.random() > 0.5 ? 1 : -1;
    }

    if (!isFinite(directionY)) {
      directionY = Math.random() > 0.5 ? 1 : -1;
    }


    // Stronger escape when cursor is closer
    const strength =
      (AVOID_DISTANCE - distance) /
      AVOID_DISTANCE;


    velocityX +=
      directionX *
      ESCAPE_FORCE *
      strength;


    velocityY +=
      directionY *
      ESCAPE_FORCE *
      strength;

  }


  // ========================================
  // ADD FRICTION
  // ========================================

  velocityX *= FRICTION;
  velocityY *= FRICTION;


  // ========================================
  // LIMIT SPEED
  // ========================================

  const speed =
    Math.sqrt(
      velocityX * velocityX +
      velocityY * velocityY
    );


  if (speed > MAX_SPEED) {

    velocityX =
      (velocityX / speed) *
      MAX_SPEED;

    velocityY =
      (velocityY / speed) *
      MAX_SPEED;

  }


  // ========================================
  // MOVE BUTTON
  // ========================================

  if (isRunning) {

    targetX += velocityX;
    targetY += velocityY;

  }


  // ========================================
  // KEEP BUTTON INSIDE SCREEN
  // ========================================

  const padding = 10;

  const maxX =
    window.innerWidth -
    rect.width -
    padding;

  const maxY =
    window.innerHeight -
    rect.height -
    padding;


  if (targetX < padding) {

    targetX = padding;

    velocityX = Math.abs(velocityX);

  }


  if (targetX > maxX) {

    targetX = maxX;

    velocityX = -Math.abs(velocityX);

  }


  if (targetY < padding) {

    targetY = padding;

    velocityY = Math.abs(velocityY);

  }


  if (targetY > maxY) {

    targetY = maxY;

    velocityY = -Math.abs(velocityY);

  }


  // ========================================
  // SMOOTH TRANSFORM
  // ========================================

  noBtn.style.transform =
    `translate3d(${targetX}px, ${targetY}px, 0)`;


  requestAnimationFrame(moveAwayFromCursor);

}


// ========================================
// START ANIMATION
// ========================================

requestAnimationFrame(moveAwayFromCursor);


// ========================================
// NO BUTTON HOVER
// ========================================

noBtn.addEventListener("mouseenter", () => {

  // Give it an initial push
  velocityX +=
    mouseX < window.innerWidth / 2
      ? 8
      : -8;

  velocityY +=
    mouseY < window.innerHeight / 2
      ? 8
      : -8;

  isRunning = true;

});


// ========================================
// MOBILE TOUCH
// ========================================

noBtn.addEventListener("touchstart", (event) => {

  event.preventDefault();

  // Immediately push the button away
  velocityX =
    Math.random() > 0.5
      ? 10
      : -10;

  velocityY =
    Math.random() > 0.5
      ? 10
      : -10;

  isRunning = true;

}, {
  passive: false
});


// ========================================
// IF USER SOMEHOW CLICKS NO
// ========================================

noBtn.addEventListener("click", (event) => {

  event.preventDefault();

  velocityX =
    Math.random() > 0.5
      ? 12
      : -12;

  velocityY =
    Math.random() > 0.5
      ? 12
      : -12;

  isRunning = true;

});


// ========================================
// YES BUTTON
// ========================================

yesBtn.addEventListener("click", () => {

  // Show funny message
  message.style.display = "block";

  // Hide buttons
  yesBtn.style.display = "none";
  noBtn.style.display = "none";

});
