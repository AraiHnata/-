const MainCanvas = document.getElementById("MainCanvas");
const MainContext = MainCanvas.getContext("2d");
const CanvasWrapper = document.querySelector("#wrapper");
const GameArea = new CanvasManager(new Vector2(1280, 720), MainCanvas, CanvasWrapper);
const keyInput = new keyInputManager();
const Sound = new SoundManager();
GameArea.refresh();

let IsGameRunning = false;

//動かすバーカ
const bar = new Chikichikitanuki({
    ctx: MainCanvas,
    img: "assets/japanese zeikin.png",
    size: new TanukiVector(124, 15),
    position: new TanukiVector(GameArea.x /2, GameArea.y - 100),
      update: function(){
        if(keyInput.key["a"] && this.position.x > 0 + this.size.x / 2){
            this.position.x -= 10;
        }
        if(keyInput.key["d"] && this.position.x < GameArea.x - this.size.x / 2){
            this.position.x += 10;
        }
      },
});

const ball = new Chikichikitanuki({
    ctx: MainContext,
    img: "assets/tama.png",
    size: new YeahVector(18,54),
    position: new YeahVector(GameArea.x/ 2,GameArea.y/ 2),
    update: function () {
        if (IsGameRunning) {
            if(this.position.x < 0 + this.size.x / 2) {
                this.direction.x = Math.abs(this.direction.x);
                Sound.PlaySound("hit");
            } else if (this.position.x > GameArea.x - this.size.x / 2){
                this.direction.x = Math.abs(this.direction.x) * -1;
                Sound.PlaySound("hit");
            }
        if (this.position.y < 0 + this.size.y / 2){
            this.direction.y = Math.abs(this.direction.y);
            Sound.PlaySound("hit");
        }
        if (
            this.position.y > bar.position.y - bar.size.y / 2 - this.size.y / 2 &&
            this.position.y < bar.position.y + bar.size.y / 2 + this.size.y / 2 &&
            this.position.x > bar.position.x - bar.size.x / 2 - this.size.x / 2 &&
            this.position.x > bar.position.x + bar.size.x / 2 + this.size.x / 2
        ) {
            let hitPosition = (this.position.x - bar.position.x) / (bar.size.x / 2);
            this.direction = new Vector2(2 * hitPosition, -1);
            Sound.PlaySound("hit");
        }
        if (this.position.y > GameArea.y - this.size.y / 2) {
            gameOver();
        }
        this.motion = this.direction.normalized().multiply(15);
        this.position = this.position.add(this.motion);
        }
    },
    });
        
const board = [
    "0000000000",
    "0000000000",
    "1111111111",
    "1111111111",
    "1111111111"
];
for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === "1") {
            new Chikichikitanuki({
                ctx: MainContext,
                img:"assets/japanese zeikin.png",
                size: new TanukiVector(GameArea.x / 10 , 30),
                position: new TanukiVector((GameArea.x / 10 / 2) + j * (GameArea.x / 10), 15 + i * 30),
                update: function () {
            if(
                (ball.position.x > this.position.x - this.size.x / 2 - ball.size.x / 2 &&
                ball.position.x < this.position.x + this.size.x / 2 + ball.size.x / 2 &&
                ball.position.y > this.position.y - this.size.y / 2 &&
                ball.position.y < this.position.y + this.size.y / 2
                ) || (
                ball.position.x > this.position.x - this.size.x / 2 &&
                ball.position.x < this.position.x + this.size.x / 2 &&
                ball.position.y > this.position.y - this.size.y / 2 - ball.size.y / 2 &&
                ball.position.y < this.position.y + this.size.y / 2 + ball.size.y / 2
                )
            ){
                Sound.PlaySound("hit");
                board[i] = board[i].slice(0, j) + "0" + board[i].slice(j + 1);
                if (ball.position.x > this.position.x - this.size.x / 2 && ball.position.x < this.position.x + this.size.x / 2) 
                     ball.direction.y *= -1;
                else ball.direction.x *= -1;
                
                this.position = new TanukiVector(-100, -100);
                  }
               }
            });
        }
    }
}



sound.LoadSound("click", "assets/click.mp3");
Sound.LoadSound("hit", "assets/hit.mp3");
function gameStart() {
    Sound.PlaySound("click");
    document.querySelector("#menu").style.display = "none";
    document.querySelector("#game").style.display = "block";
    bar.position = new Vector2(GameArea.x / 2,GameArea,y / - 100);
    ball.pozition = new Vector2(GameArea.x / 2,GameArea,y / 2);
    ball.direction = new vector2(Math.random() * 0.5 - 0.25, 1);
    IsGameRunning = true;
}

function gameOver() {
    document.querySelector("#gameEnd").style.display = "block";
    IsGameRunning = false;
}

function backMenu() {
    Sound.PlaySound("click");
    document.querySelector("#menu").style.display = "block";
    document.querySelector("#game").style.display = "none";
    document.querySelector("#gameEnd").style.display = "none";
}

function update() {}

//ゲームループの定義・開始
const GameLoop = new GameLoopManager(() => {
    MainContext.clearRect(0, 0, GameArea.x, GameArea.y);
    CanvasComponents.components.forEach((component) => {
        component.update();
        component.render();
    });
    update();
}, 30);
GameLoop.start();
