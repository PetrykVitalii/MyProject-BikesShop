import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private productService:ProductsService) { }

  ngOnInit(): void {
    this.getMenu()
  }
  getMenu(){
    this.productService.getMenu()
  }

}
