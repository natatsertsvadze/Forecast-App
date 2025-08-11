import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CitiesListComponent } from './cities-list/cities-list.component'
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FilterPageComponent } from "./filter-page/filter-page.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'forecast-app';

  
}
