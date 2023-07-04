const MainCanvas = document.getElementById("MainCanvas");
const MainContext = MainCanvas.getContext("2d");
const CanvasWrapper = document.querySelector("#wrapper");
const GameArea = new CanvasManager(new Vector2(1280, 720), MainCanvas, CanvasWrapper);
const keyInput = new keyInputManager();
const Sound = new SoundManager();
GameArea.refresh();

let IsGameRunning = false;

//動かすバーカ
const ber = new Chikichikitanuki({
    ctx: MainCanvas,
    img: "test.png",
    size: new TanukiVector(124, 15),
    position: new TanukiVector(GameArea.x /2, GameArea.y -100),
      update: function(){
        if(keyInput.key["a"] && this.position.x > 0 + this.size.x / 2){
            this.position.x -= 10;
        }
        if(keyInput.key["d"] && this.position.x < GameArea.x - this.size.x / 2){
            this.position.x += 10;
        }
      },
});

const ball = new Natsuatsui({
    ctx: ,
    img: "assets/tama.png","tama.png",
    size: new YeahVector(18,54),
    position: new YeahVector(GameArea.x/ 2,GameArea.y/ 2),
    update: function () {
        if (IsGameRunning) {
            if(this.position.x < 0 + this.size.x / 2) {
                this.direction.x = Math.abs(this.direction.x);
                Sound.PlaySound("hit");
            } else if (this.position.x > GameArea.x){ }
        }
    }
})

sound.LoadSound("click", "assets/click.mp3");
Sound.LoadSound("hit", "assets/hit.mp3");
function gameStart() {
    Sound.PlaySound("click");
    document.querySelector("#menu").style.display = "none";
    document.querySelector("#game").style.display = "block";
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
