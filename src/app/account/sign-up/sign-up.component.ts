import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  registerForm!: FormGroup;
  submit: boolean = false;
  AcceptInvite: any = {
    token: ''
  }
  inviteValid: any;
  isEmailField: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private _accountService: AccountService,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.AcceptInvite.token = this.route.snapshot.params['token'];
    if (this.AcceptInvite.token != undefined) {
      this._accountService.ValidateLink(this.AcceptInvite).subscribe((result: any) => {
        this.inviteValid = result.resultData;
        if (this.inviteValid == 417) {
          window.alert(
            'Link is Invalid Please try again with new Link.');
            this.router.navigate(['']);
        }
        else if (this.inviteValid == "expired") {
          window.alert('Invitation Link is Expired');
          this.router.navigate(['']);
        }
        else if (this.inviteValid != "expired" && result.statusCode == 200) {
          this.registerForm.patchValue({
            email: this.inviteValid,
          });
        }
      });
    }
    else {
      this.router.navigate(['']);
    }
    this.createForm();
  }

  createForm() {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  signUp() {
    this.submit = true;
    if (this.registerForm.invalid) {
      return;
    }
    else {
      this.registerForm.patchValue({
        email: this.inviteValid,
      });
      this._accountService.signUp(this.registerForm.value).subscribe((data: any) => {
        if (data != null && data['status'] != false) {
          window.alert('Sign-up successfully');
          this._accountService.AcceptInvite(this.AcceptInvite).subscribe((result: any) => {
            if (result.resultData) {
              console.log("Added in Project");
              this.router.navigate(['']);
            }
            else {
              console.log(result);
            }
          });
        }
        else {
          window.alert("There was an error in sign-up. Please try again")
        }
      });
    }
  }
  get f() {
    return this.registerForm.controls;
  }

}
