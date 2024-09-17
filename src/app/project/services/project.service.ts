import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  getProjectList(UserId: number) {
    const url = this.baseUrl + 'Project/GetProjectsByUserId?UserId=' + UserId;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  addProject(form: any) {
    const url = this.baseUrl + 'Project/AddProject'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, form, opts);
  }

  UploadProjectDocument(data: any) {
    const url = this.baseUrl + 'Issue/UploadFileInProject';
    return this._http.post(url, data);
  }

  updateProject(form: any) {
    const url = this.baseUrl + 'Project/UpdateProject'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.put(url, form);
  }

  DeleteProjectDocument(data: string) {
    const url = this.baseUrl + 'Issue/DeleteProjectDocument?documentId=' + data;
    return this._http.get(url);
  }

  GetProjectDocuments(data: string) {
    const url = this.baseUrl + 'Issue/GetProjectDocumentsByProjectId?projectId=' + data;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  deleteProject(projectId:number){ 
    const url = this.baseUrl + 'Project/DeleteProject?projectid='+ projectId;
    return this._http.delete(url);
   }
}
