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
let frame = 80;
let level = 0;
let image_idx = 0;
let boss_event = false;
let weakEnemy = true;
let number = 1;
let boss_speed = 3;
let notAliveNum = 0;
let clear = false;


// 定数
const ENEMY_IMAGES = 5;
const CHARA_SHOT_MAX_COUNT = 5;
const ENEMY_MAX_COUNT = 5;
const ENEMY_SHOT_MAX_COUNT = 5;
const ENEMY_SHOT_IMAGES = 5;
const EXPLOSION_MAX_COUNT = 4;
const ANIMATION_TICS = 10;
const BOSS_BIT_COUNT = 2;
const BOSS_SHOT_MAX_COUNT = 10;
const BOSS_BIT_SHOT_MAX_COUNT = 20;

// メインプログラム
window.onload = function () {



  let i, j, k;
  let p = new Point();

  let backImage = new Image();
  backImage.src = "image/space.png";

  let charaImage = new Image();
  charaImage.src = "image/chara.png";

  let enemyImages = new Array(ENEMY_IMAGES);
  for (i = 0; i < ENEMY_IMAGES; i++) {
    enemyImages[i] = new Image();
  }
  enemyImages[0].src = "image/enemy.png";
  enemyImages[1].src = "image/enemy2.png";
  enemyImages[2].src = "image/enemy3.png";
  enemyImages[3].src = "image/enemy4.png";
  enemyImages[4].src = "image/enemy5.png";

  let bossImage = new Image();
  bossImage.src = "image/boss.png";

  let bossBitImages = new Array(BOSS_BIT_COUNT);
  for (i = 0; i < BOSS_BIT_COUNT; i++) {
    bossBitImages[i] = new Image();
  }

  bossBitImages[0].src = "image/boss_bit.png";
  bossBitImages[1].src = "image/boss_bit2.png";

  let charaShotImage = new Image();
  charaShotImage.src = "image/chara_shot.png";

  let enemyShotImages = new Array(ENEMY_SHOT_IMAGES);
  for (i = 0; i < ENEMY_SHOT_IMAGES; i++) {
    enemyShotImages[i] = new Image();
  }
  enemyShotImages[0].src = "image/enemy_shot.png";
  enemyShotImages[1].src = "image/enemy_shot2.png";
  enemyShotImages[2].src = "image/enemy_shot3.png";
  enemyShotImages[3].src = "image/enemy_shot4.png";
  enemyShotImages[4].src = "image/enemy_shot5.png";

  let bossShotImage = new Image();
  bossShotImage.src = "image/boss_shot.png";

  let bossBitShotImage = new Image();
  bossBitShotImage.src = "image/boss_bit_shot.png";


  let explosionImages = new Array(EXPLOSION_MAX_COUNT);
  for (i = 0; i < EXPLOSION_MAX_COUNT; i++) {
    explosionImages[i] = new Image();
  }
  explosionImages[0].src = "image/explosion.png";
  explosionImages[1].src = "image/explosion2.png";
  explosionImages[2].src = "image/explosion3.png";
  explosionImages[3].src = "image/explosion4.png";


  // スクリーンの初期化
  screenCanvas = document.getElementById('screen');
  screenCanvas.width = 256 * 3 + 85;
  screenCanvas.height = 256 * 2 + 85;

  mouse.x = screenCanvas.width / 2;
  mouse.y = screenCanvas.height - 20;

  ctx = screenCanvas.getContext('2d');

  screenCanvas.addEventListener('mousemove', mouseMove, true);
  window.addEventListener('keydown', keyDown, true);

  // エレメント
  info = document.getElementById('info');

  let chara = new Character();
  chara.init(18);

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

  let boss = new Boss();

  let bossShot = new Array(BOSS_SHOT_MAX_COUNT);
  for (i = 0; i < BOSS_BIT_SHOT_MAX_COUNT; i++) {
    bossShot[i] = new BossShot();
  }

  let bit = new Array(BOSS_BIT_COUNT);
  for (i = 0; i < BOSS_BIT_COUNT; i++) {
    bit[i] = new Bit();
  }

  let bitShot = new Array(BOSS_BIT_SHOT_MAX_COUNT);
  for (i = 0; i < BOSS_BIT_SHOT_MAX_COUNT; i++) {
    bitShot[i] = new BitShot();
  }


  (function () {
    if (start === false) {
      top_counter++;
      ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
      drawScreen(backImage, 0, 0);
      let txt = "Press Enter key";
      let sin = 1.5 * Math.sin(top_counter * 0.1) / 2;
      ctx.font = "italic 40px Arial";
      ctx.fillStyle = `rgba(255,255,255,${sin})`;
      ctx.textAlign = "center";
      ctx.fillText(txt, screenCanvas.width / 2, screenCanvas.height * 2 / 3);

      let title = "~JS-STG~";
      ctx.fillStyle = 'rgba(102,255,51,1)';
      ctx.font = "italic 80px Arial";
      ctx.fillText(title, screenCanvas.width * 1 / 2, screenCanvas.height * 1 / 3);

    } else if (start) {
      
      // メインの描画
      counter++;
      ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
      drawScreen(backImage, 0, 0);
      let scoreText = `SCORE:${score}`;
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = "italic 20px Arial";
      ctx.fillText(scoreText, 80, 40);

      switch (true) {
        case counter < 40:
          let ready = 'READY...';
          ctx.fillStyle = 'rgba(102,255,204,1)';
          ctx.font = "italic 80px Arial";
          ctx.fillText(ready, screenCanvas.width * 1 / 2, screenCanvas.height * 1 / 3);
          break;

        case counter < 60:
          let go = 'GO!!';
          ctx.fillStyle = 'rgba(102,255,204,1)';
          ctx.font = "italic 80px Arial";
          ctx.fillText(go, screenCanvas.width * 1 / 2, screenCanvas.height * 1 / 3);
          break;
      }

      // 自機の位置を設定
      chara.position.x = mouse.x;
      chara.position.y = mouse.y;


      drawScreen(
        charaImage,
        chara.position.x - charaImage.naturalWidth / 2,
        chara.position.y - charaImage.naturalWidth / 2,
      );


      // fireフラグの値により分岐
      if (fire) {
        // 全ての自機ショットを調査する
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
          // 自機ショットが発射済みかチェック
          if (!charaShot[i].alive) {
            // 新規にセット(発射されてない時)
            charaShot[i].set(chara.position, charaShotImage.naturalWidth, 15);

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
          drawScreen(
            charaShotImage,
            charaShot[i].position.x - charaShotImage.naturalWidth / 2,
            charaShot[i].position.y - charaShotImage.naturalHeight / 2,
          );
        }
      }

      // エネミーの出現管理
      if (counter % frame === 0) {
        if (boss_event) {
          p.x = screenCanvas.width / 2;
          p.y = -boss.size;
          boss.set(p, 50, 50);
          for (i = 0; i < BOSS_BIT_COUNT; i++) {
            bit[i].set(boss, bossBitImages[i].naturalWidth, 25, i);
          }
          boss_event = false;

        } else if (weakEnemy) {
          for (j = 0; j < ENEMY_MAX_COUNT; j++) {
            if (!enemy[j].alive) {
              enemy[j].idx = image_idx;
              enemyShot[j].idx = image_idx;
              p.x = Math.random() * (screenCanvas.width - enemyImages[enemy[j].idx].naturalWidth) + enemyImages[enemy[j].idx].naturalWidth / 2;
              p.y = screenCanvas.offsetTop;
              enemy[j].set(p, enemyImages[enemy[j].idx].naturalWidth, 0);
              break;
            }
          }
        }
      }

      for (i = 0; i < ENEMY_MAX_COUNT; i++) {
        if (enemy[i].alive) {
          enemy[i].move();
          drawScreen(
            enemyImages[enemy[i].idx],
            enemy[i].position.x - enemyImages[enemy[i].idx].naturalWidth / 2,
            enemy[i].position.y - enemyImages[enemy[i].idx].naturalHeight / 2,
          );
          if (enemy[i].param % 30 - (level) === 0) {
            for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
              if (!enemyShot[j].alive) {
                p = enemy[i].position.distance(chara.position);
                p.normalize();
                let enemyAudio = new Audio("music/enemyShot.mp3");
                enemyAudio.play();
                let min = 8 + level;
                let max = 11 + level;
                enemyShot[j].image = enemyShotImages[enemy[i].idx];
                enemyShot[j].set(
                  enemy[i].position,
                  p, enemyShot[j].image.naturalWidth,
                  Math.floor(Math.random() * (max + 1 - min)) + min
                );
                break;
              }
            }
          }
        }
      }

      // ボス--------------------
      if (boss.alive) {
        boss.param++;
        if (boss.position.y === boss.size * 2) {
          boss.position.x = boss.position.x + boss_speed;
          if (boss.position.x > screenCanvas.width - (boss.size * 3 + 30)) {
            boss_speed = -boss_speed;
          } else if (boss.position.x < boss.size * 3 + 30) {
            boss_speed = -boss_speed;
          }
        } else {
          boss.position.y++;
        }

        drawScreen(
          bossImage,
          boss.position.x - bossImage.naturalWidth / 2,
          boss.position.y - bossImage.naturalHeight / 2,
        );



        if (boss.param % 50 === 0) {
          for (i = 0; i < BOSS_SHOT_MAX_COUNT; i++) {
            if (!bossShot[i].alive) {
              p = boss.position.distance(chara.position);
              p.normalize();
              bossShot[i].set(boss.position, p, bossShotImage.naturalWidth, 10);
              break;
            }
          }
        }
      }



      // ビット--------------------------
      for (i = 0; i < BOSS_BIT_COUNT; i++) {
        if (bit[i].alive) {
          bit[i].param++;
          // 右
          if (bit[i].type === 0) {
            bit[i].position.x = boss.position.x + (bossImage.naturalWidth / 2);
            bit[i].position.y = boss.position.y;
          }
          // 左
          if (bit[i].type === 1) {
            bit[i].position.x = boss.position.x - (bossImage.naturalWidth / 2);
            bit[i].position.y = boss.position.y;
          }
          drawScreen(
            bossBitImages[i],
            bit[i].position.x - bossBitImages[i].naturalWidth / 2,
            bit[i].position.y - bossBitImages[i].naturalHeight / 2,
          );

          if (bit[i].param % 30 === 0) {
            for (j = 0; j < BOSS_BIT_SHOT_MAX_COUNT; j++) {
              if (!bitShot[j].alive) {
                p = bit[i].position.distance(chara.position);
                p.normalize();
                bitShot[j].set(bit[i].position, p, bossBitShotImage.naturalWidth, 20);
                break;
              }
            }
          }
        }
      }

      // enemyShotの描画(雑魚)
      for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        if (enemyShot[i].alive) {
          enemyShot[i].move();
          drawScreen(
            enemyShot[i].image,
            enemyShot[i].position.x - enemyShot[i].image.naturalWidth / 2,
            enemyShot[i].position.y - enemyShot[i].image.naturalHeight / 2,
          );
        }
      }

      // ボスショットの描画
      for (i = 0; i < BOSS_SHOT_MAX_COUNT; i++) {
        if (bossShot[i].alive) {
          bossShot[i].move();
          drawScreen(
            bossShotImage,
            bossShot[i].position.x - bossShotImage.naturalWidth / 2,
            bossShot[i].position.y - bossShotImage.naturalHeight / 2,
          )
        }
      }

      // ビットショットの描画
      for (i = 0; i < BOSS_BIT_SHOT_MAX_COUNT; i++) {
        if (bitShot[i].alive) {
          bitShot[i].move();
          drawScreen(
            bossBitShotImage,
            bitShot[i].position.x - bossBitShotImage.naturalWidth / 2,
            bitShot[i].position.y - bossBitShotImage.naturalHeight / 2,
          )
        }
      }

      // 衝突判定--------------------------------------------------------------------------------------------------------
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
                score += 200 + level * 100;
                break;
              }
            }
          }
        }
      }

      for (let explosion of explosions) {
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth / 2,
          explosion.position.y - exImage.naturalWidth / 2,
        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }

      // 自機と敵機との衝突判定
      for (i = 0; i < ENEMY_MAX_COUNT; i++) {
        if (enemy[i] && enemy[i].alive) {
          p = chara.position.distance(enemy[i].position);
          if (p.length() < chara.size) {
            let explosionAudio = new Audio("music/explosion.mp3");
            explosionAudio.play();
            chara.alive = false;
            run = false;
            break;
          }
        }
      }

      // 自機とエネミーショットとの衝突判定
      for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        if (enemyShot[i].alive) {
          p = chara.position.distance(enemyShot[i].position);
          if (p.length() < chara.size) {
            let explosionAudio = new Audio("music/explosion.mp3");
            explosionAudio.play();
            chara.alive = false;
            run = false;
            break;
          }
        }
      }

      // 自機ショットと敵ショットとの判定
      for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        if (charaShot[i].alive) {
          for (j = 0; j < ENEMY_SHOT_MAX_COUNT; j++) {
            if (enemyShot[j].alive) {
              p = enemyShot[j].position.distance(charaShot[i].position);
              if (p.length() < enemyShot[j].size) {
                let explosionAudio = new Audio("music/explosion.mp3");
                explosionAudio.play();
                let x = enemyShot[j].position.x;
                let y = enemyShot[j].position.y;

                let explosion = new Explosion();
                explosion.position.x = x;
                explosion.position.y = y;
                explosions.push(explosion);

                enemyShot[j].alive = false;
                charaShot[i].alive = false;

                score += 10 + level * 100;
                break;
              }
            }
          }
        }
      }

      // 爆発描画
      for (let explosion of explosions) {
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth / 2,
          explosion.position.y - exImage.naturalWidth / 2,
        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }

      // 自機ショットとボスビットとの衝突判定
      for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        if (charaShot[i].alive) {
          for (j = 0; j < BOSS_BIT_COUNT; j++) {
            if (bit[j].alive) {
              p = bit[j].position.distance(charaShot[i].position);
              if (p.length() < bit[j].size) {
                bit[j].life--;

                let explosionAudio = new Audio("music/explosion.mp3");
                explosionAudio.play();
                let x = bit[j].position.x;
                let y = bit[j].position.y;

                let explosion = new Explosion();
                explosion.position.x = x;
                explosion.position.y = y;
                explosions.push(explosion);

                // 自機ショットの生存フラグを降ろす
                charaShot[i].alive = false;

                // 耐久値がマイナスになったら生存フラグを降ろす
                if (bit[j].life < 0) {
                  bit[j].alive = false;
                  notAliveNum++;    
                  score += 10000;
                }
                break;
              }
            }
          }
        }
      }

      if(notAliveNum === 2){
        for (let explosion of explosions) {
          let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
          drawScreen(
            exImage,
            explosion.position.x - exImage.naturalWidth / 2,
            explosion.position.y - exImage.naturalWidth / 2,
          );
          explosion.tics++;
          if (explosion.tics >= 4 * ANIMATION_TICS) {
            explosions.splice(explosions.indexOf(explosion), 1);
          }
        }
      }

      // 自機ショットとボス本体の判定
      if(notAliveNum === 2){
        for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
          if (charaShot[i].alive) {
            if (boss.alive) {
              // 自機ショットとボスとの衝突判定
              p = boss.position.distance(charaShot[i].position);
              if (p.length() < boss.size) {
                boss.life--;
  
                let explosionAudio = new Audio("music/explosion.mp3");
                explosionAudio.play();
                let x = charaShot[i].position.x;
                let y = charaShot[i].position.y;
  
                let explosion = new Explosion();
                explosion.position.x = x;
                explosion.position.y = y;
                explosions.push(explosion);
  
                charaShot[i].alive = false;
  
                if (boss.life < 0) {
                  score += 500;
                  clear = true;
                  run = false;
                }
              }
            }
          }
        }
      }
      

      for (let explosion of explosions) {
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth / 2,
          explosion.position.y - exImage.naturalWidth / 2,

        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }

      // 自機ショットとビットショット
      for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        if (charaShot[i].alive) {
          for (j = 0; j < BOSS_BIT_SHOT_MAX_COUNT; j++) {
            if (bitShot[j].alive) {
              p = bitShot[j].position.distance(charaShot[i].position);
              if (p.length() < bitShot[j].size) {
                let explosionAudio = new Audio("music/explosion.mp3");
                explosionAudio.play();
                let x = bitShot[j].position.x;
                let y = bitShot[j].position.y;

                let explosion = new Explosion();
                explosion.position.x = x;
                explosion.position.y = y;
                explosions.push(explosion);

                bitShot[j].alive = false;
                charaShot[i].alive = false;

                score += 10 + level * 100;
                break;
              }
            }
          }
        }
      }

      for (let explosion of explosions) {
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth / 2,
          explosion.position.y - exImage.naturalWidth / 2,

        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }

      // 自機ショットとボスショット
      for (i = 0; i < CHARA_SHOT_MAX_COUNT; i++) {
        if (charaShot[i].alive) {
          for (j = 0; j < BOSS_SHOT_MAX_COUNT; j++) {
            if (bossShot[j].alive) {
              p = bossShot[j].position.distance(charaShot[i].position);
              if (p.length() < bossShot[j].size) {
                let explosionAudio = new Audio("music/explosion.mp3");
                explosionAudio.play();
                let x = bossShot[j].position.x;
                let y = bossShot[j].position.y;

                let explosion = new Explosion();
                explosion.position.x = x;
                explosion.position.y = y;
                explosions.push(explosion);

                bossShot[j].alive = false;
                charaShot[i].alive = false;

                score += 10 + level * 100;
                break;
              }
            }
          }
        }
      }

      for (let explosion of explosions) {
        let exImage = explosionImages[Math.floor(explosion.tics / ANIMATION_TICS)]
        drawScreen(
          exImage,
          explosion.position.x - exImage.naturalWidth / 2,
          explosion.position.y - exImage.naturalWidth / 2,

        );
        explosion.tics++;
        if (explosion.tics >= 4 * ANIMATION_TICS) {
          explosions.splice(explosions.indexOf(explosion), 1);
        }
      }

      // 自機のボスショット当たり判定
      for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        if (bossShot[i].alive) {
          // 自機とエネミーショットとの衝突判定
          p = chara.position.distance(bossShot[i].position);
          if (p.length() < chara.size) {
            let explosionAudio = new Audio("music/explosion.mp3");
            explosionAudio.play();
            chara.alive = false;
            run = false;
            break;
          }
        }
      }

      // 自機のビットショット当たり判定
      for (i = 0; i < ENEMY_SHOT_MAX_COUNT; i++) {
        if (bitShot[i].alive) {
          // 自機とエネミーショットとの衝突判定
          p = chara.position.distance(bitShot[i].position);
          if (p.length() < chara.size) {
            let explosionAudio = new Audio("music/explosion.mp3");
            explosionAudio.play();
            chara.alive = false;
            run = false;
            break;
          }
        }
      }

      // 自機とビットの当たり判定
      for (i = 0; i < BOSS_BIT_COUNT; i++) {
        if (bit[i] && bit[i].alive) {
          // 自機と敵機との衝突判定
          p = chara.position.distance(bit[i].position);
          if (p.length() < chara.size) {
            let explosionAudio = new Audio("music/explosion.mp3");
            explosionAudio.play();
            chara.alive = false;
            run = false;
            break;
          }
        }
      }

      // 自機とボスとの当たり判定
      if (boss && boss.alive) {
        p = chara.position.distance(boss.position);
        if (p.length() < chara.size) {
          let explosionAudio = new Audio("music/explosion.mp3");
          explosionAudio.play();
          chara.alive = false;
          run = false;
        }
      }

      let levelUpAudio = new Audio("music/powerup02.mp3");
      // レベル設定
      if (score >= 1000 && level === 0) {
        frame -= 10;
        level++;
        image_idx++;
        levelUpAudio.play();
      } else if (score >= 3000 && level === 1) {
        frame -= 10;
        level++;
        image_idx++;
        levelUpAudio.play();
      } else if (score >= 7000 && level === 2) {
        frame -= 10;
        level++;
        image_idx++;
        levelUpAudio.play();
      } else if (score >= 15000 && level === 3) {
        frame -= 15;
        level++;
        image_idx++;
        levelUpAudio.play();
      } else if (score >= 31000 && level === 4) {
        frame -= 15;
        level++;
        levelUpAudio.play();
      } else if (score >= 70000 && level === 5) {
        weakEnemy = false;
        boss_event = true;
        level++;
        levelUpAudio.play();
      }

      if (run === false && clear === true) {
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
        let clearAudio = new Audio("music/nc41828.wav");
        clearAudio.play();
        drawScreen(backImage, 0, 0);
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.font = "italic 80px Arial";
        ctx.fillText('GAME CLEAR !!', screenCanvas.width / 2, screenCanvas.height / 3);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = "italic 40px Arial";
        ctx.fillText(`SCORE:${score}`, screenCanvas.width / 2, screenCanvas.height * 2 / 3);
      }else if(run === false){
        // GAME OVER表示
        ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);
        drawScreen(backImage, 0, 0);
        let end = 'GAME OVER...';
        ctx.fillStyle = 'rgba(255,0,0,1)';
        ctx.font = "italic 80px Arial";
        ctx.fillText(end, screenCanvas.width / 2, screenCanvas.height / 3);
        // 現在のスコア
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = "italic 40px Arial";
        ctx.fillText(`SCORE:${score}`, screenCanvas.width / 2, screenCanvas.height * 2 / 3);
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
  if (ck === 13) { 
    start = true
    let selectAudio = new Audio('music/decision3.mp3'); 
    selectAudio.play();
  };

}

function drawScreen(image, x, y) {
  ctx.drawImage(image, x, y);
}


