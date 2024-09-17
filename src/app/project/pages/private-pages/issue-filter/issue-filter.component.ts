import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SortPipe } from '../../../../core/pipes/sort.pipe';
import { IssueService } from '../../../services/issue.service';
import { JsontocsvService } from '../../../services/jsonToCsv.service';
import { LocalService } from '../../../services/local.service';
import { SprintService } from '../../../services/sprint.service';
import { ProjectService } from '../../../services/project.service';
import { IssueModalComponent } from '../../../components/issue-modal/issue-modal.component';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-issue-filter',
  standalone: true,
  imports: [CommonModule, FormsModule,SortPipe,MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './issue-filter.component.html',
  styleUrl: './issue-filter.component.css'
})
export class IssueFilterComponent implements OnInit{
  allIssue: any;
  isSearchEmpty!: boolean;
  totalItems: any;
  totalPages: any;
  pageSize: any = 20;
  pageNumber: number = 1;
  sortField!: string;
  sortAscending: boolean=true;
  searchValue: string = '';
  filterIssue: any;
  project = new FormControl<number[]>([]);
  status=new FormControl('')
  type=new FormControl('')
  sprint=new FormControl('')
  user=new FormControl('')
  projectList: any[] = [];
  statusList: any[] = ['To Do', 'In Progress', 'QA', 'Done'];
  typeList: any[] = ['Task', 'Bug', 'Story'];
  sprintList: any[] = [];
  userId:any;
  projectId:any;
  exportIssue: any;
  projectKey: any;
  projectName: any;
  loading: boolean= true;
  users:any;

  constructor(
    private _issueService:IssueService,
    private _projectService:ProjectService,
    private _sprintService:SprintService,
    private _localStore:LocalService,
    private jsontoCSV:JsontocsvService,
    private _userService :UserService,
    private dialog:Dialog){
    const tokenDetail = this._localStore.getData("tokenDetail");
    const Project = this._localStore.getData('Project');
    this.userId=tokenDetail.id;
    this.projectId=Project.id;
    this.projectKey=Project.key;
    this.projectName=Project.name;
  }

  ngOnInit(): void {
    this.project.setValue([this.projectId]);
    this.filters.projectId=this.projectId.toString();
    this.getAllIssues();
    this.projectListData();
    this.getSprintsList();
    this.getUsers();
  }
  getUsers(){
    this._userService.getUserByProjectId(this.projectId).subscribe((data: any) => {
      this.users = data.resultData;
      this._localStore.saveData('ProjectUsers',JSON.stringify(this.users));
   });
   }
  applyFilter() {
    this.filters.assignTo = this.arrayToString(this.user.value);
    this.filters.projectId = this.arrayToString(this.project.value);
    this.filters.issueStatus = this.arrayToString(this.status.value);
    this.filters.issueType = this.arrayToString(this.type.value);
    this.filters.selectedSprint = this.arrayToString(this.sprint.value);
    this.getAllIssues();
  }
  
  arrayToString(value: any | null): string {
    var result=value ? value.join(',') : '';
    return result
  }
  

  filters = {
    "pageNumber": 1,
    "pageSize": 50,
    "projectId": "",
    "issueType": "",
    "issueStatus": "",
    "assignTo": "",
    "searchTerm": "",
    "selectedSprint":""
  }

  getAllIssues() {
    if (this.filters.pageNumber == 0) {
      this.filters.pageNumber = 1;
    }
    this._issueService.getIssueWithFilters(this.filters).subscribe(
      (data: any) => {
        if(data.status){
          this.allIssue=data.resultData;
          if (this.allIssue?.length === 0) {
            this.isSearchEmpty = true;
          }
          this.totalItems= data.metaData.totalCount;
          this.totalPages = data.metaData.totalPages;
            // Update the current page if it exceeds the total number of pages
          if (this.filters.pageNumber > this.totalPages) {
            this.filters.pageNumber = this.totalPages;
          }
          this.loading=false;
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Issue cannot be fetched!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.loading=false
        }
      },
      (error: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'error',
          timer: 5000,
          title: error,
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.loading = false;
      }
    );
  }

  openDialog(issue: any) {
    this.dialog.open(IssueModalComponent, {
      minWidth: '300px',
      data: {
        issue: issue
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getAllIssues();
    })
  }

  sortTable(field: string): void {
    // if (field === 'name') {
    //   this.sortName = !this.sortName;
    // }
    // else if (field === 'key') {
    //   this.sortKey = !this.sortKey;
    // }
    // else if (field === 'access') {
    //   this.sortAccess = !this.sortAccess;
    // }
    // else if (field === 'categoryName') {
    //   this.sortCategoryName = !this.sortCategoryName;
    // }
    // else if (field === 'created_By') {
    //   this.sortCreated_By = !this.sortCreated_By;
    // }
    // else {
    //   this.sortCreated_at = !this.sortCreated_at;
    // }
    // if (this.sortField === field) {
    //   this.sortAscending = !this.sortAscending;
    // } else {
    //   this.sortField = field;
    //   this.sortAscending = true;
    // }
  }

  goToPage(page: number | string) {
    if (typeof page === 'number') {
      page = Number(page);
      if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
        this.pageNumber = page;
      }
    }
  }

  totalPageCount(): (number | string)[] {
    const limit = 2; // Set the desired limit of page numbers to display
    const ellipsis = '...'; // Define the ellipsis character or string

    let startPage = Math.max(1, this.pageNumber);
    let endPage = Math.min(startPage + limit - 1, this.totalPages);

    if (endPage - startPage + 1 < limit) {
      startPage = Math.max(1, endPage - limit + 1);
    }

    const pageNumbers: (number | string)[] = [];
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push(ellipsis);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pageNumbers.push(ellipsis);
      }
      pageNumbers.push(this.totalPages);
    }

    return pageNumbers;
  }

  get filteredData() {
    if (this.allIssue != undefined) {
      if (this.pageNumber == 0) {
        this.pageNumber = 1;
      }
      this.isSearchEmpty = false;
      this.filterIssue = this.allIssue.filter((project: any) =>
        project.title.toLowerCase().includes(this.searchValue.toLowerCase()));
      this.totalItems = this.filterIssue.length;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      if (this.pageNumber > this.totalPages) {
        this.pageNumber = this.totalPages;
      }
      const startIndex = (this.pageNumber - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      if (this.totalItems == 0) {
        this.isSearchEmpty = true;
      }

      return this.filterIssue.slice(startIndex, endIndex);
    }
  }

  projectListData(){
    this._projectService.getProjectList(this.userId).subscribe(
      (data:any)=> {
        if(data.status){
          this.projectList=data.resultData;
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Project data cannot be fetched!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
      },
      (error: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'error',
          timer: 5000,
          title: error,
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.loading = false;
      }
    ); 
  }
  
  getSprintsList(){
    this._sprintService.getSprintsByProjectId(this.projectId).subscribe(
      (data:any)=> {
        if(data.status){
          this.sprintList = data.resultData;
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Sprint data cannot be fetched!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
      },
      (error: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'error',
          timer: 5000,
          title: error,
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.loading = false;
      }
    ); 
  }

  async exportToCSV() {
    this.exportIssue = this.allIssue.map((issue:any) => {
      // const assigneeUser = this.users.find(user => user.userId === issue.assignTo);
      // const reporterUser = this.users.find(user => user.userId === issue.reportTo);
      // const createdBy = this.users.find(user => user.userId === issue.createdBy);
      // const modifiedBy = this.users.find(user => user.userId === issue.modifiedBy);
      return {
        Summary: issue.title,
        IssueId: issue.id,
        IssueKey: issue.projectIssueKeyId,
        IssueType: issue.type,
        IssueStatus: issue.status,
        IssuePriority: issue.priority,
        ProjectKey: this.projectKey,
        ProjectName: this.projectName,
        // Assignee: assigneeUser ? assigneeUser.userName : 'Unassigned',
        Epic: issue.epicTitle!=null ? issue.epicTitle: 'None',
        TimeEstimate: issue.timeEstimate != null?issue.timeEstimate:0,
        TimeSpent: issue.timeSpent != null?issue.timeSpent:0,
        // CreatedBy: createdBy ? createdBy.userName : 'None',
        CreatedDate: issue.createdDate,
        // ModifiedBy: modifiedBy ? modifiedBy.userName : 'None',
        ModifiedDate: issue.modifiedDate !=null?issue.modifiedDate:'None'
      };
    });
    this.jsontoCSV.downloadFile(this.exportIssue,this.projectName);
  }
}
