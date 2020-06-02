import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class SignComponent implements OnInit {
  public signUpForm = new FormGroup({
    email: new FormControl('',[Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,16}$/)]),
    userName: new FormControl('',[Validators.required,Validators.pattern(/^\w{2,10}$/)])
  })
  status: boolean
  allUser = []
  wrongStatus:boolean
  constructor(private auth: AuthService,
              private router: Router,
              private productService:ProductsService) { }

  ngOnInit(): void {
    this.getAllUser()
    this.redirect()
    this.getMenu()
  }
  getMenu(){
    this.productService.getMenu()
  }

  redirect(){
    if(JSON.parse(localStorage.getItem('token'))){
      this.router.navigate(['/order']) 
    }
  }

  change() {
    this.status = !this.status
    this.signUpForm.reset()
  }

  getAllUser() {
    this.auth.getAllUser().subscribe(data => {
      data.forEach(user => {
        this.allUser.push(user.payload.doc.data())
      })
    })
  }

  signUp(formData: FormData) {
    if (!this.allUser.some(user => user.userName == formData['email'])) {
      this.auth.signUp(formData['email'], formData['password'], formData['userName'])
    }
    else{
      this.wrongStatus = true
      this.auth.showErrorReigstrationToaster()
    }
  }
  signIn(formData: FormData) {
    if (this.allUser.some(user => user.userName == formData['email'])) {
      this.auth.login(formData['email'], formData['password'])
    }
    else{
      this.wrongStatus = true
      this.auth.showErrorSignInToaster()
    }
  }
}
