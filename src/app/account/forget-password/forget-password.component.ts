import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { RouterLink } from '@angular/router';
import { LocalService } from '../../project/services/local.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  email = new FormControl('', [Validators.required,Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")])

  constructor(private _accountService:AccountService, localStore:LocalService){
    
  }

  sendLink() {
    this.email.markAllAsTouched();
    if (this.email.invalid) {
      return;
    }
    const email={
      email:this.email.value
    }
    this._accountService.forgetPassword(email).subscribe(
      (data: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'success',
          timer: 5000,
          title: 'Email sent successfully!',
          showCloseButton: true,
          buttonsStyling: true,
        });
      });
  }
}
