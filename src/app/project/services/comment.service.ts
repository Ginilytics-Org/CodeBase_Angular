import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) { 
    this.baseUrl = environment.apiUrl;
  }

  addComment(comment:any){
    const url = this.baseUrl + 'IssueHistory/AddComment'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url, comment, opts);
   }
   
   getCommentByIssueId(issueId:any){
    const url = this.baseUrl + 'IssueHistory/GetCommentIssueById?IssueId='+issueId
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    return this._http.get(url);
   }

   updateComment(comment:any){
    const url = this.baseUrl + 'IssueHistory/UpdateComment'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.post(url,comment,opts);
  }

  deleteComment(id:number){
    const url = this.baseUrl + 'IssueHistory/DeleteComment?id='+id;
    return this._http.delete(url);
  }
}
