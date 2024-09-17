import {  HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LocalService } from './local.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  
  constructor(private localStore: LocalService, private router: Router) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.headers.has('Skip-Intercepter'))
    {
      return next.handle(req);
    }
    const tokenDetail = this.localStore.getData('tokenDetail');
    let token = tokenDetail.token;
    if (token) {
      let jwttoken = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });

      return next.handle(jwttoken).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.router.navigate(['']);
          }
          return throwError(error);
        })
      );
    } else {
      this.router.navigate(['']);
      throw new Error('Token not found in localStorage');
    }
  }
}
