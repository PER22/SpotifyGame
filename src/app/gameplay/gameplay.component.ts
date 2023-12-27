import { Component, OnInit } from '@angular/core';
import { Howl } from 'howler';
import fetchFromSpotify from 'src/services/api';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.css']
})
export class GameplayComponent implements OnInit {
  currentScore: number = 0;
  elapsedTime: number = 0;
  totalElapsedTime: number = 0;
  currentSong: any = null;
  options: string[] = [];
  private sound: Howl | null = null;
  playlist: any;
  quiz: any[] = [];
  numberCorrect: number = 0;
  numberIncorrect: number = 0;
  pointsPerQuestion = 20;
  numberOfSongs: number = 20;
  difficulty: string = "easy";
  timePerQuestion: number = 30;
  timer: any;
  timeRemaining: number = 0;
  canReplay: boolean = true;
  infinity: number = Infinity;
  currentQuestionNumber: number = 0;
  floor: Function = Math.floor;
  displayModal: boolean = false;
  winOrLoss: boolean = false;

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    if(!localStorage.getItem('gameSettings')){
      this.router.navigateByUrl("settings"); 
      return;
    }
    this.numberOfSongs = this.dataService.getNumberOfSongs();
    this.difficulty = this.dataService.getDifficulty();
    this.fetchSongsByGenre(this.dataService.getGenre());
    this.configureQuizBasedOnDifficulty();
    this.playSong()
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private fetchSongsByGenre(genre: string): void {
    const token = localStorage.getItem('whos-who-access-token');
    if (token) {
      const playlistId = this.dataService.getPlaylistIdByGenre(genre);
      if (playlistId) {
        fetchFromSpotify({
          token: JSON.parse(token).value,
          endpoint: `playlists/${playlistId}/tracks`,
          params: {
            market: 'US',
          }
        })
          .then(playlistData => {
            this.processPlaylistData(playlistData);
          })
          .catch(error => console.error('Error fetching songs:', error));
      } else {
        console.error(`No playlist ID found for genre: ${genre}`);
      }
    } else {
      console.error('No Spotify token found');
    }
  }

  configureQuizBasedOnDifficulty(): void {
    switch (this.difficulty) {
      case 'easy':
        this.timePerQuestion = Infinity;
        this.canReplay = true;
        break;
      case 'medium':
        this.timePerQuestion = 45;
        this.canReplay = true;
        break;
      case 'hard':
        this.timePerQuestion = 30;
        this.canReplay = false;
        break;
      default:
        this.timePerQuestion = 30;
        this.canReplay = false;
        break;
    }
    this.startTimer();
  }

  startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timeRemaining = this.timePerQuestion;

    this.timer = setInterval(() => {
      if (this.timePerQuestion !== Infinity) {
        this.timeRemaining--;
      }
      this.elapsedTime++;
      if (this.timeRemaining <= 0) {
        clearInterval(this.timer);
        this.handleTimeOut();
      }
    }, 1000);

  }

  handleTimeOut(): void {
    console.log("Timer ended")
    this.iterateToNextQuestion();
    this.numberIncorrect += 1;
  }


  private processPlaylistData(playlistData: any): void {
    this.playlist = playlistData.items
      .filter((item: { track: { preview_url: null; }; }) => item.track.preview_url != null)
      .sort(() => Math.random() - 0.5)
      .splice(0, this.numberOfSongs)
      .map((item: { track: { name: any; artists: any[]; album: { name: any; }; preview_url: any; }; }) => ({
        title: item.track.name,
        artist: item.track.artists.map(artist => artist.name).join(", "),
        album: item.track.album.name,
        preview_url: item.track.preview_url
      }));
    this.generateQuizQuestions();
  }

  private generateQuizQuestions(): void {
    if (!this.playlist || this.playlist.length < 4) {
      console.error('Not enough songs in the playlist to generate a quiz');
      return;
    }

    for (let i = 0; i < this.numberOfSongs; i++) {
      // Randomly select a song as the correct answer
      const correctAnswerIndex = Math.floor(Math.random() * this.playlist.length);
      const correctAnswer = this.playlist[correctAnswerIndex];

      // Create a set to store indices of selected incorrect answers
      const selectedIndices = new Set<number>();
      selectedIndices.add(correctAnswerIndex);

      // Randomly select three incorrect answers
      while (selectedIndices.size < 4) {
        const index = Math.floor(Math.random() * this.playlist.length);
        selectedIndices.add(index);
      }

      // Map the selected indices to song info
      let quizOptions = Array.from(selectedIndices).map(index => this.playlist[index]);
      quizOptions.sort(()=>Math.random() - 0.5);

      // Structure the quiz question
      this.quiz.push(
        {
          previewUrl: correctAnswer.preview_url,
          options: quizOptions,
          correctTitle: correctAnswer.title
        }
      );

    }
  }


  playSong(): void {
    if (this.quiz && this.quiz[this.currentQuestionNumber].previewUrl) {
      if (this.sound) {
        this.sound.unload();
      }

      this.sound = new Howl({
        src: [this.quiz[this.currentQuestionNumber].previewUrl],
        html5: true
      });

      this.sound.play();
    } else {
      console.error('No preview URL available for the current question');
    }
  }

  pauseSong(): void {
    if (this.sound) {
      this.sound.pause();
    }
  }

  iterateToNextQuestion(): void {
    // Increment the question number
    this.currentQuestionNumber += 1;

    // Check if the current question number has reached the number of songs (end of quiz)
    if (this.currentQuestionNumber >= this.numberOfSongs) {
      this.currentQuestionNumber = 0;
      this.endGame();
    } else {
      // Reset the timer for the next question
      this.resetTimer();

      // Play the next song
      if(this.playlist[this.currentQuestionNumber]){
        this.playSong();
      }
      
    }
  }

  private resetTimer(): void {
    // Stop the current timer
    clearInterval(this.timer);

    // Reset the time remaining and elapsed time for the next question
    this.timeRemaining = this.timePerQuestion;
    this.elapsedTime = 0;

    // Start the timer again
    this.startTimer();
  }

  answer(selectedOption: string): void {

    if (selectedOption == this.quiz[this.currentQuestionNumber].correctTitle) {
      this.numberCorrect += 1;
    }
    else {
      this.numberIncorrect += 1;
    }
    this.totalElapsedTime += this.elapsedTime;
    this.iterateToNextQuestion();
  }

  endGame(): void {
    this.pauseSong();
    let dateObject = new Date();
    let date = dateObject.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
    let results = {
      name: this.dataService.getPlayerName(),
      date,
      time: this.totalElapsedTime,
      score: this.pointsPerQuestion * this.numberCorrect
    };
    this.dataService.setGameResults(results);
    if (this.numberCorrect >= this.numberOfSongs / 2) {
      this.winOrLoss = true;
      
    }
    else {
      this.winOrLoss = false;
    }
    this.displayModal = true;
    clearInterval(this.timer);
  }

  goToLeaderBoard() {
    this.router.navigateByUrl("/leaderboard");
  }

  playAgain(){
    location.reload();
  }

  changeSettings(){
    this.router.navigateByUrl("/settings");
  }
}
