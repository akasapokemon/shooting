// グローバル
let screenCanvas, info;
let start = false; // ボタンでフラグをチェンジ
let run = true;
let fps = 1000 / 30;
let mouse = new Point();
let ctx;
let fire = false; // shotするのかしないのか
let counter = 0;
let score = 0;
let message = '';

// 定数
const CHARA_COLOR = 'rgba(0,0,255,0.75)';
const CHARA_SHOT_COLOR = 'rgba(0,255,0,0.75)';
const CHARA_SHOT_MAX_COUNT = 100; // 要思考
const ENEMY_COLOR = 'rgba(255, 0, 0, 0.75)';
const ENEMY_MAX_COUNT = 15;
const ENEMY_SHOT_COLOR = 'rgba(255,0,255,0.75)';
const ENEMY_SHOT_MAX_COUNT = 100;


// メインプログラム
window.onload = function() {

  let i,j;
  let p = new Point();

  // スクリーンの初期化
  screenCanvas = document.getElementById('screen');
  screenCanvas.width = 256 * 3;
  screenCanvas.height = 256 * 2;

  ctx = screenCanvas.getContext('2d');

  // let clientRect = document.getElementById('title');
  screenCanvas.addEventListener('mousemove', mouseMove, true);
  window.addEventListener('keydown', keyDown, true);

  // エレメント
  info = document.getElementById('info');

  // 自機の初期化
  let chara = new Character();
  chara.init(20); // サイズも指定

  let charaShot = new Array(CHARA_SHOT_MAX_COUNT);
  for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
    charaShot[i] = new CharacterShot();  
  }

  let enemy = new Array(ENEMY_MAX_COUNT);
  for(i = 0; i < ENEMY_MAX_COUNT; i++){
    enemy[i] = new Enemy();
  }

  let enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
  for(i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
    enemyShot[i] = new EnemyShot();
  }

  
  let txt = "test";
  let trans = Math.sin(counter * 0.01) / 2;
  ctx.font = "italic 40px Arial";
  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.fillText(txt,100,100);

  // 1 * Math.sin(Math.PI * 0.01);

  


  if(start){
    (function(){
      counter++;

      // console.log(counter);

      ctx.clearRect(0,0,screenCanvas.width,screenCanvas.height);

      

      ctx.beginPath();

      

      // 自機の位置を設定
      chara.position.x = mouse.x;
      chara.position.y = mouse.y;

      // chara.size == 20(initでセット)
      ctx.arc(
        chara.position.x,
        chara.position.y,
        chara.size,
        0,Math.PI * 2,false
      );

      // 自機の色(定数)
      ctx.fillStyle = CHARA_COLOR;

      // 自機の描画
      ctx.fill();

      // fireフラグの値により分岐
      if(fire){ // trueの時
        // 全ての自機ショットを調査する
        for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
          // 自機ショットが発射済みかチェック
          if(!charaShot[i].alive){ // alive = false;
            // 新規にセット(発射されてない時)
            charaShot[i].set(chara.position, 9,10);

            break;
          }
        }
        fire = false;
      }

      ctx.beginPath();

      // 自機ショットの調査
      for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
        // 発射されているかどうか
        if(charaShot[i].alive){
          charaShot[i].move();

          // パスを設定
          ctx.arc(
            charaShot[i].position.x,
            charaShot[i].position.y,
            charaShot[i].size,
            0, Math.PI * 2, false
          );

          ctx.closePath();
        }
      }

      ctx.fillStyle = CHARA_SHOT_COLOR;
      ctx.fill();




      // エネミーの出現管理
      if(counter % 100 === 0){
        for(j = 0;j < ENEMY_MAX_COUNT; j++){
          if(!enemy[j].alive){
            // let decide_type = Math.floor(Math.random() * 2)
            j = (counter % 200) / 100;
            let enemySize = 15;
            // let random = Math.floor(Math.random() * 4); // enemyのタイプ決定
            p.x = -enemySize + Math.random() * screenCanvas.width;
            p.y = screenCanvas.offsetTop;
            enemy[j].set(p, enemySize, j);
            break;
          }
        }
      }

      switch(true){
        case counter < 70:
          message = 'READY...';
          break;

        case counter < 100:
          message = 'GO!!';
          break;

        default:
          message = '';
      }
      

      ctx.beginPath();

      for(i = 0;i < ENEMY_MAX_COUNT; i++){
        if(enemy[i].alive){
          enemy[i].move();

          ctx.arc(
            enemy[i].position.x,
            enemy[i].position.y,
            enemy[i].size,
            0, Math.PI * 2, false
          );

          if(enemy[i].param % 30 === 0){
            for(j = 0; j < ENEMY_SHOT_MAX_COUNT; j++){
              if(!enemyShot[j].alive){
                p = enemy[i].position.distance(chara.position);
                p.normalize();
                enemyShot[j].set(enemy[i].position, p, 5, 10);
    
                break;
              }
            }
          }

          ctx.closePath();
        }
      }
      ctx.fillStyle = ENEMY_COLOR;
      ctx.fill();

      // enemyShotの描画
      ctx.beginPath();

      for(i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
        if(enemyShot[i].alive){
          enemyShot[i].move();
          ctx.arc(
            enemyShot[i].position.x,
            enemyShot[i].position.y,
            enemyShot[i].size,
            0, Math.PI * 2, false
          );

          ctx.closePath();
        }
      }
      ctx.fillStyle = ENEMY_SHOT_COLOR;
      ctx.fill();

      // 衝突判定--------------------
      for(i = 0; i < CHARA_SHOT_MAX_COUNT; i++){
        if(charaShot[i].alive){
          // 自機ショットとエネミーとの衝突判定
          for(j = 0; j < ENEMY_MAX_COUNT; j++){
            if(enemy[j].alive){
              p = enemy[j].position.distance(charaShot[i].position);
              if(p.length() < enemy[j].size){
                enemy[j].alive = false;
                charaShot[i].alive = false;
                score++;
                break;
              }
            }
          }
        }
      }

      for(i = 0; i < ENEMY_SHOT_MAX_COUNT; i++){
        if(enemyShot[i].alive){
          // 自機ショットとエネミーとの衝突判定
          p = chara.position.distance(enemyShot[i].position);
          if(p.length() < chara.size){
            chara.alive = false;

            run = false;
            message = 'GAME OVER !!';
            break;
          }
        }
      }

      
      info.innerHTML = 'SCORE: ' + (score * 100) + ' ' + message; 

      if(run){setTimeout(arguments.callee, fps);}
    })();
  }
};

// イベント定義
function mouseMove(event){
  mouse.x = event.clientX - screenCanvas.offsetLeft;
  mouse.y = event.clientY - screenCanvas.offsetTop;
}

function keyDown(event) {
  let ck = event.keyCode;

  // esc -> ゲーム終了
  if(ck === 27){run = false};
  
  //------- 自機イベント(攻撃) ---------
  // 自機ショット(zボタン)
  if(ck === 90){fire = true;};
}