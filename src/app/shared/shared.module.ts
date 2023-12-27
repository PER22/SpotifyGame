import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavButtonComponent } from './nav-button/nav-button.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NavButtonComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [NavButtonComponent] 
})
export class SharedModule { }
