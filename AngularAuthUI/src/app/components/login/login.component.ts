import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{

  type:string='password';
  isText:boolean=false;
  eyeIcon:string='fa-eye-slash';
  loginForm! : FormGroup;
  
  constructor(
    private formBuilder : FormBuilder,
    private authService:AuthService,
    private router:Router,
    private toast:NgToastService,
    private userStore:UserStoreService) {
  
  }
  
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }

  hideShowPassword(){
    this.isText=!this.isText;
    this.isText ? this.eyeIcon='fa-eye' : this.eyeIcon='fa-eye-slash';
    this.isText ? this.type='text' : this.type='password';
  }

  onLogin(){
    if(this.loginForm.valid)
    {
      this.authService.login(this.loginForm.value)
      .subscribe({
        next: (response)=>
        {
          this.authService.storeToken(response.accessToken);
          this.authService.storeRefreshToken(response.refreshToken);
          const tokenPayload=this.authService.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.name);
          this.userStore.setRoleForStore(tokenPayload.role);
          this.toast.success({detail:"SUCCESS", summary: response.message, duration: 5000});
          this.router.navigate(['dashboard']);
        },
        error: (error)=>
        {
          this.toast.error({detail:"ERROR", summary: error.error.message, duration: 5000});
        }
      })
    }
    else
    {
      //show toaster & required validator error
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Validation error');
    }
  }

}
