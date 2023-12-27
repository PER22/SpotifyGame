import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SettingsComponent } from "./settings/settings.component";
import { GameplayComponent } from "./gameplay/gameplay.component"
import { LeaderBoardComponent } from "./leader-board/leader-board.component";
import { LogoComponent } from './home/logo/logo.component';
import { SharedModule } from "./shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { EntryFormComponent } from './entry-form/entry-form.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'play', component: GameplayComponent },
  { path: 'leaderboard', component: LeaderBoardComponent },
  { path: 'entry', component: EntryFormComponent }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, EntryFormComponent, SettingsComponent, GameplayComponent, LeaderBoardComponent, LogoComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes), SharedModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
