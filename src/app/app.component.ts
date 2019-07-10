import {Component, HostListener, OnInit} from '@angular/core';
import {Pacman} from "./shared/pacman";
import {GameArea} from "./shared/game-area";
import {Subscription} from "rxjs";
import {Ghost} from "./shared/ghost";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  diameter = 14;
  row = 31;
  col = 28;
  fps = 75;
  score = 0;

  pacman: Pacman;

  gameArea: GameArea;

  areUpdSub: Subscription;

  blinky: Ghost;
  pinky: Ghost;
  inky: Ghost;
  clyde: Ghost;

  gameOverAlert: boolean;

  constructor() {
  }

  ngOnInit(): void {
    this.changeTheme(localStorage.getItem('theme'));

    this.gameArea = new GameArea(this.diameter, this.col, this.row, this.fps);
    this.gameArea.init();

    this.pacman = new Pacman(this.diameter, this.col, this.row);
    this.pacman.init();

    this.blinky = new Ghost('blinky', this.diameter, this.col, this.row);
    this.pinky = new Ghost('pinky', this.diameter, this.col, this.row);
    this.inky = new Ghost('inky', this.diameter, this.col, this.row);
    this.clyde = new Ghost('clyde', this.diameter, this.col, this.row);
    this.blinky.init();
    this.pinky.init();
    this.inky.init();
    this.clyde.init();
  }

  gameAreaUpdate(): void {
    this.areUpdSub = this.gameArea.update().subscribe(() => {
      if (this.gameArea.startGame) {
        this.pacman.update();
        this.blinky.update();
        this.blinky.cordPacman = {x: this.pacman.x, y: this.pacman.y};
        this.pinky.cordPacman = {x: this.pacman.x, y: this.pacman.y};
        this.inky.cordPacman = {x: this.pacman.x, y: this.pacman.y};
        this.clyde.cordPacman = {x: this.pacman.x, y: this.pacman.y};

        if (this.pinky.ready) {
          this.pinky.update();
        }

        if (this.inky.ready) {
          this.inky.update();
        }

        if (this.clyde.ready) {
          this.clyde.update();
        }

        if (this.blinky.canEat() || this.pinky.canEat() || this.inky.canEat() || this.clyde.canEat()) {
          this.areUpdSub.unsubscribe();
          this.gameOverAlert = true;

        } else if (this.score === 2440) {
          this.areUpdSub.unsubscribe();
        }

        if (this.pacman.updateFood) {
          this.gameArea.grid = this.pacman.grid;
          this.gameArea.foodDraw();
          this.score += 10;
        }
      }
    });
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (!this.gameArea.startGame && event.code === 'Enter') {
      this.gameArea.startGame = true;
      this.gameAreaUpdate();
      this.pinky.start();
      this.inky.start();
      this.clyde.start();

    } else if (this.gameArea.startGame) {
      if (event.code.includes('KeyW')) {
        this.pacman.direction = 'up';

      } else if (event.code.includes('KeyS')) {
        this.pacman.direction = 'down';

      } else if (event.code.includes('KeyA')) {
        this.pacman.direction = 'left';

      } else if (event.code.includes('KeyD')) {
        this.pacman.direction = 'right';
      }
    }
  }

  changeTheme(theme: string): void {
    const body = document.body.classList;

    if (theme === 'light') {
      localStorage.setItem('theme', theme);
      body.remove('darkTheme');
      body.add('lightTheme');

    } else {
      localStorage.setItem('theme', theme);
      body.remove('lightTheme');
      body.add('darkTheme');
    }
  }
}
