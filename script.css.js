let can = document.getElementById('can')
let con = can.getContext('2d');
//ブロック一つのサイズ（ピクセル）;
const BLOCK_SIZE = 30;

//落ちるスピード
let GAME_SPEED = 300;
//スピードの段階変化をさせたいが、今は分からない
// setInterval(speed(),2000)
//const level = [250,200,100];
// function speed(){
//     let num = Math.floor(Math.random()*level.length-1)+1;
//     }
// }


//フィールドサイズ
const FIELD_COL = 10;
const FIELD_ROW = 20;
//キャンバスサイズ
const SCREEN_W = BLOCK_SIZE * FIELD_COL;
const SCREEN_H = BLOCK_SIZE * FIELD_ROW;
can.style.border = '4px solid #555';
//テトロミノのサイズ
const tetro_size = 4;

can.width = SCREEN_W;
can.height = SCREEN_H;
const tetro_colors = [
    "#6CF",
    "#FA2",
    "#00F",
    "#C5C",
    "#FD2",
    "#F44",
    "#5B5",
]

const tetroTypes = [
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 1, 1],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]

];

const start_x = FIELD_COL / 2;
const start_y = 0;
//テトロミノ本体
let tetro;

//テトロミノの座標
let tetro_x = start_x;
let tetro_y = start_y;
//テトロミノの形
let tetro_t;

//フィールド本体
let field = [];
//ゲームオーバーフラグ
let over = false;

tetro_t = Math.floor(Math.random() * (tetroTypes.length));
tetro = tetroTypes[tetro_t]

//初期化の関数
function init() {
    for (let y = 0; y < FIELD_ROW; y++) {
        field[y] = [];
        for (let x = 0; x < FIELD_COL; x++) {
            field[y][x] = 0;
        }
    }
}

init();
drawField();
drawTetro();//テトロミノの表示

setInterval(dropTetro, GAME_SPEED);

//ブロック一つを描画
function drawBlock(x, y, c) {
    let px = x * BLOCK_SIZE;
    let py = y * BLOCK_SIZE;
//fillStyleは四角を作る、fillRectは四角の場所とサイズを決める
    con.fillStyle = tetro_colors[c];
    con.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
    con.strokeStyle = 'black';
    con.strokeRect(px, py, BLOCK_SIZE, BLOCK_SIZE);
}

function drawField() {
    con.clearRect(0, 0, SCREEN_W, SCREEN_H);
    for (let y = 0; y < FIELD_ROW; y++) {
        for (let x = 0; x < FIELD_COL; x++) {
            if (field[y][x]) {
                drawBlock(x, y, field[y][x]);
            }
        }
    }
    if (over) {
        let s = "GAME OVER";
        con.font = "40px 'MS ゴシック'";
        let w = con.measureText(s).width;
        let x = SCREEN_W / 2 - w / 2;
        let y = SCREEN_H / 2 - 20;
        con.lineWidth = 4;
        con.strokeText(s, x, y);
        con.fillStyle = 'white';
        con.fillText(s, x, y);

    }
}

function drawTetro() {

    for (let y = 0; y < tetro_size; y++) {
        for (let x = 0; x < tetro_size; x++) {
            if (tetro[y][x]) {
                drawBlock(tetro_x + x, tetro_y + y, tetro_t)
            }
        }
    }
    if (over) {
        let s = "GAME OVER";
        con.font = "40px 'MS ゴシック'";
        let w = con.measureText(s).width;
        let x = SCREEN_W / 2 - w / 2;
        let y = SCREEN_H / 2 - 20;
        con.lineWidth = 4;
        con.strokeText(s, x, y);
        con.fillStyle = 'white';
        con.fillText(s, x, y);

    }
}

//ブロックの当たり判定
function checkMove(mx, my, ntetro) {
    if (ntetro == undefined) ntetro = tetro;
    for (let y = 0; y < tetro_size; y++) {
        for (let x = 0; x < tetro_size; x++) {
            if (ntetro[y][x]) {
                let nx = tetro_x + mx + x;
                let ny = tetro_y + my + y;

                if (
                    ny < 0 ||
                    nx < 0 ||
                    ny >= FIELD_ROW ||
                    nx >= FIELD_COL ||
                    field[ny][nx]) {
                    return false;
                }
            }
        }
    }
    return true;
}

//テトロの回転
function rotate() {
    let ntetro = [];
    for (let y = 0; y < tetro_size; y++) {
        ntetro[y] = [];
        for (let x = 0; x < tetro_size; x++) {
            ntetro[y][x] = tetro[tetro_size - x - 1][y];
        }
    }
    return ntetro;
}

function fixTetro() {
    for (let y = 0; y < tetro_size; y++) {
        for (let x = 0; x < tetro_size; x++) {
            if (tetro[y][x]) {
                field[tetro_y + y][tetro_x + x] = tetro_t;
            }
        }
    }
}

//ラインがそろったかチェックして消す
function checkLine() {
    let linec = 0;
    for (let y = 0; y < FIELD_ROW; y++) {
        let flag = true;
        for (let x = 0; x < FIELD_COL; x++) {
            if (!field[y][x]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            linec++;
            GAME_SPEED *= 1.1;

            for (let ny = y; ny > 0; ny--) {
                for (let nx = 0; nx < FIELD_COL; nx++) {
                    field[ny][nx] = field[ny - 1][nx];
                }
            }
        }
    }

}

function dropTetro() {
    if (over) return;

    if (checkMove(0, 1)) tetro_y++;
    else {
        fixTetro();
        checkLine();

        tetro_t = Math.floor(Math.random() * (tetroTypes.length))
        tetro = tetroTypes[tetro_t];
        tetro_x = start_x;
        tetro_y = start_y;
        if (!checkMove(0, 0)) {
            over = true;
        }
    }
    drawField();
    drawTetro();
}

document.addEventListener('keydown', function (e) {
    if (over) return;

    switch (e.code) {
        case 'ArrowUp':
            if (checkMove(0, -1)) tetro_y--;
            break;
        case 'ArrowDown':
            if (checkMove(0, 1)) tetro_y++;
            break;
        case 'ArrowRight':
            if (checkMove(1, 0)) tetro_x++;
            break;
        case 'ArrowLeft':
            if (checkMove(-1, 0)) tetro_x--;
            break;
        case'Space':
            let ntetro = rotate();
            if (checkMove(0, 0, ntetro)) tetro = ntetro;
            break;

    }
    drawField()
    drawTetro();
});