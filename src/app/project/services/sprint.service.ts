import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) { 
    this.baseUrl = environment.apiUrl;
  }


  currentSprint(Project: number) {

    const url = this.baseUrl + 'Sprint/GetLastSprintByProjectId?ProjectId='+Project;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  updateSprint(sprint: any) {

    const url = this.baseUrl + 'Sprint/MakeSprintActive';
    // const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    // const opts: any = { headers };
    return this._http.put(url,sprint);
  }

  postSprints(data:any){
    const url = this.baseUrl+'Sprint/AddSprint'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
     return this._http.post(url,data,opts);
  }

  futureSprint(Project: number) {
    const url = this.baseUrl + 'Sprint/GetFutureSprintUsingProjectId?ProjectId='+Project;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  moveIssueBacklog(projectId:number,sprintId:number,projectSprintId:number) {
    const url = this.baseUrl + 'Sprint/MoveIssueToBacklog?ProjectSprintId='+projectSprintId+'&ProjectId='+projectId+'&SprintId='+sprintId;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, opts);
  }

  moveIssueNextSprint(projectId:number,sprintId:number,projectSprintId:number) {
    const url = this.baseUrl + 'Sprint/MoveIssueToNextSprint?ProjectSprintId='+projectSprintId+'&ProjectId='+projectId+'&SprintId='+sprintId;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, opts);
  }

  getBacklogs(Project:any){
    const url = this.baseUrl +'Issue/GetIssueByBacklog?ProjectId='+Project;
    return this._http.get(url);
  }

  getSprintsByProjectId(projectId:number){
    const url = this.baseUrl + 'Sprint/GetSprintByProjectId?ProjectId='+projectId;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url,opts);
  }
}
