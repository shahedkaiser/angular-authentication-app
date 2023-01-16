import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit{
  type:string='password';
  isText:boolean=false;
  eyeIcon:string='fa-eye-slash';
  signupForm!:FormGroup;

  constructor(
    private formBuilder : FormBuilder,
    private authService: AuthService,
    private router:Router,
    private toast:NgToastService){}

  ngOnInit():void{
    this.signupForm=this.formBuilder.group({
      firstName:['',Validators.required],
      lastName:['',Validators.required],
      email:['',Validators.required],
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  hideShowPassword(){
    this.isText=!this.isText;
    this.isText ? this.eyeIcon='fa-eye' : this.eyeIcon='fa-eye-slash';
    this.isText ? this.type='text' : this.type='password';
  }

  onSubmit(){
    if(this.signupForm.valid)
    {
      //send object to database
      console.log(this.signupForm.value);
      this.authService.signup(this.signupForm.value)
      .subscribe({
        next: (response)=>{
          this.toast.success({detail:"SUCCESS", summary: response.message, duration: 5000});
          this.signupForm.reset();
          this.router.navigate(['login']);
        },
        error: (error)=>{
          this.toast.error({detail:"ERROR", summary: error.error.message, duration: 5000});
        }
      })
    }
    else
    {
      //show toaster & required validator error
      ValidateForm.validateAllFormFields(this.signupForm);
      alert('Validation error');
    }
  }

  
}
