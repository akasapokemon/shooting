function Boss() {
  this.position = new Point();
  this.size = 0;
  this.life = 0;
  this.param = 0;
  this.alive = false;
}

Boss.prototype.set = function (p, size, life) {
  this.position.x = p.x;
  this.position.y = p.y;
  this.size = size;
  this.life = life;
  this.param = 0;
  this.alive = true;
}

function Bit() {
  this.position = new Point();
  this.parent = null;
  this.size = 0;
  this.life = 0;
  this.param = 0;
  this.alive = false;
}

Bit.prototype.set = function (parent, size, life, type) {
  this.parent = parent; // インスタンスを渡す
  this.size = size;
  this.life = life;
  this.alive = true;
  this.type = type;
}

Bit.prototype.move = function () {
  this.param++;
  switch (this.type) {
    case 0: // 右にいるビット
      this.position.x = this.parent.position.x + (this.parent.size / 2 + this.size);
      this.position.y = this.parent.position.y;

    case 1:
      this.position.x = this.parent.position.x - (this.parent.size / 2 + this.size);
      this.position.y = this.parent.position.y;
  }
};
function BossShot() {
  this.position = new Point();
  this.vector = new Point();
  this.size = 0;
  this.speed = 0;
  this.alive = false;
  this.idx = 0;
  this.image;
}

BossShot.prototype.set = function(p, vector, size, speed){
  this.position.x = p.x;
  this.position.y = p.y;
  this.vector.x = vector.x;
  this.vector.y = vector.y;

  this.size = size;
  this.speed = speed;

  this.alive = true;
}

BossShot.prototype.move = function(){
  this.position.x += this.vector.x * this.speed;
  this.position.y += this.vector.y * this.speed;

  if(
    this.position.x < -this.size ||
    this.position.y < -this.size ||
    this.position.x > this.size + screenCanvas.width ||
    this.position.y > this.size + screenCanvas.height
  ){
    this.alive = false;
  }
}

function BitShot() {
  this.position = new Point();
  this.vector = new Point();
  this.size = 0;
  this.speed = 0;
  this.alive = false;
  this.idx = 0;
  this.image;
}

BitShot.prototype.set = function(p, vector, size, speed){
  this.position.x = p.x;
  this.position.y = p.y;
  this.vector.x = vector.x;
  this.vector.y = vector.y;

  this.size = size;
  this.speed = speed;

  this.alive = true;
}

BitShot.prototype.move = function(){
  this.position.x += this.vector.x * this.speed;
  this.position.y += this.vector.y * this.speed;

  if(
    this.position.x < -this.size ||
    this.position.y < -this.size ||
    this.position.x > this.size + screenCanvas.width ||
    this.position.y > this.size + screenCanvas.height
  ){
    this.alive = false;
  }
}