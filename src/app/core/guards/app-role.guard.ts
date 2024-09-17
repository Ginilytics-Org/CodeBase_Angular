import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalService } from '../../project/services/local.service';

@Injectable({
  providedIn: 'root'
})
export class AppRoleGuard  {
    constructor(
      private _localStore: LocalService,
      private router: Router,
    ) { }
  
    canActivate(
      route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const allowedRoles = route.data['allowedRoles'] as number[];
      const tokenDetail = this._localStore.getData('tokenDetail');
      var currentUserRole =0 ;
        if(tokenDetail.role =="admin"){
             currentUserRole =1
        };
      if (allowedRoles && allowedRoles.includes(currentUserRole)) {
        // User has the required role, allow access to the route
        return true;
      } else {
        // User does not have the required role, redirect to a different route or show an error message
        this.router.navigate(["/project"]);
        return false;
      }
    }
  }
  