import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit {

  entryForm: FormGroup = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(3)])
  })

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    
  }

  onClick() {
    let playerName = this.entryForm.get('name')?.value;
    if (playerName) {
      this.dataService.setPlayerName(playerName);
      this.router.navigateByUrl("/play");
    } else {
      console.error('Player name is not set');
    }
  }



}
