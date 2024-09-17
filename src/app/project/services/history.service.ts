import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) { 
    this.baseUrl = environment.apiUrl;
  }

  GetHistoriesByIssueId(issueId:any) { 
    const url = this.baseUrl + 'History/GetHistoriesByIssueId?IssueId='+issueId;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }
}
