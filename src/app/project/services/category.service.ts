import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl: string | undefined;
  constructor(private _http: HttpClient) { 
    this.baseUrl = environment.apiUrl;
  }

  getCategory() {
    const url = this.baseUrl + 'Category/GetCategory'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }

  addCategory(data:any){
    const url = this.baseUrl+'Category/AddCategory'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
     return this._http.post(url,data,opts);
  }
  updateCategory(data: any) {
    const url = this.baseUrl + 'Category/UpdateCategory'
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.put(url, data, opts);
  }

  deleteCategory(categoryId: any) {
    const url = this.baseUrl + 'Category/DeleteCategory?id=' + categoryId
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.delete(url, opts);
  }

  getProjectsByCategoryId(CategoryId: string) {
    const url = this.baseUrl + 'Project/GetProjectsByCategoryId?CategoryId=' + CategoryId;
    const headers = { accept: '*/*', 'Content-Type': 'application/json' };
    const opts: any = { headers };
    return this._http.get(url);
  }
}
