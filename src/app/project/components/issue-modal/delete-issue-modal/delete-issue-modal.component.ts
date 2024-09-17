import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { IssueService } from '../../../services/issue.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-issue-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-issue-modal.component.html',
  styleUrl: './delete-issue-modal.component.css'
})
export class DeleteIssueModalComponent {
  @Output() confirmAction = new EventEmitter<boolean>();
  constructor(@Inject(DIALOG_DATA) public data: any, private issueService:IssueService){}

  confirm(confirm: boolean) {
    if(confirm){
    this.issueService.deleteIssues(this.data.issueId).subscribe(
      (data:any)=>{ 
        if(data.status){
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Issue deleted successfully!!',
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
            title: 'Issue deletion failed!!',
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
