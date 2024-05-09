// here I stored the canvas of html
const canvas = document.querySelector("canvas");
canvas.width = 1024;
canvas.height = 576;

// here we declare c for storing the canvas having 2d graphics
const c = canvas.getContext("2d");
// this will fill the c by default color black with 0 and 0 position and same width and height as canvas
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
// here we create a sprite class
class sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 100,
      height: 50,
      offset,
    };
    this.color = color;
    this.isAttacking = false;
    this.health = 100;
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, 50, this.height);
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  ubdate() {
    this.draw();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

// here we draw the player rectangle
const player = new sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },
  //   color: 'yellow'
});

// here we draw the enemy rectangle
const enemy = new sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: -50, y: 0 },
  color: "blue",
});
let lastKey;
const key = {
  // player controls
  d: {
    pressed: false,
  },
  a: {
    pressed: false,
  },

  //   enemy controls
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

// funtion use in colliding
function rectangularCollision({ rectange1, rectange2 }) {
  return (
    rectange1.attackBox.position.x + rectange1.attackBox.width >=
      rectange2.position.x &&
    rectange1.attackBox.position.x <= rectange2.position.x + rectange2.width &&
    rectange1.attackBox.position.y + rectange1.attackBox.height >=
      rectange2.position.y &&
    rectange1.attackBox.position.y <= rectange2.position.y + rectange2.height
  );
}
// determine winner function
function determineWinner({ player, enemy, timeID }) {
  clearTimeout(timeID);
  document.querySelector("#displayText").style.display = "flex";
  if (player.health == enemy.health) {
    document.querySelector("#displayText").innerHTML = "game draw";
  }
  if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 1 win the game";
  }
  if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Player 2 win the game";
  }
}

// timer changer
let timer = 60;
let timeID;
function dicreaseTimer() {
  if (timer > 0) {
    timeID = setTimeout(dicreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ enemy, player, timeID });
  }
}
dicreaseTimer();
// handling animation
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.ubdate();
  enemy.ubdate();

  //   player controling
  player.velocity.x = 0;
  if (key.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  } else if (key.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  }

  //   enemy controling
  enemy.velocity.x = 0;
  if (key.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  } else if (key.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  }

  //   checking for collision of attack
  if (
    rectangularCollision({
      rectange1: player,
      rectange2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    console.log("plaeyr");
  }
  if (
    rectangularCollision({
      rectange1: enemy,
      rectange2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = `${player.health}%`;
  }

  // ending game base on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ enemy, player, timeID });
  }
}
animate();

window.addEventListener("keydown", (event) => {
  // player controling
  switch (event.key) {
    case "d":
      key.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      key.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;
    default:
      break;
  }

  // enemy controling
  switch (event.key) {
    case "ArrowRight":
      key.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      key.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
    default:
      break;
  }
});
window.addEventListener("keyup", (event) => {
  // player controlling
  switch (event.key) {
    case "d":
      key.d.pressed = false;
      break;
    case "a":
      key.a.pressed = false;
      break;

    default:
      break;
  }

  // enemy controlling
  switch (event.key) {
    case "ArrowRight":
      key.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      key.ArrowLeft.pressed = false;
      break;

    default:
      break;
  }
});
