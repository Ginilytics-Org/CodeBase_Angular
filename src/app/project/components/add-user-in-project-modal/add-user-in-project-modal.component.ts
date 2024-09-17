import { DIALOG_DATA, Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { LocalService } from '../../services/local.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-user-in-project-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-user-in-project-modal.component.html',
  styleUrl: './add-user-in-project-modal.component.css'
})

export class AddUserInProjectModalComponent {
  @Output() confirmAction = new EventEmitter<boolean>();
  addUserForm!: FormGroup;
  project: any;
  projectUsers: any;

  constructor(
    @Inject(DIALOG_DATA) public data: any,
    private _localStore:LocalService,
    private _userService: UserService,
    private dialog: Dialog){ 
      this.project = this._localStore.getData('Project');
      this.projectUsers = data.users;
  }

  ngOnInit(): void {
    this.createForm()
  }

  createForm() {
    this.addUserForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      roleId: new FormControl('1', [Validators.required]),
      projectId: new FormControl(this.project.id, [Validators.required])
    });
  }

  submit() {
    this.addUserForm.markAllAsTouched();
    if (this.addUserForm.invalid) {
      return;
    }
    var isPresent= this.isEmailPresent(this.addUserForm.controls['email'].value);
    if(isPresent) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      icon: 'error',
      timer: 5000,
      title: 'This user is already in the project.',
      showCloseButton: true,
      buttonsStyling: true,
    });
    return;
   }
    this._userService.AddUserInProject(this.addUserForm.value).subscribe((data: any) => {
      this.confirmAction.emit(true);
    })
  }

  cancel() {
    this.confirmAction.emit(false);
  }

  isEmailPresent(email: string): boolean {
    return this.projectUsers.some((user:any) => user.email === email);
  }
}
