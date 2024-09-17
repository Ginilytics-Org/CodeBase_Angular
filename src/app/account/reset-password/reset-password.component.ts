import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Validation from './utils/validation';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AccountService } from '../account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{
  form: FormGroup = new FormGroup({
    password: new FormControl(''),
    cpassword: new FormControl(''),
  })
  AcceptInvite:any={
    password:'',
    token:''
  }
  isValid= false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute, 
    private _accountService:AccountService,
    private router:Router
    ){}

  ngOnInit(): void {
    this.AcceptInvite.token = this.route.snapshot.params['token'];
    this._accountService.ValidateLink(this.AcceptInvite).subscribe((result:any) =>{
      if(result.status==true){
        this.isValid = true;
      }
      else{
        this.isValid=false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'error',
          timer: 5000,
          title: 'Token is invalid!',
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.router.navigate(['/']);
      }
    });
    this.form = this.formBuilder.group(
      {
        password: [ '', [ Validators.required]],
        cpassword: ['', Validators.required],
      },
      { validators: [Validation.match('password', 'cpassword')] 
    })
  }

  reset(){
    this.form.markAllAsTouched();
    if(this.form.invalid || this.isValid == false){
      return;
    }
    this.AcceptInvite.password = this.form.controls['password'].value;
    this._accountService.ChangePassword(this.AcceptInvite).subscribe(
      (data: any) => {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          icon: 'success',
          timer: 5000,
          title: 'Password set successfully!',
          showCloseButton: true,
          buttonsStyling: true,
        });
        this.router.navigate(['/']);
      }
    )
  }


}
