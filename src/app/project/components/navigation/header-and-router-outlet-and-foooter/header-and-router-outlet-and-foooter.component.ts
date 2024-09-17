import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-and-router-outlet-and-foooter',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterOutlet, CommonModule],
  templateUrl: './header-and-router-outlet-and-foooter.component.html',
  styleUrl: './header-and-router-outlet-and-foooter.component.css'
})
export class HeaderAndRouterOutletAndFoooterComponent {
  isSidebarCollapsed: boolean = false;

  receiveDataFromChild(data: boolean) {
    this.isSidebarCollapsed = data;
  }
}
