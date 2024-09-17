import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { AngularEditorConfig, AngularEditorModule } from '@kolkov/angular-editor';
import { MentionModule } from 'angular-mentions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LocalService } from '../../services/local.service';
import { DeleteCommentComponent } from './delete-comment/delete-comment.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AngularEditorModule,MentionModule,ReactiveFormsModule,DeleteCommentComponent,DialogModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css'
})
export class CommentComponent implements OnInit {
  @Input() issue:any;
  comments: any;
  newComment=false;
  loading: boolean= true;
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

  addcomment= new FormControl('');

  constructor(private commentService:CommentService,private localStore: LocalService,private dialog:Dialog){}

  ngOnInit(){
    this.commentData();
  }
  
  toggleComment(){
    this.newComment=true;
  }

  toggleEdit(comment:any){
    comment.editId.patchValue(comment.comment)
    comment.toggleEdit = !comment.toggleEdit;
  }

  toggleEditComment(comment:any){
    comment.editComment=true;
  }

  onAdd(){
    let UserId = this.localStore.getData('tokenDetail');
    const comment = {
      document: null,
      issueId: this.issue.id,
      userId:UserId.id,
      comment: this.addcomment.value,
      createdDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString()
    };
    this.commentService.addComment(comment).subscribe(
      (data:any)=>{
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Comment added successfully!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.commentData();
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Comment creation failed!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
        this.cancelAdd();
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
        this.cancelAdd();
      }
    )
  }

  onEdit(comment:any){
    comment.comment=comment.editId.value
    this.commentService.updateComment(comment).subscribe(
      (data:any)=>{
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Comment updated successfully!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.commentData();
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Comment updation failed!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
        this.cancelAdd();
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
        this.cancelAdd();
      }
    )
  }

  cancel(comment:any){
    comment.toggleEdit=false;
  }

  cancelAdd(){
    this.newComment=false;
    this.addcomment.setValue('');
  }

  commentData ()
  {
    this.commentService.getCommentByIssueId(this.issue.id).subscribe( 
      ( data: any ) => {
        this.comments = data;
        this.comments.forEach((element:any) => {
          element.editComment=false;
          element.toggleEdit=false;
          element.editId=new FormControl('');
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
        this.loading=false;
      }
    );
  }

  calculateElapsedTime(comment:any): string {
    var modifiedDate = new Date(comment.date);
    const timezoneOffset = modifiedDate.getTimezoneOffset();
    modifiedDate= new Date(modifiedDate.getTime() - timezoneOffset * 60 * 1000);
    const currentTime = new Date();
    const elapsedMilliseconds = currentTime.getTime() - modifiedDate.getTime();
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

    if (elapsedSeconds < 60) {
      return `${elapsedSeconds} seconds ago`;
    } else if (elapsedSeconds < 3600) {
      const elapsedMinutes = Math.floor(elapsedSeconds / 60);
      return `${elapsedMinutes} minutes ago`;
    } else if (elapsedSeconds < 86400) {
      const elapsedHours = Math.floor(elapsedSeconds / 3600);
      return `${elapsedHours} hours ago`;
    } else {
      const elapsedDays = Math.floor(elapsedSeconds / 86400);
      return `${elapsedDays} days ago`;
    }
  }

  deleteDialog(commentId:any){
    const dialogRef=this.dialog.open(DeleteCommentComponent, {
      minWidth: '300px',
      data: {
        id: commentId
      },
    });
    dialogRef.componentInstance?.confirmAction.subscribe((data:any)=>{
      if(data){
        this.commentData();
      }
      dialogRef.close();
    })
    
  }
}
