import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-comment',
  standalone: true,
  imports: [],
  templateUrl: './delete-comment.component.html',
  styleUrl: './delete-comment.component.css'
})
export class DeleteCommentComponent {
  @Output() confirmAction = new EventEmitter<boolean>();
  constructor(private commentService:CommentService,@Inject(DIALOG_DATA) public data: any){}

  confirm(confirm: boolean) {
    if(confirm){
    this.commentService.deleteComment(this.data.id).subscribe(
      (data:any)=>{ 
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Comment deleted successfully!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.confirmAction.emit(confirm);
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Comment deletion failed!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
      },
      (error)=>{
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
        this.confirmAction.emit(false);
      }
    );
    }
    else{
      this.confirmAction.emit(confirm);
    }
  }
}
