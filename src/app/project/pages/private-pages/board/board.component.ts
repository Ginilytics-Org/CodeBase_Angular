import { Component } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { LocalService } from '../../../services/local.service';
import { IssueService } from '../../../services/issue.service';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { IssueModalComponent } from '../../../components/issue-modal/issue-modal.component';
import { AddIssueComponent } from '../../../components/add-issue/add-issue.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { JsontocsvService } from '../../../services/jsonToCsv.service';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [MatTooltipModule,CdkDropListGroup, CdkDropList, CdkDrag, MatCardModule, DialogModule, CommonModule,MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  users:any;
  issues: any;
  filterIssue: any;
  id: any
  projectId: any;
  InProgress: any;
  QA: any
  todo: any;
  done: any;
  path: any;
  searchValue: string="";
  documentData: any;
  userId: any;
  exportIssue: any;
  projectKey: any;
  projectName: any;
  loading: boolean= true;
  user = new FormControl('null');

  constructor(private _localStore: LocalService,
    private _issueService: IssueService,
    private sanitizer: DomSanitizer,
    private jsontoCSV: JsontocsvService,
    private _userService:UserService,
    public dialog: Dialog) {
    const Project = this._localStore.getData('Project');
    this.projectId = Project.id;
    this.projectKey = Project.key;
    this.projectName = Project.name;
    const tokenDetail = this._localStore.getData("tokenDetail");
    this.userId = tokenDetail.id;
    this.user.valueChanges.subscribe(selectedUsers => {
    this.filterUserIssues(selectedUsers);
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCurrentIssues();
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.updateIssuePosition(event.item.data, event.container.id)
    }
  }

  getCurrentIssues() {
    this.user.setValue(null);
    this._issueService.getIssueUsingSprintIdProjectId(this.projectId).subscribe(
      (data: any) => {
        this.issues = data;
        this.filterIssue=data;
        this.filter(this.filterIssue);
        this.GetDocuments()
        this.loading=false;
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

  updateIssuePosition(issue: any, status: string) {
    issue.status = status;
    this._issueService.updateIssue(issue).subscribe(
      (data: any) => {
        if(data.status){
          this.getCurrentIssues();
          this.loading = false;
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Issue not updated!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.loading = false;
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
      this.getCurrentIssues();
    })
  }

  createIssueDialog() {
    this.dialog.open(AddIssueComponent, {
      minWidth: '800px',
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getCurrentIssues();
    })
  }

  GetDocuments() {
    this.issues.forEach((element: any) => {
      this._issueService.GetDocuments(element.id).subscribe((data: any) => {
        this.documentData = data.resultData;
        const firstImageDocument = this.documentData.find((document: any) => document.contentType.startsWith('image'));
        if (firstImageDocument) {
          this._issueService.previewDocument(firstImageDocument.path).subscribe((data: Blob) => {
            const blob = new Blob([data], { type: firstImageDocument.contentType });
            const url = window.URL.createObjectURL(blob);
            this.path = url;
            element.path = this.sanitizer.bypassSecurityTrustUrl(url);
          });
        } else {
          element.path = "0";
        }
      });
    });
  }

  previewFile(filepath: string, contentType: string) {
    this._issueService.previewDocument(filepath).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      this.path = url;
      this.path = this.sanitizer.bypassSecurityTrustUrl(url);
    });
  }

  filter(filterIssue:any) {
    this.todo = filterIssue.filter((issue: any) => issue.status == 'To do');
    this.InProgress = filterIssue.filter((issue: any) => issue.status == 'In Progress');
    this.QA = filterIssue.filter((issue: any) => issue.status == 'QA');
    this.done = filterIssue.filter((issue: any) => issue.status == 'Done');
  }

  search(){
    if(this.searchValue !="") {
      this.filterIssue =  this.issues.filter((issue: any) => {
        return (issue.title.toLowerCase().includes(this.searchValue.toLowerCase())||issue.projectIssueKeyId.toLowerCase().includes(this.searchValue.toLowerCase()));
      });
    }
    else{
      this.filterIssue= this.issues;
    }
    this.filter(this.filterIssue);
  }

  myIssues(){
    this.filterIssue =  this.issues.filter((issue: any) => {
      return (issue.assignTo === this.userId);
    });
    this.filter(this.filterIssue);
  }

  ignoreResovled(){
    this.done="";
  }

  clearFilter(){
    this.searchValue="";
    this.filterIssue=this.issues;
    this.filter(this.filterIssue);
  }

  async exportToCSV() {
    this.exportIssue = this.issues.map((issue:any) => {
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

  getUsers(){
    this._userService.getUserByProjectId(this.projectId).subscribe((data: any) => {
      this.users = data.resultData;
      this._localStore.saveData('ProjectUsers',JSON.stringify(this.users));
   });
  }

  assigneeName(assigneeId:any){
    const name=this.users.filter((user:any)=> user.userId==assigneeId)
    return name.length > 0 ? name[0].userName : "unassigned";
  }

  filterUserIssues(selectedUsers:any){
    if (!selectedUsers || selectedUsers.length === 0) {
      if(this.issues !== undefined){
        return this.filter(this.issues);
      }
      else{
        return ;
      }
    }
    var issues = this.issues.filter((issue:any) => selectedUsers.includes(issue.assignTo));
    this.filter(issues)
  }

  getUserById(userId: number) {
    return this.users.find((user:any) => user.id === userId);
  }

}


