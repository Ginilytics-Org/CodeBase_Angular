import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AddIssueComponent } from '../../add-issue/add-issue.component';
import { LocalService } from '../../../services/local.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isAppAdmin: boolean;
  tokenDetail:any;
  constructor(private dialog:Dialog,public router: Router,private _localStore:LocalService){
    this.tokenDetail = this._localStore.getData("tokenDetail");
    this.isAppAdmin = this.tokenDetail.role == 'admin' ? true : false;
  }

  createIssueDialog() {
    this.dialog.open(AddIssueComponent, {
      minWidth: '800px',
    });
  }
  
  logout(){
    localStorage.clear();
    this.router.navigate(['']);
  }
}
