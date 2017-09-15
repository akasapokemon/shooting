// グローバル
let screenCanvas, info;
let start = false; // ボタンでフラグをチェンジ
let run = true;
let fps = 1000 / 30;
let mouse = new Point();
let ctx;
let fire = false; // shotするのかしないのか
let top_counter = 0;
let counter = 0;
let score = 0;
let message = '';


// 定数
const CHARA_COLOR = 'rgba(0,0,255,0.75)';
const CHARA_SHOT_COLOR = 'rgba(0,255,0,0.75)';
const CHARA_SHOT_MAX_COUNT = 15;
const ENEMY_COLOR = 'rgba(255, 0, 0, 0.75)';
const ENEMY_MAX_COUNT = 4;
const ENEMY_SHOT_COLOR = 'rgba(255,0,255,0.75)';
const ENEMY_SHOT_MAX_COUNT = 100;
const EXPLOSION_MAX_COUNT = 4;
const ANIMATION_TICS = 3;



// メインプログラム
window.onload = function () {

  

  let i, j, k;
  let p = new Point();

  let backImage = new Image();
  backImage.src = "image/space.png";

  let charaImage = new Image();
  charaImage.src = "image/chara.png";

  let enemyImage = new Image();
  enemyImage.src = "image/enemy.png";

  let charaShotImage = new Image();
  charaShotImage.src = "image/chara_shot.png";

  let enemyShotImage = new Image();
  enemyShotImage.src = "image/enemy_shot.png";

  let explosionImages = new Array(EXPLOSION_MAX_COUNT);
  for(i = 0; i < EXPLOSION_MAX_COUNT; i++){
    explosionImages[i] = new Image();
  }
  explosionImages[0].src = "image/explosion.png";
  explosionImages[1].src = "image/explosion2.png";
  explosionImages[2].src = "image/explosion3.png";
  explosionImages[3].src = "image/explosion4.png";


  

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

  let chara = new Character();
  chara.init(16);

  let charaShot = new Array(CHARA_SHOT_MAX_COUNT);
  for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
    charaShot[i] = new CharacterShot();
  }

  let enemy = new Array(ENEMY_MAX_COUNT);
  for (i = 0; i < ENEMY_MAX_COUNT; i++) {
    enemy[i] = new Enemy();
  }

  let enemyShot = new Array(ENEMY_SHOT_MAX_COUNT);
  for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
    enemyShot[i] = new EnemyShot();
  }

  let explosions = [];
  
  (function () {
    if (start === false) {
      top_counter++;
      ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
      drawScreen(backImage,0,0);
      let txt = "Press Enter key";
      let sin = 1.5 * Math.sin(top_counter * 0.1) / 2;
      ctx.font = "italic 40px Arial";
      ctx.fillStyle = `rgba(255,255,255,${sin})`;
      ctx.textAlign = "center";
      ctx.fillText(txt, screenCanvas.width / 2, screenCanvas.height * 2/3);

      let title = "~JS-STG~";
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.font = "italic 80px Arial";
      ctx.fillText(title,screenCanvas.width * 1/2,screenCanvas.height * 1/3);

    } else if (start) {
      counter++;
      ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
      drawScreen(backImage, 0, 0);
      let scoreText = `SCORE:${score}`;
      ctx.fillStyle = 'rgba(255,255,255,1)';
      ctx.font = "italic 10px Arial";
      ctx.fillText(scoreText,50,50);
      // drawScreen(backImage, 0, 0);

      // 自機の位置を設定
      chara.position.x = mouse.x;
      chara.position.y = mouse.y;

      
      drawScreen(
        charaImage,
        chara.position.x - charaImage.naturalWidth/2,
        chara.position.y - charaImage.naturalWidth/2,
      );


      // fireフラグの値により分岐
      if (fire) {
        // 全ての自機ショットを調査する
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
          // 自機ショットが発射済みかチェック
          if (!charaShot[i].alive) { // alive = false;
            // 新規にセット(発射されてない時)
            charaShot[i].set(chara.position, charaShotImage.naturalWidth, 10);

            break;
          }
        }
        fire = false;
      }

      // 自機ショットの調査
      for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        // 発射されているかどうか
        if (charaShot[i].alive) {
          charaShot[i].move();

          // パスを設定
          drawScreen(
            charaShotImage,
            charaShot[i].position.x - charaShotImage.naturalWidth/2,
            charaShot[i].position.y - charaShotImage.naturalHeight/2,
          );
        }
      }

      // エネミーの出現管理
      if (counter % 60 === 0) {
        for (i = 0; i < ENEMY_MAX_COUNT; i++) {
          if (!enemy[i].alive) {
            // j = (counter % 200) / 100;
            // let enemySize = 15;
            p.x = Math.random() * (screenCanvas.width - enemyImage.naturalWidth*2) + enemyImage.naturalWidth*2;
            p.y = screenCanvas.offsetTop;
            enemy[i].set(p, enemyImage.naturalWidth, 0);
            break;
          }
        }
      }

      switch (true) {
        case counter < 40:
          let ready = 'READY...';
          ctx.fillStyle = 'rgba(255,255,255,1)';
          ctx.font = "italic 80px Arial";
          // ctx.font = "80px 'Times New Roman'";
          ctx.fillText(ready,screenCanvas.width * 1/2,screenCanvas.height * 1/3);
          break;

        case counter < 60:
          let go = 'GO!!';
          ctx.fillStyle = 'rgba(255,255,255,1)';
          ctx.font = "italic 80px Arial";
          ctx.fillText(go,screenCanvas.width * 1/2,screenCanvas.height * 1/3);
          message = 'GO!!';
          break;

        default:
          message = '';
      }


      for (i = 0; i < ENEMY_MAX_COUNT; i++) {
        if (enemy[i].alive) {
          enemy[i].move();

          drawScreen(
            enemyImage,
            enemy[i].position.x - enemyImage.naturalWidth/2,
            enemy[i].position.y - enemyImage.naturalHeight/2,
          );
          if (enemy[i].param % 30 === 0) {
            for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
              if (!enemyShot[j].alive) {
                p = enemy[i].position.distance(chara.position);
                p.normalize();
                let enemyAudio = new Audio("music/enemyShot.mp3");
                enemyAudio.play();
                enemyShot[j].set(enemy[i].position, p, enemyShotImage.naturalWidth, 10);

                break;
              }
            }
          }
        }
      }

      // enemyShotの描画
      for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        if (enemyShot[i].alive) {
          enemyShot[i].move();
          drawScreen(
            enemyShotImage,
            enemyShot[i].position.x - enemyShotImage.naturalWidth/2, 
            enemyShot[i].position.y - enemyShotImage.naturalHeight/2,
          );
        }
      }

      // 衝突判定--------------------
      for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        if (charaShot[i].alive) {
          // 自機ショットとエネミーとの衝突判定
          for (j = 0; j < ENEMY_MAX_COUNT; j++) {
            if (enemy[j].alive) {
              p = enemy[j].position.distance(charaShot[i].position);
              if (p.length() < enemy[j].size) {
                let explosionAudio = new Audio("music/explosion.mp3");
                explosionAudio.play();
                let x = enemy[j].position.x;
                let y = enemy[j].position.y;

                let explosion = new Explosion();
                explosion.position.x = x;
                explosion.position.y = y;
                explosions.push(explosion);

                enemy[j].alive = false;
                charaShot[i].alive = false;
                score += 100;
                break;
              }
            }
          }
        }
      }

      for(let explosion of explosions) { 
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth/2,
          explosion.position.y - exImage.naturalWidth/2,

        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }
      

      

      for(i = 0; i < ENEMY_MAX_COUNT; i++){
        if(enemy[i].alive){
          // 自機と敵機との衝突判定
          p = chara.position.distance(enemy[i].position);
          if(p.length() < chara.size){
            let explosionAudio = new Audio("music/explosion.mp3");
            explosionAudio.play();

            let x = chara.position.x;
            let y = chara.position.y;
            let explosion = new Explosion();
            explosion.position.x = x;
            explosion.position.y = y;
            explosions.push(explosion);

            chara.alive = false;
            run = false;
            message = 'GAME OVER !!';
            break;
          }
        }
      }

      // 自機の爆発描画
      for(let explosion of explosions) { 
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth/2,
          explosion.position.y - exImage.naturalWidth/2,

        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }


      for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        if (enemyShot[i].alive) {
          // 自機とエネミーショットとの衝突判定
          p = chara.position.distance(enemyShot[i].position);
          if (p.length() < chara.size) {
            let explosionAudio = new Audio("music/explosion.mp3");
            explosionAudio.play();

            let x = chara.position.x;
            let y = chara.position.y;
            let explosion = new Explosion();
            explosion.position.x = x;
            explosion.position.y = y;
            explosions.push(explosion);

            chara.alive = false;

            run = false;
            message = 'GAME OVER !!';
            break;
          }
        }
      }

      // 自機の爆発描画(敵ショットにやられた版)
      for(let explosion of explosions) { 
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth/2,
          explosion.position.y - exImage.naturalWidth/2,

        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }
    }
    if (run) { setTimeout(arguments.callee, fps); }
  })();
}


// イベント定義
function mouseMove(event) {
  mouse.x = event.clientX - screenCanvas.offsetLeft; // マウスの位置
  mouse.y = event.clientY - screenCanvas.offsetTop;
}

function keyDown(event) {
  let ck = event.keyCode;

  // esc -> ゲーム終了
  if (ck === 27) { run = false };

  //------- 自機イベント(攻撃) ---------
  // 自機ショット(zボタン)
  if (ck === 90) { 
    fire = true;
    let charaAudio = new Audio("music/charaShot.mp3");
    charaAudio.play();
  };

  //------- startボタン----------
  // Enterキー
  if (ck === 13) { start = true };
}

function drawScreen(image,x,y){
  ctx.drawImage(image, x, y);
}

