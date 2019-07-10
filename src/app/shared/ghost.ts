import {Hero} from "./hero";

export class Ghost extends Hero {

  cordPacman: object;

  ready: boolean;

  constructor(private name: string,
              protected diameter: number,
              protected col: number,
              protected row: number) {
    super(diameter);
  }

  init(): void {
    this.__direction = 'left';
    const canvas = document.getElementById(this.name) as HTMLCanvasElement;
    canvas.width = this.diameter * this.col;
    canvas.height = this.diameter * this.row;
    this.ctx = canvas.getContext('2d');

    if (this.name === 'blinky') {
      this.x = 196;
      this.y = 160;

    } else if (this.name === 'pinky') {
      this.x = 170;
      this.y = 203;

    } else if (this.name === 'inky') {
      this.x = 195;
      this.y = 203;

    } else if (this.name === 'clyde') {
      this.x = 220;
      this.y = 203;
    }

    this.drawGhost();
  }

  start(): void {
    if (this.name === 'pinky') {
      setTimeout(() => {
        this.clear();
        this.x = 196;
        this.y = 160;
        this.ready = true;
      }, 1000 * 5);

    } else if (this.name === 'inky') {
      setTimeout(() => {
        this.clear();
        this.x = 196;
        this.y = 160;
        this.ready = true;
      }, 1000 * 10);

    } else if (this.name === 'clyde') {
      setTimeout(() => {
        this.clear();
        this.x = 196;
        this.y = 160;
        this.ready = true;
      }, 1000 * 15);
    }
  }

  update(): void {
    let direction = [];

    if (this.__direction === 'left') {
      if (this.canGo('up')) {
        direction.push('up');
      }

      if (this.canGo('down')) {
        direction.push('down');
      }

      if (this.canGo('left')) {
        direction.push('left');
      }

    } else if (this.__direction === 'right') {
      if (this.canGo('up')) {
        direction.push('up');
      }

      if (this.canGo('down')) {
        direction.push('down');
      }

      if (this.canGo('right')) {
        direction.push('right');
      }

    } else if (this.__direction === 'up') {
      if (this.canGo('up')) {
        direction.push('up');
      }

      if (this.canGo('left')) {
        direction.push('left');
      }

      if (this.canGo('right')) {
        direction.push('right');
      }

    } else if (this.__direction === 'down') {
      if (this.canGo('down')) {
        direction.push('down');
      }

      if (this.canGo('left')) {
        direction.push('left');
      }

      if (this.canGo('right')) {
        direction.push('right');
      }
    }

    if (direction.length < 2) {
      this.__direction = direction[0];

    } else {
      this.__direction = direction[this.getDirection(1, direction.length) - 1];
    }

    if (this.canGo(this.__direction)) {
      this.move();
      this.drawGhost();
    }
  }

  canEat(): boolean {
    if (this.x + 10 > this.cordPacman['x'] - 10 && this.y === this.cordPacman['y'] && this.x - 10 < this.cordPacman['x'] + 10) {
      return true;

    } else if (this.x - 10 < this.cordPacman['x'] + 10 && this.y === this.cordPacman['y'] && this.x + 10 > this.cordPacman['x'] - 10) {
      return true;

    } else if (this.x === this.cordPacman['x'] && this.y - 10 < this.cordPacman['y'] + 10 && this.y + 10 > this.cordPacman['y'] - 10) {
      return true;

    } else if (this.x === this.cordPacman['x'] && this.y + 10 > this.cordPacman['y'] - 10 && this.y - 10 < this.cordPacman['y'] + 10) {
      return true;
    }

    return false;
  }

  private getDirection(min: number, max: number): number {
    let rand: number = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }

  private drawGhost(): void {
    this.clear();

    this.ctx.beginPath();

    if (this.name === 'blinky') {
      this.ctx.fillStyle = 'red';
      this.ctx.strokeStyle = 'red'
    }

    if (this.name === 'pinky') {
      this.ctx.fillStyle = 'pink';
      this.ctx.strokeStyle = 'pink'
    }

    if (this.name === 'inky') {
      this.ctx.fillStyle = 'lightblue';
      this.ctx.strokeStyle = 'lightblue'
    }

    if (this.name === 'clyde') {
      this.ctx.fillStyle = 'orange';
      this.ctx.strokeStyle = 'orange'
    }

    this.ctx.moveTo(this.x - this.diameter / 2 - 3, this.y - 3);
    this.ctx.quadraticCurveTo(this.x, this.y - this.diameter - 4, this.x + this.diameter / 2 + 3, this.y - 3);
    this.ctx.lineTo(this.x + this.diameter / 2 + 3, this.y + 10);
    this.ctx.lineTo(this.x + 5, this.y + 5);
    this.ctx.lineTo(this.x, this.y + 10);
    this.ctx.lineTo(this.x - 5, this.y + 5);
    this.ctx.lineTo(this.x - 10, this.y + 10);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(this.x - 4, this.y - 4, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.x - 4, this.y - 4, 1.5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'blue';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.x + 4, this.y - 4, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = 'white';
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.arc(this.x + 4, this.y - 4, 1.5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'blue';
    this.ctx.fill();
  }
}
