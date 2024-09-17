import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  addIssue(issue: any) {
    const url = this.baseUrl + 'Issue/AddIssue'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, issue, opts);
  }

  addEpic(epic: any) {
    const url = this.baseUrl + 'Issue/AddEpic'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, epic, opts);
  }

  getEpic(projectId: any) {
    const url = this.baseUrl + 'Issue/GetEpics?projectId=' + projectId;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  getIssueUsingSprintIdProjectId(projectId: any) {
    const url = this.baseUrl + 'Issue/GetIssueByIds?ProjectId=' + projectId
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  getIssueWithFilters(filter: any) {
    const url = this.baseUrl + 'Issue/GetAllIssues'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, filter, opts);
  }

  updateIssue(issue: any) {
    const url = this.baseUrl + 'Issue/UpdateIssuePosition'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, issue);
  }

  deleteIssues(issue: any) {
    const url = this.baseUrl + 'Issue/DeleteIssue?id=' + issue;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.delete(url);
  }

  GetDocuments(data: string) {
    const url = this.baseUrl + 'Issue/GetDocumentsByIssueId?issueId=' + data;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  UploadDocument(data: any) {
    const url = this.baseUrl + 'Issue/UploadFileInIssue';
    return this._http.post(url, data);
  }

  UploadProjectDocument(data: any) {
    const url = this.baseUrl + 'Issue/UploadFileInProject';
    return this._http.post(url, data);
  }


  DownloadDocument(data: string) {
    const url = this.baseUrl + 'Issue/DownloadDocument?filePath=' + data;
    return this._http.get(url, { observe: 'response', responseType: 'blob' });
  }

  previewDocument(data: string) {
    const url = this.baseUrl + 'Issue/DownloadDocument?filePath=' + data;
    return this._http.get(url, { responseType: 'blob' });
  }

  DeleteDocument(data: string) {
    const url = this.baseUrl + 'Issue/DeleteDocument?documentId=' + data;
    return this._http.get(url);
  }
}
