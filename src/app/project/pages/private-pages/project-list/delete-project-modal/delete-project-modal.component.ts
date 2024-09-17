import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { LocalService } from '../../../../services/local.service';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { ProjectService } from '../../../../services/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delete-project-modal',
  standalone: true,
  imports: [],
  templateUrl: './delete-project-modal.component.html',
  styleUrl: './delete-project-modal.component.css'
})
export class DeleteProjectModalComponent {
  @Output() confirmAction = new EventEmitter<boolean>();
  projectId: any;

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private _projectService: ProjectService,
    public dialog: Dialog,
    private _localStore: LocalService) {
    this.projectId = data.projectId;
  }

  confirm() {
    this._projectService.deleteProject(this.projectId).subscribe(
      (data: any) => {
        if(data.status){
          this.confirmAction.emit();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Project deleted successfully!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
        else{
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'Project deletion failed!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
        this.cancel();
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
        this.cancel();
      }
    );
  }

  cancel() {
    this.dialog.closeAll();
  }
}