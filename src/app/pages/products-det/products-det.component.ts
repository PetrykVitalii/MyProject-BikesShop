import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Event, Router, NavigationEnd } from '@angular/router';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-products-det',
  templateUrl: './products-det.component.html',
  styleUrls: ['./products-det.component.scss']
})
export class ProductsDetComponent implements OnInit {
  product
  type: string
  id: string
  category: string
  constructor(private productsService: ProductsService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.category = this.activateRoute.snapshot.paramMap.get("category")
        this.type = this.activateRoute.snapshot.paramMap.get("type")
        this.id = this.activateRoute.snapshot.paramMap.get("id")
      }
    })
  }

  ngOnInit(): void {
    this.getProduct()
  }
  setMenu() {
    this.productsService.getMenu(this.category, this.product.type, this.product.nameEN)
  }
  getProduct() {
    this.productsService.getOneProduct(this.id, this.category).subscribe(data => {
      this.product = data.payload.data()
      this.product.id = this.id
      this.setMenu()
    })
  }

  buy(prod) {
    this.productsService.buy(prod)
  }
}
