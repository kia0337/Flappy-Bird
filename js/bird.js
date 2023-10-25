const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Загрузка спрайта
const sprite = new Image();
sprite.src = "../img/sprite.png";

class Bird {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.vy = 0;
    this.width = 34;
    this.height = 26;
  }

  // Обновление позиции птицы
  update() {
    this.vy += 0.1;
    this.y += this.vy;
  }

  draw() {
    ctx.drawImage(
      sprite,
      276,
      112,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  // Движение птицы при нажатии на пробел
  flap() {
    this.vy -= 2;
  }
}

class Pipe {
  constructor() {
    this.gapY = 100; // 25% от длинны трубы
    this.gapX = this.width;
    this.topX = canvas.width;
    this.topY = Math.random() * (canvas.height - this.gapY - foreground.height);
    this.bottomX = canvas.width;
    this.bottomY = this.topY + this.gapY;

    this.width = 56;
    this.height = 400;
    this.speed = 2;
  }

  draw() {
    ctx.drawImage(
      sprite,
      555,
      0,
      this.width,
      this.height,
      this.topX,
      this.topY,
      this.width,
      -this.height
    );
    // console.log("верхняя труба", this.topX, this.topY, this.width, this.height);
    ctx.drawImage(
      sprite,
      500,
      0,
      this.width,
      this.height,
      this.bottomX,
      this.bottomY,
      this.width,
      this.height
    );
    // console.log(
    //   "нижняя труба",
    //   this.bottomX,
    //   this.bottomY,
    //   this.width,
    //   canvas.height - this.topY - foreground.height
    // );
  }

  update() {
    // Обновление позиции трубы
    this.topX -= this.speed;
    this.bottomX -= this.speed;

    //Проверка столкновения птицы с трубой
    if (
      (bird.x + bird.width === this.topX && bird.y <= this.topY) ||
      (bird.x + bird.width === this.bottomX &&
        bird.y + bird.height >= this.bottomY) ||
      (bird.y <= this.topY &&
        bird.x <= this.topX + this.width &&
        bird.x + bird.width >= this.topX) ||
      (bird.y + bird.height >= this.bottomY &&
        bird.x <= this.topX + this.width &&
        bird.x + bird.width >= this.topX)
    ) {
      endGame();
      return;
    }
    // Подсчет баллов при преодолении трубы
    if (bird.x == this.topX + this.width) {
      score++;
    }

    // Удаление трубы, когда она выходит за пределы экрана
    if (this.x + this.width < 0) {
      pipes.shift();
    }
  }
}

// Фон
class Background {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.width = 275;
    this.height = 226;
  }

  draw() {
    ctx.drawImage(
      sprite,
      0,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      canvas.width,
      canvas.height
    );

    ctx.drawImage(
      sprite,
      0,
      0,
      this.width,
      this.height,
      this.x + canvas.width,
      this.y,
      canvas.width,
      canvas.height
    );
  }
  newPosition() {
    this.x -= 2;

    if (this.x < -canvas.width) {
      this.x = 0;
    }
  }
}
class Foreground {
  constructor() {
    this.x = 0;
    this.y = canvas.height - 112;
    this.width = 224;
    this.height = 112;
  }

  draw() {
    ctx.drawImage(
      sprite,
      276,
      0,
      this.width,
      this.height,
      this.x,
      this.y,
      canvas.width,
      this.height
    );

    ctx.drawImage(
      sprite,
      276,
      0,
      this.width,
      this.height,
      this.x + canvas.width,
      this.y,
      canvas.width,
      this.height
    );
  }
  newPosition() {
    this.x -= 2;

    if (this.x < -canvas.width) {
      this.x = 0;
    }
  }
}

let foreground = new Foreground();
let background = new Background();
let bird = new Bird();
let pipe = new Pipe();
let pipes = [];
let score;
let frame;
let gameOver;
let bestScore;

function startGame() {
  pipes = [];
  score = 0;
  frame = 0;
  let gameOver = false;
  bestScore = localStorage.getItem("bestScore") || 0;

  // Создание новых труб
  setInterval(() => {
    if (!gameOver) {
      pipes.push(new Pipe());
    }
  }, 2500);

  draw();
}

// Отрисовка
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  background.draw();
  background.newPosition();
  foreground.draw();
  foreground.newPosition();
  bird.update();
  bird.draw();

  pipes.forEach((pipe) => {
    pipe.draw();
    pipe.update();
  });

  // Отрисовка текущего количества баллов и лучшего результата
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 50);
  ctx.fillText(`Best Score: ${bestScore}`, 10, 80);

  // Проверка столкновения птицы с землей и потолком
  if (bird.y + bird.height >= canvas.height - foreground.height) {
    endGame();
  }
  if (bird.y <= 0) {
    bird.y = 0;
  }

  frame++;

  if (!gameOver) {
    requestAnimationFrame(draw);
  }
}

// Завершение игры и сохранение лучшего результата
function endGame() {
  gameOver = true;
  ctx.drawImage(
    sprite,
    175,
    228,
    225,
    40,
    canvas.width / 2 - 225 / 2,
    90,
    225,
    90
  );
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  clearInterval();
}

// Обработчик нажатия на пробел для движения птицы
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    bird.flap();
  }
});

startGame();
