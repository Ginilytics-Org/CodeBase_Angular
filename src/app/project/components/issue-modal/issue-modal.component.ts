import { Component, Inject, OnInit } from '@angular/core';
import {DIALOG_DATA, Dialog} from '@angular/cdk/dialog';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { IssueService } from '../../services/issue.service';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { MentionModule } from 'angular-mentions';
import { HistoryComponent } from '../history/history.component';
import { CommentComponent } from '../comment/comment.component';
import { HistoryCommentComponent } from '../history-comment/history-comment.component';
import { DeleteIssueModalComponent } from './delete-issue-modal/delete-issue-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-issue-modal',
  standalone: true,
  imports: [ReactiveFormsModule,AngularEditorModule,MentionModule,HistoryComponent,CommentComponent,HistoryCommentComponent],
  providers:[DatePipe],
  templateUrl: './issue-modal.component.html',
  styleUrl: './issue-modal.component.css'
})
export class IssueModalComponent implements OnInit {
  issue:any;
  users: any;
  issueForm =new FormGroup({
    title: new FormControl('',[Validators.required]),
    description: new FormControl(''),
    timeSpent: new FormControl(''),
    dueDate: new FormControl(''),
    startDate: new FormControl(''),
    type: new FormControl(''),
    reportTo: new FormControl(''),
    assignTo: new FormControl(''),
    timeEstimate: new FormControl(''),
    priority: new FormControl(''),
    status: new FormControl(''),
    projectIssueKeyId: new FormControl(''),
    sprintName: new FormControl('')
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
  documentData: any;
  selectedView: string = 'All';
  reproterName: any;

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private datePipe:DatePipe,
    private userService:UserService,
    private issueService:IssueService,
    public dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    ){}

  ngOnInit() {
    if(this.data.issue){
      this.issue=this.data.issue;
    }else{
      this.route.paramMap.pipe(
        map(() => window.history.state)
      ).subscribe((state: any) => {
        this.issue = state;
      });
      this.dialog.closeAll()
    }
    this.getUser();
    this.getUserById();
    this.issueForm.patchValue({
      title: this.issue.title,
      description: this.issue.description,
      timeSpent: this.issue.timeSpent,
      dueDate: this.datePipe.transform(this.issue.dueDate, 'yyyy-MM-dd'),
      startDate: this.datePipe.transform(this.issue.startDate, 'yyyy-MM-dd'),
      type: this.issue.type,
      reportTo: this.issue.reportTo,
      assignTo: this.issue.assignTo,
      timeEstimate: this.issue.timeEstimate,
      priority: this.issue.priority,
      status: this.issue.status,
      projectIssueKeyId: this.issue.projectIssueKeyId,
      sprintName: this.issue.sprintName
    });
    this.GetDocuments();
  }

  getUser(){
    this.userService.getUserByProjectId(this.issue.projectId).subscribe((data:any)=>{
      this.users=data.resultData;
    })
  }

  getUserById(){
    this.userService.getUserById(this.issue.reportTo).subscribe((data:any)=>{
      this.reproterName = data.resultData.name;
      this.issueForm.patchValue({
        reportTo:this.reproterName
      })
    })
    
  }

  onSubmit(){
    this.issueForm.markAsTouched();
    if(this.issueForm.invalid || this.isStringOnlySpaces(this.issueForm.value.title)){
      return
    }
    this.issueForm.patchValue({
      reportTo:this.issue.reportTo
    })
    this.issue = { ...this.issue, ...this.issueForm.value };
    if(this.issue.assignTo == "null"){
      this.issue.assignTo=null;
    }
    this.issueService.updateIssue(this.issue).subscribe(
      (data:any)=>{
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Issue updated successfully!!',
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
            title: 'Issue updation failed!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.dialog.closeAll();
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
        this.dialog.closeAll();
      }
    )
  }

  cancel(){
    this.dialog.closeAll();
  }

  openDeleteDialog() {
    const dialogRef=this.dialog.open(DeleteIssueModalComponent, {
      minWidth: '300px',
      data: {
        issueId: this.issue.id
      },
    });
    dialogRef.componentInstance?.confirmAction.subscribe((data:any)=>{
      if(data){
        this.dialog.closeAll();
      }
      dialogRef.close();
      
    })
  }

  resize(){
    this.router.navigateByUrl(`/project/issue/${this.issue.id}`, { state: this.issue });
  }

  GetDocuments()
  {
    if (this.issue?.id != undefined ) {
      this.issueService.GetDocuments(this.issue?.id).subscribe((data: any) => {
        this.documentData = data.resultData;
      });
    }
  }

  UploadFile(e:any)
  {
    const formData =new FormData();
    formData.append('issueId',this.issue.id);
    formData.append('file',e?.target?.files[0]);
    this.issueService.UploadDocument(formData).subscribe((data:any)=>{
      this.GetDocuments();
    });
  }

  previewFile(filepath:string,contentType:string)
  {
     this.issueService.previewDocument(filepath).subscribe((data:Blob)=>
    {
      const blob=new Blob([data],{type:contentType});
      const url=window.URL.createObjectURL(blob);
      window.open(url);
    }); 
  }

  cancelFile(Data:string) {
    this.issueService.DeleteDocument(Data).subscribe((data:any)=>{
      this.GetDocuments();
    });

  }

  downloadFile(filepath:string,contentType:string,fileName:string) {
    
    this.issueService.DownloadDocument(filepath).subscribe((response)=>
    {
      let blob:Blob=response.body as Blob;
      let a=document.createElement('a');
      a.download=fileName;
      a.href=window.URL.createObjectURL(blob);
     a.click();
    });

  }

  changeView(view: string): void {
    this.selectedView = view;
  }

  isStringOnlySpaces(inputString: any): boolean {
    return /^\s*$/.test(inputString);
  }
}
