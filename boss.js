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
  // i = (this.param % 360) * Math.PI / 180;
  // x = Math.cos(i) * (this.parent.size + this.size);
  // y = Math.sin(i) * (this.parent.size + this.size);

  switch (this.type) {
    case 0: // 右にいるビット
      this.position.x = this.parent.position.x + this.parent.size;
      this.position.y = this.parent.position.y;

    case 1:
      this.position.x = this.parent.position.x - this.parent.size;
      this.position.y = this.parent.position.y;
  }
};