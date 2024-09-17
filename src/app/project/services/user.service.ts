import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getUser() {
    const url = this.baseUrl + 'User/GetUsers'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  getUserByProjectId(projectId: any) {
    const url = this.baseUrl + 'ProjectUser/GetUserByProjectID?projectId=' + projectId
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  getUserById(id: any) {
    const url = this.baseUrl + 'User/GetUserById?id=' + id
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  updateUser(data: any) {
    const url = this.baseUrl + 'User/UpdateUser'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.put(url, data, opts);
  }

  registerUser(form: any) {
    form.token = "string";
    form.refreshToken = "string";
    form.role = "";
    const url = environment.apiUrl + 'Registration/AddUser';
    const headers = { accept: '*/*', 'Content-Type': 'application/json', 'No-Auth': 'False' };
    const opts: any = { headers };
    return this._http.post(url, form, opts);
  }

  updateRole(userId: any, projectId: any, roleId: any) {
    const url = this.baseUrl + 'ProjectUser/UpdateProject?userId=' + userId + '&projectId=' + projectId + '&roleId=' + roleId
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.put(url, opts);
  }

  removeUser(userId: any, projectId: any) {
    const url = this.baseUrl + 'ProjectUser/removeUser?userId=' + userId + '&projectId=' + projectId
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.put(url, opts);
  }

  AddUserInProject(user: any) {
    const url = this.baseUrl + 'Invitation/SendInvitation'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, user, opts);
  }
}
