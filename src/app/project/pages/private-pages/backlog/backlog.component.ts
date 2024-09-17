import { Component, OnInit } from '@angular/core';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { StartSprintComponent } from '../../../components/start-sprint/start-sprint.component';
import { LocalService } from '../../../services/local.service';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IssueModalComponent } from '../../../components/issue-modal/issue-modal.component';
import { CompleteSprintModalComponent } from '../../../components/complete-sprint-modal/complete-sprint-modal.component';
import { IssueService } from '../../../services/issue.service';
import { SprintService } from '../../../services/sprint.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-backlog',
  standalone: true,
  imports: [StartSprintComponent,CdkDropListGroup, CdkDropList, CdkDrag, DialogModule,CdkDropListGroup, CdkDropList, CdkDrag,ReactiveFormsModule,FormsModule],
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.css'
})
export class BacklogComponent implements OnInit {
  CreateEpic: any = {
    title: '',
    projectId: ''
  }
  currentSprintIssue:any;
  currentSprintData: any;
  ProjectId: any;
  futureSprints: any;
  issueBacklogList: any;
  issueTypes: string[] = ["Task", "Bug", "Story"];
  task = new FormControl('',[Validators.required]);
  title = new FormControl('',[Validators.required]);
  toggleCreateBacklog =false;
  toggleCreateSprint =false;
  toggleBacklog =true;
  toggleSprint =true;
  toggleEpic = true;
  toggleCreateEpic=false;
  epicList: any;
  users: any;
  loading: boolean= true;

  constructor(
    private _localStore: LocalService, 
    private _issueService:IssueService, 
    private _sprintService:SprintService,
    private dialog:Dialog){
    const Project = this._localStore.getData('Project');
    this.ProjectId=Project.id;
  }

  ngOnInit() {
    this.getCurrentSprint();
    this.getCurrentSprintIssue();
    this.getFutureSprint();
    this.callBacklogIssue();
    this.getEpicList();
  }

  isStringOnlySpaces(inputString: string): boolean {
    return /^\s*$/.test(inputString);
  }

  addEpic(){
    if (this.isStringOnlySpaces(this.CreateEpic.title)) {
        window.alert(
        'Epic title cannot be empty.' 
      );
      return;
    }
    const tokenDetail=this._localStore.getData('tokenDetail');
    this.toggleCreateEpic = false
    this.CreateEpic.projectId = this.ProjectId;
    this.CreateEpic.reportTo=tokenDetail.id;
    this._issueService.addEpic(JSON.stringify(this.CreateEpic)).subscribe(result => {
      this.CreateEpic.title="";
      this.getEpicList();
    })
  }

  addIssue(isBacklog:boolean,sprintId:any){
    if(this.task.invalid && this.task.invalid){
      return
    }
    const tokenDetail=this._localStore.getData('tokenDetail');
    if(isBacklog){
      sprintId=null;
    }
    var issue = {
      title: this.title.value,
      type: this.task.value,
      status: "To do",
      priority: "Medium",
      description: "",
      reportTo: tokenDetail.id,
      projectId: this.ProjectId,
      isBacklog: isBacklog,
      createdBy: tokenDetail.id,
      sprintId: sprintId,
      parentId:null
    };
    this._issueService.addIssue(issue).subscribe((data:any)=>{
      this.getCurrentSprintIssue();
      this.getEpicList();
      this.callBacklogIssue();
      this.getFutureSprint();
      this.task.setValue('');
      this.title.setValue('')
    })
  }

  getEpicList(){
    this._issueService.getEpic(this.ProjectId).subscribe((data: any) => {
      this.epicList = data;
    })
  }
  getCurrentSprintIssue(){
    this._issueService.getIssueUsingSprintIdProjectId(this.ProjectId).subscribe(
      (data: any) => {
        this.currentSprintIssue = data;
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

  getCurrentSprint(){
    this._sprintService.currentSprint(this.ProjectId).subscribe(
      (data:any)=>{
        this.currentSprintData=data;
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

  callBacklogIssue() {
    this._sprintService.getBacklogs(this.ProjectId).subscribe(
      (data: any) => {
        this.issueBacklogList = data;
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

  openSprintModel(sprintData:any,isActive:any){
    this.dialog.open(StartSprintComponent, {
      minWidth: '600px',
      data: {
        SprintId: sprintData.id,
        IsActive: isActive,
        SprintData:sprintData
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getCurrentSprint();
      this.getCurrentSprintIssue();
      this.getFutureSprint();
      this.callBacklogIssue();
    })
  }

  openDialog(issue: any) {
    this.dialog.open(IssueModalComponent, {
      minWidth: '300px',
      data: {
        issue: issue
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getCurrentSprintIssue();
    })
  }

  formatDateString(inputDateString: string): string {
    const date = new Date(inputDateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-us', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month}`;
  }

  createSprint() {
    const sprint={
      name:'Sprint1',
      isFutureSprint:true,
      projectId:this.ProjectId
    }
    this._sprintService.postSprints(sprint).subscribe(a => { this.getFutureSprint() });
  }

  getFutureSprint() {
    this._sprintService.futureSprint(this.ProjectId).subscribe(
      (data: any) => {
        this.futureSprints = data.resultData;
        this.futureSprints.forEach((data:any) => {
          data.toggleCreate=false;
          data.toggleSprint=false;
        });
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

  updateIssue(issue: any) {  
    this._issueService.updateIssue(issue).subscribe(
      (data: any) => {
        if(data.status){
          this.getCurrentSprint();
          this.getCurrentSprintIssue();
          this.getFutureSprint();
          this.callBacklogIssue();
          this.loading=false;
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: data.resultData,
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.loading=false;
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
  completeSprintModel(){
    this.dialog.open(CompleteSprintModalComponent, {
      minWidth: '600px',
      data: {
        sprintData: this.currentSprintData[0],
        sprintIssues: this.currentSprintIssue,
      },
    });
    this.dialog.afterAllClosed.subscribe((data: any) => {
      this.getCurrentSprint();
      this.getCurrentSprintIssue();
      this.getFutureSprint();
      this.callBacklogIssue();
    })
  }

  drop(event: CdkDragDrop<any[]>,sprintId : any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      event.item.data.sprintId = sprintId;
      event.item.data.isBacklog = sprintId==null?true:false;
      this.updateIssue(event.item.data);
    }
  }
  
 epicdrop(event: CdkDragDrop<any[]>,epicId : any) {
      event.item.data.parentId = epicId;
      this.updateIssue(event.item.data)
  }
}
