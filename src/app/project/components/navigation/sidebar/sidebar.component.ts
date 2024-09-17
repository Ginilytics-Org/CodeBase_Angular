import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocalService } from '../../../services/local.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Output() dataToParent = new EventEmitter<boolean>();
  resizer: boolean = false;
  hideText: boolean = false;
  project: any;
  isAppAdmin: boolean;

  constructor(private router: Router,
    private _localStore: LocalService) {
    this.project = this._localStore.getData('Project');
    const tokenDetail = this._localStore.getData("tokenDetail");
    this.isAppAdmin = tokenDetail.role == 'admin' ? true : false;
  }

  resize() {
    this.resizer = !this.resizer;
    this.dataToParent.emit(this.resizer);
    if (this.resizer) {
      this.hideText = true;
      // 1000 milliseconds = 1 second
    }
    else {
      setTimeout(() => {
        this.hideText = false;
      }, 800);
    }
  }
}
