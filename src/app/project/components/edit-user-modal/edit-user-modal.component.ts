import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocalService } from '../../services/local.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css'
})
export class EditUserModalComponent {
  UserData: any;
  userForm!: FormGroup;
  selectedOption!: string;
  ProjectId: any;

  constructor(private _localStore: LocalService,
    private _userService: UserService,
    @Inject(DIALOG_DATA) public data: any,
    private dialog: Dialog) {
    const Project = this._localStore.getData('Project');
    this.ProjectId = Project.id;
    this.UserData = data.UserData;
  }

  get f() {
    return this.userForm?.controls;
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required])
    })

    this.userForm.patchValue({
      name: this.UserData.name,
      email: this.UserData.email,
      role: this.UserData.role
    })
  }

  submitForm() {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }
    this.UserData.name = this.userForm.value.name
    this.UserData.email = this.userForm.value.email
    this.UserData.role = this.userForm.value.role
    this._userService.updateUser(this.UserData).subscribe(
      (data: any) => {
        if (data != null && data['status'] != false){
          this.cancel();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'User updated successfully!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          
        }
        else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: 'User updation failed!!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          this.cancel();
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
        this.cancel();
      }
    );
  }

  cancel() {
    this.dialog.closeAll();
  }

}
