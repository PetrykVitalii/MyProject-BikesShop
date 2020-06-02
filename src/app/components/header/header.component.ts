import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  category
  type
  product
  user:any|IUser
  constructor(private auth:AuthService,
              private productService:ProductsService) {}

  ngOnInit(): void {
    this.getUser()
    this.getMenu()
  }
  getMenu(){
    this.productService.category.subscribe((category)=>{
      this.category = category
    })
    this.productService.type.subscribe((type)=>{
      this.type = type
    })
    this.productService.productId.subscribe((productId)=>{
      this.product = productId
    })
  }
  getUser(){
    this.auth.currentUser.subscribe(user=>{
      this.user = user
    })
  }
  logOut(){
    this.auth.logOut()
  }
}
