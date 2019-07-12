import {Component, HostListener, OnInit} from '@angular/core';
import {Pacman} from "./shared/pacman";
import {GameArea} from "./shared/game-area";
import {Subscription} from "rxjs";
import {Ghost} from "./shared/ghost";
import {MatDialog} from "@angular/material";
import {AlertComponent} from "./alert/alert.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  diameter = 14;
  row = 33;
  col = 28;
  score = 0;

  pacman: Pacman;

  gameArea: GameArea;

  areUpdSub: Subscription;

  blinky: Ghost;
  pinky: Ghost;
  inky: Ghost;
  clyde: Ghost;
  food: number = 0;

  record: object[] = [];

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.changeTheme(localStorage.getItem('theme'));
    this.getRecord();

    this.gameArea = new GameArea(this.diameter, this.col, this.row);
    this.gameArea.init();
    this.gameArea.fps = 48;
    this.gameArea.ready = true;

    this.pacman = new Pacman(this.diameter, this.col, this.row);
    this.pacman.init();
    this.pacman.resetFood();

    this.blinky = new Ghost('blinky', this.diameter, this.col, this.row);
    this.pinky = new Ghost('pinky', this.diameter, this.col, this.row);
    this.inky = new Ghost('inky', this.diameter, this.col, this.row);
    this.clyde = new Ghost('clyde', this.diameter, this.col, this.row);
    this.ghostInit();
  }

  gameAreaUpdate(): void {
    this.areUpdSub = this.gameArea.update().subscribe(() => {
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

      if (this.pacman.updateFood) {
        this.gameArea.grid = this.pacman.grid;
        this.gameArea.foodDraw();
        this.score += 10;
        ++this.food;

        if (this.food === 244) {
          this.areUpdSub.unsubscribe();
          ++this.gameArea.level;
          this.gameArea.startGame = false;
          this.food = 0;
          this.ghostInit();
          this.pacman.init();
          this.pacman.resetFood();
          this.gameArea.grid = this.pacman.grid;
          this.gameArea.foodDraw();
          this.gameArea.fps += 24;
        }
      }

      if (this.blinky.canEat() || this.pinky.canEat() || this.inky.canEat() || this.clyde.canEat()) {
        this.gameOver();
      }
    });
  }

  gameOver(): void {
    this.areUpdSub.unsubscribe();
    this.gameArea.startGame = false;
    this.pacman.healthPoints.pop();
    if (this.pacman.healthPoints.length) {
      this.ghostInit();
      this.pacman.init();

    } else {
      this.gameArea.ready = false;
      const dialogRef = this.dialog.open(AlertComponent);

      dialogRef.afterClosed().subscribe(val => {
        if (val.name) {
          this.record.push({name: val.name, score: this.score});
          this.score = 0;
          this.record.sort((a, b) => {
            if (a['score'] < b['score']) {
              return 1;

            } else if (a['score'] > b['score']) {
              return -1;

            } else {
              return 0;
            }
          });

          localStorage.setItem('record', JSON.stringify(this.record));
          this.record.length = 3;
          this.gameArea.ready = true;
        }
      });

      this.ghostInit();
      this.pacman.healthPoints = ['lifepoint', 'lifepoint', 'lifepoint'];
      this.pacman.init();
      this.gameArea.fps = 48;
      this.gameArea.level = 1;
      this.pacman.resetFood();
      this.gameArea.grid = this.pacman.grid;
      this.gameArea.foodDraw();
      this.food = 0;
    }
  }

  ghostInit(): void {
    this.blinky.init();
    this.pinky.init();
    this.inky.init();
    this.clyde.init();
  }

  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if (!this.gameArea.startGame && event.code === 'Enter' && this.gameArea.ready) {
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

  getRecord(): void {
    const record = JSON.parse(localStorage.getItem('record'));
    if (record) {
      this.record = record;
    }
  }
}
