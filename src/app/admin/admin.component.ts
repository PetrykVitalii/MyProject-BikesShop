import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../shared/services/products.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(private productsService:ProductsService) { }

  ngOnInit(): void {
    this.getMenu()
  }
  getMenu(){
    this.productsService.getMenu()
  }

}
