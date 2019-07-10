import {Hero} from "./hero";
import {grid} from "./grid";

export class Pacman extends Hero {

  grid: Array<string[]>;

  private startAngle: number = 0.3;
  private endAngle: number = 1.7;
  private incline: number = 6;

  private openHead: boolean = true;
  updateFood: string;

  private waitDirection: string;

  constructor(protected diameter: number,
              protected col: number,
              protected row: number) {
    super(diameter);
  }

  init(): void {
    this.grid = grid;
    this.__direction = 'right';
    const canvas = document.getElementById('pacman') as HTMLCanvasElement;
    canvas.width = this.diameter * this.col;
    canvas.height = this.diameter * this.row;
    this.ctx = canvas.getContext('2d');

    this.x = 195;
    this.y = 329;

    this.drawPacman();
  }

  update(): void {
    if (this.canGo(this.waitDirection)) {
      this.__direction = this.waitDirection;
      this.waitDirection = '';
      this.headDirectionChange();

      if (this.__direction === 'up') {
        this.y--;

      } else if (this.__direction === 'down') {
        this.y++;

      } else if (this.__direction === 'left') {
        this.x--;

      } else if (this.__direction === 'right') {
        this.x++;
      }

      this.eat(this.canGo(this.waitDirection, true));
      this.drawPacman();

    } else if (this.canGo(this.__direction)) {
      this.move();
      this.eat(this.canGo(this.__direction, true));
      this.drawPacman();
    }
  }

  set direction(direction: string) {
    if (this.canGo(direction)) {
      this.__direction = direction;
      this.waitDirection = '';
      this.headDirectionChange();

    } else {
      this.waitDirection = direction;
    }
  }

  private eat(value: object | boolean): void {
    if (value && value['val'] && value['val'].includes('food')) {
      this.updateFood = 'food';

    } else {
      this.updateFood = '';
    }
  }

  private drawPacman(): void {
    this.clear();

    if (this.openHead) {
      this.startAngle -= 0.05;
      this.endAngle += 0.05;
      this.incline--;

      if (!this.incline) {
        this.openHead = false;
        this.incline = 6;
      }

    } else {
      this.startAngle += 0.05;
      this.endAngle -= 0.05;
      this.incline--;

      if (!this.incline) {
        this.openHead = true;
        this.incline = 6;
      }
    }

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.diameter / 2 + 2, this.startAngle * Math.PI, this.endAngle * Math.PI);

    this.ctx.lineTo(this.x, this.y);
    this.ctx.closePath();

    this.ctx.strokeStyle = '#000';
    this.ctx.stroke();

    this.ctx.fillStyle = "#FF0";
    this.ctx.fill();
  }

  private headDirectionChange(): void {
    this.startAngle = 0;
    this.endAngle = 0;
    this.openHead = true;
    this.incline = 6;

    if (this.__direction === 'right') {
      this.startAngle = 0.3;
      this.endAngle = 1.7;

    } else if (this.__direction === 'down') {
      this.startAngle = 0.8;
      this.endAngle = 2.2;

    } else if (this.__direction === 'left') {
      this.startAngle = 1.3;
      this.endAngle = 2.7;

    } else if (this.__direction === 'up') {
      this.startAngle = 1.8;
      this.endAngle = 3.2;
    }
  }
}
