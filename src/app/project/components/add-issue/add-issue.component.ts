import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IssueService } from '../../services/issue.service';
import { UserService } from '../../services/user.service';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { SprintService } from '../../services/sprint.service';
import { LocalService } from '../../services/local.service';
import { Dialog } from '@angular/cdk/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-issue',
  standalone: true,
  imports: [ReactiveFormsModule,AngularEditorModule],
  templateUrl: './add-issue.component.html',
  styleUrl: './add-issue.component.css'
})
export class AddIssueComponent implements OnInit {
  reporterId:any;
  issue:any=[];
  issueForm =new FormGroup({
    title: new FormControl('',[Validators.required]),
    description: new FormControl(''),
    type: new FormControl('Task'),
    reportTo: new FormControl(''),
    assignTo: new FormControl(''),
    timeEstimate: new FormControl('',[Validators.required]),
    priority: new FormControl('Medium'),
  });

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '80px',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
    uploadUrl: 'assets/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'subscript',
        'superscript',
        'fontName'
      ],
      [
        'customClasses',
        'unlink',
        'insertImage',
        'removeFormat',
      ]
    ]
  };
  users: any;
  sprintId: any;
  ProjectId: any;

  constructor(private issueService:IssueService,private userService:UserService, private sprintService:SprintService, private localStore:LocalService, private dialog:Dialog){
    const Project = this.localStore.getData('Project');
    this.ProjectId=Project.id;
  }


  ngOnInit(): void {
    const tokenDetail = this.localStore.getData('tokenDetail');
    this.issueForm.patchValue({
      reportTo:tokenDetail.name,
      assignTo:null
    });
    this.reporterId=tokenDetail.id;
    this.getUser();
    this.getCurrentSprint();
  }

  getUser(){
    this.userService.getUserByProjectId(this.ProjectId).subscribe((data:any)=>{
      this.users=data.resultData;
    })
  }

  getCurrentSprint(){
    this.sprintService.currentSprint(this.ProjectId).subscribe((data:any)=>{
      this.sprintId=data[0]?.id;
    })
  }

  addIssue(){
    this.issueForm.markAllAsTouched();
    if(this.issueForm.invalid){
      return;
    }

    this.issue=this.issueForm.value;
    this.issue.sprintId=this.sprintId;
    this.issue.reportTo=this.reporterId;
    this.issue.status='To do';
    this.issue.projectId=this.ProjectId;
    if(this.issue.assignTo == "null"){
      this.issue.assignTo=null;
    }
    this.issueService.addIssue(this.issue).subscribe((data:any)=>{
      if(data.status){
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'success',
          timer: 5000,
          title: 'Issue created successfully!!',
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.dialog.closeAll();
      }
      else{
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'error',
          timer: 5000,
          title: 'Issue creation failed!!',
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.dialog.closeAll();
      }
      
    })
  }

  cancel(){
    this.dialog.closeAll();
  }
}
