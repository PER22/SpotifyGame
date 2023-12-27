import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService as DataService } from '../data.service'; // Import your data service
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settings = {
    difficulty: 'easy',
    genre: 'classical',
    numberOfSongs: '10'
  };

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(){
    
  }

  submitSettings(): void {
    const numberOfSongs = parseInt(this.settings.numberOfSongs);
    if (isNaN(numberOfSongs)) {
      alert('Please enter a valid number for the number of songs');
      return;
    }
    this.dataService.setSettings(this.settings.difficulty, this.settings.genre, numberOfSongs);
    
    this.router.navigateByUrl("/entry");
  }
}
