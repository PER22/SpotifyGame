import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

interface Player{
  name: string,
  date: string,
  time: string,
  score: number
}
@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.css']
})
export class LeaderBoardComponent implements OnInit {
  players: Player[] = []
  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.loadLeaderboard();
    this.sortTheRank();
  }

  loadLeaderboard() {
    const storedResults = localStorage.getItem('leaderboard');
    if (storedResults) {
      this.players = JSON.parse(storedResults);
    }
  }

  sortTheRank() {
    this.players.sort(function (r1,r2) {
      return r2.score -r1.score;
    });
  }

  navigateToPlay(){
    this.router.navigateByUrl("/play");
  }

  navigateToHome(){
    this.router.navigateByUrl("/home");
  }

}