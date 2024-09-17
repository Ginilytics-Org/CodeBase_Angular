import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private _http: HttpClient) { }

  login(form: any) {
    const url = environment.apiUrl + 'Login/Login';
    const headers = new HttpHeaders().set('Skip-intercepter', '');
    const opts: any = { headers };
    return this._http.post<any>(url, form, opts);
  }

  signUp(form:any)
  {
    form.token = "string";
    form.refreshToken = "string";
    form.role="";
    const url = environment.apiUrl + 'Registration/AddUser';
    const headers = new HttpHeaders().set('Skip-intercepter','');
    const opts: any = { headers };
    return this._http.post(url,form,opts);
  }

  ValidateLink(acceptInvite:any){
    const url = environment.apiUrl + 'Invitation/ValidateInvitationToken'
    const headers =  new HttpHeaders().set('Skip-intercepter','');
    const opts: any = { headers };
    return this._http.post(url,acceptInvite,opts);
  }

  AcceptInvite(acceptInvite:any)
  {
    const url = environment.apiUrl + 'Invitation/AcceptInvite'
    const headers =  new HttpHeaders().set('Skip-intercepter','');
    const opts: any = { headers };
    return this._http.post(url,acceptInvite,opts);
  }

  forgetPassword(email: any) {
    const url = environment.apiUrl + 'Account/ForgotPassword';
    const headers = new HttpHeaders().set('Skip-intercepter', '');
  
    const additionalHeaders = { accept: '*/*', 'Content-Type': 'application/json' };

    const mergedHeaders = { ...headers.keys(), ...additionalHeaders };

    const opts: any = { headers };
    return this._http.post(url, email,opts);
  }

  ChangePassword(form:any){
    const url = environment.apiUrl + 'Account/ChangePassword';
    const headers = new HttpHeaders().set('Skip-intercepter','');
    const opts: any = { headers };
    return this._http.post(url,form,opts);
  }
}
