import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface Player{
  name: string,
  date: string,
  time: string,
  score: number
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private genreToPlaylistId: { [key: string]: string } = {
    "rock": "3qu74M0PqlkSV76f98aqTd",
    "rap": "1mjARvpqd27a1RJ1RCkctm",
    "pop": "3ZgmfR6lsnCwdffZUan8EA",
    "country": "47zjmAg8mbMXGno7PQMCD2",
    "electronic": "2qfPqTV3szSn2J1uiSByEX",
    "jazz": "74noNdXFX1lUuB03QDqKFi",
    "classical": "2shU0q1gKzX4dwpYkLFrPw"
  };

  private playerName: string = "Guest";

  private settings = {
    difficulty: 'easy',
    genre: 'classical',
    numberOfSongs: 10
  };

  private gameResults: any = null;

  constructor(private http: HttpClient) { }

  setSettings(difficulty: string, genre: string, numberOfSongs: number): void {
    this.settings.difficulty = difficulty;
    this.settings.genre = genre;
    this.settings.numberOfSongs = numberOfSongs;
    const settingsString = JSON.stringify({
      difficulty: difficulty,
      genre: genre,
      numberOfSongs: numberOfSongs
    });
    localStorage.setItem('gameSettings', settingsString);
  }

  setGameResults(results: any): void {
    this.gameResults = results;
    let existingResults = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    existingResults.push(results);
    existingResults.sort((a: Player, b: Player) => b.score - a.score);
    existingResults = existingResults.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(existingResults));
}

  setPlayerName(name: string){
    this.playerName = name;
    const playerNameString = JSON.stringify({
      "name": name 
    });
    localStorage.setItem('playerName', playerNameString);
  }

  getDifficulty(): string {
    const settingsString = localStorage.getItem('gameSettings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      return settings.difficulty;
    } else {
      return this.settings.difficulty;
    }
  }
  
  getGenre(): string {
    const settingsString = localStorage.getItem('gameSettings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      return settings.genre;
    } else {
      return this.settings.genre;
    }
  }
  
  getNumberOfSongs(): number {
    const settingsString = localStorage.getItem('gameSettings');
    if (settingsString) {
      const settings = JSON.parse(settingsString);
      return settings.numberOfSongs;
    } else {
      return this.settings.numberOfSongs;
    }
  }
  

  getPlaylistIdByGenre(genre: string): string | undefined {
    return this.genreToPlaylistId[genre];
  }

  getGameResults(): any {
    return this.gameResults;
  }

  getPlayerName(): string {
    const playerNameString = localStorage.getItem('playerName');
    if (playerNameString) {
      const name = JSON.parse(playerNameString);
      return name.name;
    } else {
      return this.playerName;
    }
  }
}
