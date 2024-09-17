import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../account.service';
import { LocalService } from '../../project/services/local.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  submit: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _accountService: AccountService,
    private _localStore: LocalService) {
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl(false)
    });
    const storedCredentials = this._localStore.sessionGetData('token');
    if (storedCredentials.length != 0) {
      this.loginForm.patchValue({
        email: storedCredentials.email,
        password: storedCredentials.password,
        rememberMe: storedCredentials.rememberMe
      });
    }
  }

  login() {
    this.submit = true;
    if (this.loginForm.valid) {
      this._accountService.login(this.loginForm.value).subscribe((data: any) => {
        if (data.status) {
          this._localStore.saveData('tokenDetail', JSON.stringify(data.resultData));
          this.router.navigate(['/project']);
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'success',
            timer: 5000,
            title: 'Login successfully!',
            showCloseButton: true,
            buttonsStyling: true,
          });
          sessionStorage.clear();
          if (this.loginForm.value.rememberMe) {
            this._localStore.sessionSaveData('token', JSON.stringify(this.loginForm.value));
          }
        }
        else {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            icon: 'error',
            timer: 5000,
            title: data.resultData,
            showCloseButton: true,
            buttonsStyling: true,
          });
        }
      });

    }
  }
  get f() {
    return this.loginForm.controls;
  }

}
