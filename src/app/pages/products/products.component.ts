import { Component, OnInit } from '@angular/core';
import { Router, Event, ActivatedRoute, NavigationEnd } from '@angular/router';
import { IBike } from 'src/app/shared/interfaces/bike.interface';
import { IComponent } from 'src/app/shared/interfaces/component.interface';
import { ProductsService } from 'src/app/shared/services/products.service';
import { Options, LabelType } from 'ng5-slider';



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  productsArr: Array<IBike | IComponent>
  category: string
  type: string
  nameEN: string
  lengthArr: number
  minValue: number = 0;
  maxValue: number = 10000;
  count: number = 8
  sortArr: string = 'data'
  way: boolean = false
  paginationStatus: boolean = true
  options: Options = {
    floor: 0,
    ceil: 10000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min price:</b> €' + value;
        case LabelType.High:
          return '<b>Max price:</b> €' + value;
        default:
          return '€' + value;
      }
    }
  };
  constructor(private productsService: ProductsService,
    private router: Router,
    private activateRoute: ActivatedRoute,
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.category = this.activateRoute.snapshot.paramMap.get("category")
        this.type = this.activateRoute.snapshot.paramMap.get("type")
        this.setMenu()
        this.slider()
        this.count = 8
        this.getBikes()
      }
    })
  }

  ngOnInit(): void {
  }
  setMenu(){
    this.productsService.getMenu(this.category,this.type)
  }
  getSize() {
    this.productsArr
      ? this.count >= this.productsArr.length
        ? this.paginationStatus = false
        : this.paginationStatus = true
      : this.paginationStatus = true
  }
  slider() {
    if (this.category == "components") {
      this.options.ceil = 300;
      this.maxValue = 300
      this.minValue = 0
      this.options.floor = 0
    }
    else {
      this.options.ceil = 10000;
      this.maxValue = 10000
      this.options.floor = 0
      this.minValue = 0
    }
  }
  getBikes() {
    this.productsService.getProducts(this.category, this.type, this.minValue, this.maxValue)
    this.productsService.arr.subscribe(
      (data: Array<IBike | IComponent>) => {
        this.productsArr = data
        this.getSize()
      }
    )
  }
  filterType(type) {
    this.productsService.getProducts(this.category, type, this.minValue, this.maxValue)
    this.productsService.arr.subscribe(
      (data: Array<IBike | IComponent>) => {
        this.productsArr = data
        this.getSize()
      }
    )
    this.router.navigate(['/products', this.category, type])
  }
  prodDet(prod: IBike | IComponent) {
    this.router.navigate(['/products', this.category, this.type, prod.id])
  }
  buy(prod) {
    this.productsService.buy(prod)
  }

  search() {
    this.getBikes()
  }
  pagination() {
    this.count += 8
    this.getSize()
  }
  sort(sort, way) {
    this.sortArr = sort
    this.way = way
  }
}
