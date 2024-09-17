import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { UserService } from '../../../../services/user.service';
import { LocalService } from '../../../../services/local.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remove-user',
  standalone: true,
  imports: [],
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.css'
})
export class RemoveUserComponent {
  @Output() confirmAction = new EventEmitter<boolean>();
  userId: any;
  Project: any;

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private _userService: UserService,
    public dialog: Dialog,
    private _localStore: LocalService) {
    this.Project = this._localStore.getData('Project');
    this.userId = data.userId;
  }

  confirm(confirm: boolean) {
    this._userService.removeUser(this.userId, this.Project.id).subscribe(
      (data: any) => {
        if(data.status){
          this.confirmAction.emit();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'User removed successfully!!',
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
            title: 'Remove user failed!!',
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