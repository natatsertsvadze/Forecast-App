import { Component } from '@angular/core'
import { CommonModule } from "@angular/common"
import { Router,  } from "@angular/router"

@Component({
  selector: 'app-master-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css']
})
export class MasterPageComponent {
  constructor(private router: Router) {}

  navigateToList() {
    this.router.navigate(['/list']);
  }

  navigateToFilter() {
    this.router.navigate(['/filter'])
  }
  
}
