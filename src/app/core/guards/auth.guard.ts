import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalService } from '../../project/services/local.service';
@Injectable({
  providedIn: 'root',
  
})
export class AuthGuard  {
  constructor(private router: Router,private localStore:LocalService,) {}
  canActivate(): boolean {
    const tokenDetail=this.localStore.getData('tokenDetail');
    const isAuthenticated = !!tokenDetail.token;

    if (!isAuthenticated) {
      this.router.navigate(['']);
      
      return false;
    }
    
    return true;
  }
  }

