import {grid} from "./grid";
import {interval, Observable} from "rxjs";

export class GameArea {

  grid: Array<string[]>;

  startGame: boolean;

  constructor(private diameter: number,
              private col: number,
              private row: number,
              private fps: number) {
  }

  init(): void {
    this.grid = grid;
    this.gridDraw();
    this.foodDraw();
  }

  update(): Observable<number> {
    return interval(1000 / this.fps);
  }

  foodDraw(): void {
    const canvas = document.getElementById('food') as HTMLCanvasElement;
    canvas.width = this.diameter * this.col;
    canvas.height = this.diameter * this.row;
    const ctx = canvas.getContext('2d');

    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.grid[i][j] === 'food') {
          ctx.beginPath();
          ctx.fillStyle = '#FFB9AF';
          ctx.arc(j * this.diameter + this.diameter / 2, i * this.diameter + (this.diameter / 2), this.diameter / 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
  }

  private gridDraw(): void {
    const map1 = document.getElementById('map1') as HTMLCanvasElement;
    const map2 = document.getElementById('map2') as HTMLCanvasElement;

    map1.width = this.diameter * this.col;
    map2.width = this.diameter * this.col;
    map1.height = this.diameter * this.row;
    map2.height = this.diameter * this.row;

    const ctx1 = map1.getContext('2d');
    const ctx2 = map2.getContext('2d');

    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        if (this.grid[i][j].includes('doorLeft')) {
          this.drawDoor(ctx1, i, j, 'left');

        } else if (this.grid[i][j].includes('doorRight')) {
          this.drawDoor(ctx1, i, j, 'right');

        } else if (this.grid[i][j].includes('horizontally')) {
          this.drawHorizontally(ctx1, i, j);
          this.drawHorizontally(ctx2, i, j);

          if (this.grid[i][j].includes('down')) {
            this.drawHorizontallyDown(ctx1, i, j);
            this.drawHorizontallyDown(ctx2, i, j);
          }

        } else if (this.grid[i][j].includes('vertically')) {
          this.drawVertically(ctx1, i, j);
          this.drawVertically(ctx2, i, j);

        } else if (this.grid[i][j].includes('curveLeftUp')) {
          this.drawCurveLeft(ctx1, i, j);
          this.drawCurveLeft(ctx2, i, j);

          if (this.grid[i][j].includes('high')) {
            this.drawCurveLeftHigh(ctx1, i, j);
            this.drawCurveLeftHigh(ctx2, i, j);
          }

        } else if (this.grid[i][j].includes('curveRightUp')) {
          this.drawCurveRight(ctx1, i, j);
          this.drawCurveRight(ctx2, i, j);

          if (this.grid[i][j].includes('high')) {
            this.drawCurveRightHigh(ctx1, i, j);
            this.drawCurveRightHigh(ctx2, i, j);
          }

        } else if (this.grid[i][j].includes('curveLeftDown')) {
          this.drawCurveLeftDown(ctx1, i, j);
          this.drawCurveLeftDown(ctx2, i, j);

          if (this.grid[i][j].includes('high')) {
            this.drawCurveLeftDownHigh(ctx1, i, j);
            this.drawCurveLeftDownHigh(ctx2, i, j);
          }

        } else if (this.grid[i][j].includes('curveRightDown')) {
          this.drawCurveRightDown(ctx1, i, j);
          this.drawCurveRightDown(ctx2, i, j);

          if (this.grid[i][j].includes('high')) {
            this.drawCurveRightDownHigh(ctx1, i, j);
            this.drawCurveRightDownHigh(ctx2, i, j);
          }
        }

        if (this.grid[i][j].includes('up')) {
          this.drawHorizontallyUp(ctx1, i, j);
          this.drawHorizontallyUp(ctx2, i, j);
        }

        if (this.grid[i][j].includes('left')) {
          this.drawVerticallyLeft(ctx1, i, j);
          this.drawVerticallyLeft(ctx2, i, j);

        } else if (this.grid[i][j].includes('right')) {
          this.drawVerticallyRight(ctx1, i, j);
          this.drawVerticallyRight(ctx2, i, j);
        }
      }
    }
  }

  private drawHorizontally(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter, y * this.diameter + this.diameter / 2);
    ctx.lineTo(x * this.diameter + this.diameter, y * this.diameter + this.diameter / 2);
    ctx.closePath();
    ctx.stroke();
  }

  private drawHorizontallyUp(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter, y * this.diameter + 1);
    ctx.lineTo(x * this.diameter + this.diameter, y * this.diameter + 1);
    ctx.closePath();
    ctx.stroke();
  }

  private drawHorizontallyDown(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter, y * this.diameter + this.diameter - 1);
    ctx.lineTo(x * this.diameter + this.diameter, y * this.diameter + this.diameter - 1);
    ctx.closePath();
    ctx.stroke();
  }

  private drawVertically(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter + this.diameter / 2, y * this.diameter);
    ctx.lineTo(x * this.diameter + this.diameter / 2, y * this.diameter + this.diameter);
    ctx.closePath();
    ctx.stroke();
  }

  private drawVerticallyLeft(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter + 1, y * this.diameter - 2);
    ctx.lineTo(x * this.diameter + 1, y * this.diameter + this.diameter + 2);
    ctx.closePath();
    ctx.stroke();
  }

  private drawVerticallyRight(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter + this.diameter - 1, y * this.diameter - 2);
    ctx.lineTo(x * this.diameter + this.diameter - 1, y * this.diameter + this.diameter + 2);
    ctx.closePath();
    ctx.stroke();
  }

  private drawCurveLeft(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter + this.diameter / 2, y * this.diameter + this.diameter);
    ctx.quadraticCurveTo(x * this.diameter + this.diameter / 2, y * this.diameter + this.diameter / 2, x * this.diameter + this.diameter, y * this.diameter + this.diameter / 2);
    ctx.stroke();
  }

  private drawCurveLeftHigh(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.beginPath();
    ctx.moveTo(x * this.diameter + 1, y * this.diameter + this.diameter);
    ctx.quadraticCurveTo(x * this.diameter, y * this.diameter, x * this.diameter + this.diameter, y * this.diameter + 1);
    ctx.stroke();
  }

  private drawCurveRight(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.moveTo(x * this.diameter, y * this.diameter + this.diameter / 2);
    ctx.quadraticCurveTo(x * this.diameter + this.diameter / 2, y * this.diameter + this.diameter / 2, x * this.diameter + this.diameter / 2, y * this.diameter + this.diameter);
    ctx.stroke();
  }

  private drawCurveLeftDown(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.moveTo(x * this.diameter + this.diameter / 2, y * this.diameter);
    ctx.quadraticCurveTo(x * this.diameter + this.diameter / 2, y * this.diameter + this.diameter / 2, x * this.diameter + this.diameter, y * this.diameter + this.diameter / 2);
    ctx.stroke();
  }

  private drawCurveRightDown(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.moveTo(x * this.diameter + this.diameter / 2, y * this.diameter);
    ctx.quadraticCurveTo(x * this.diameter + this.diameter / 2, y * this.diameter + this.diameter / 2, x * this.diameter, y * this.diameter + this.diameter / 2);
    ctx.stroke();
  }

  private drawDoor(ctx: CanvasRenderingContext2D, y: number, x: number, path: string): void {
    ctx.fillStyle = "#FFB9FF";
    ctx.fillRect(x * this.diameter, y * this.diameter + this.diameter / 2, this.diameter, this.diameter / 2 - 1);

    if (path.includes('left')) {
      ctx.strokeStyle = '#1B1BD4';
      ctx.beginPath();
      ctx.moveTo(x * this.diameter - 1, y * this.diameter + this.diameter / 2);
      ctx.lineTo(x * this.diameter - 1, y * this.diameter + this.diameter);
      ctx.closePath();
      ctx.stroke();

    } else {
      ctx.strokeStyle = '#1B1BD4';
      ctx.beginPath();
      ctx.moveTo(x * this.diameter + this.diameter + 1, y * this.diameter + this.diameter / 2);
      ctx.lineTo(x * this.diameter + this.diameter + 1, y * this.diameter + this.diameter);
      ctx.closePath();
      ctx.stroke();
    }
  }

  private drawCurveRightHigh(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.moveTo(x * this.diameter, y * this.diameter + 1);
    ctx.quadraticCurveTo(x * this.diameter + this.diameter, y * this.diameter, x * this.diameter + this.diameter - 1, y * this.diameter + this.diameter);
    ctx.stroke();
  }

  private drawCurveLeftDownHigh(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.moveTo(x * this.diameter + 1, y * this.diameter);
    ctx.quadraticCurveTo(x * this.diameter, y * this.diameter + this.diameter, x * this.diameter + this.diameter, y * this.diameter + this.diameter - 1);
    ctx.stroke();
  }

  private drawCurveRightDownHigh(ctx: CanvasRenderingContext2D, y: number, x: number): void {
    ctx.strokeStyle = '#1B1BD4';
    ctx.moveTo(x * this.diameter + this.diameter - 1, y * this.diameter);
    ctx.quadraticCurveTo(x * this.diameter + this.diameter, y * this.diameter + this.diameter, x * this.diameter, y * this.diameter + this.diameter - 1);
    ctx.stroke();
  }
}
