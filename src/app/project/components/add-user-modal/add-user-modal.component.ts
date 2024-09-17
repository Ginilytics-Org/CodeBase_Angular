import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LocalService } from '../../services/local.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-modal.component.html',
  styleUrl: './add-user-modal.component.css'
})
export class AddUserModalComponent {
  UserData: any;
  userForm!: FormGroup;
  selectedOption!: string;
  ProjectId: any;

  constructor(private _localStore: LocalService,
    private _userService: UserService,
    private dialog: Dialog) {
    const Project = this._localStore.getData('Project');
    this.ProjectId = Project.id;
  }

  get f() {
    return this.userForm?.controls;
  }

  ngOnInit(): void {
    this.userForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required,Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  submitForm() {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) {
      return;
    }
    this._userService.registerUser(this.userForm.value).subscribe(
      (data:any)=>{
        if (data != null && data['status'] != false){
          this.cancel();
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'User added successfully!!',
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
            title: 'Email is already registered!!',
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
