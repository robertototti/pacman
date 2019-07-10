import {grid} from "./grid";

export class Hero {

  x: number;
  y: number;

  protected ctx: CanvasRenderingContext2D;

  protected __direction: string;

  grid: Array<string[]> = grid;

  constructor(protected diameter: number) {
  }

  protected clear(): void {
    this.ctx.clearRect(this.x - 25, this.y - 25, 50, 50);
  }

  protected move() {
    if (this.__direction === 'up') {
      this.y--;

    } else if (this.__direction === 'down') {
      this.y++;

    } else if (this.__direction === 'left') {
      this.x--;

    } else if (this.__direction === 'right') {
      this.x++;
    }
  }

  protected canGo(direction: string, eat?: boolean): boolean | object {
    let col: number;
    let row: number;
    const i: number = this.diameter / 2 - 0.5;

    if (direction === 'left') {
      col = Math.floor((this.x + i) / this.diameter);
      row = Math.floor((this.y) / this.diameter);

      if (col < 1) {
        if (col < -1) {
          this.x = this.diameter * 28;
        }

      } else {
        // debugger;
        row = Math.floor((this.y - i) / this.diameter);
        if (this.grid[row][col - 1] && this.grid[row][col - 1].includes('wall')) {
          return false;
        }

        row = Math.floor((this.y + i) / this.diameter);
        if (this.grid[row][col - 1] && this.grid[row][col - 1].includes('wall')) {
          return false;
        }
      }

    } else if (direction === 'right') {
      col = Math.floor((this.x - i) / this.diameter);
      row = Math.floor(this.y / this.diameter);

      if (col > 26) {
        if (col > 28) {
          this.x = 0;
        }

      } else {
        row = Math.floor((this.y - i) / this.diameter);
        if (this.grid[row][col + 1] && this.grid[row][col + 1].includes('wall')) {
          return false;
        }

        row = Math.floor((this.y + i) / this.diameter);
        if (this.grid[row][col + 1] && this.grid[row][col + 1].includes('wall')) {
          return false;
        }
      }

    } else if (direction === 'up') {
      row = Math.floor((this.y + i) / this.diameter);
      col = Math.floor(this.x / this.diameter);

      if (col < 1 || col > 26) {
        return false;

      } else {
        col = Math.floor((this.x + i) / this.diameter);
        if (this.grid[row - 1][col].includes('wall')) {
          return false;
        }

        col = Math.floor((this.x - i) / this.diameter);
        if (this.grid[row - 1][col].includes('wall')) {
          return false;
        }
      }

    } else if (direction === 'down') {
      row = Math.floor((this.y - i) / this.diameter);
      col = Math.floor(this.x / this.diameter);

      if (col < 1 || col > 26) {
        return false;

      } else {
        col = Math.floor((this.x - i) / this.diameter);
        if (this.grid[row + 1][col].includes('wall')) {
          return false;
        }

        col = Math.floor((this.x + i) / this.diameter);
        if (this.grid[row + 1][col].includes('wall')) {
          return false;
        }
      }

    } else if (!direction) {
      return false;
    }

    if (eat && this.grid[row][col] && this.grid[row][col] === 'food') {
      const val = this.grid[row][col];
      this.grid[row][col] = '';
      const newGrid = this.grid;
      return {val, newGrid};
    }

    return true;
  }
}
