import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "src/app/shared/services/auth.service";
import { IOrder } from 'src/app/shared/interfaces/order.inteerface';
import { OrderService } from 'src/app/shared/services/order.service';
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: "app-basket",
  templateUrl: "./basket.component.html",
  styleUrls: ["./basket.component.scss"],
})
export class BasketComponent implements OnInit {
  products = []
  total: number = 0;
  user;
  orders;
  options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
  public createOrder = new FormGroup({
    email: new FormControl(`${this.getUserEmail()}`, [Validators.required, Validators.email]),
    name: new FormControl(`${this.getUserData('name')}`, [Validators.required, Validators.pattern(/^[А-ЩЬЮЯҐЄІЇа-щьюяґєіїa-zA-Z]{3,12}$/)]),
    lastName: new FormControl(`${this.getUserData('lastName')}`, [Validators.required, Validators.pattern(/^[А-ЩЬЮЯҐЄІЇа-щьюяґєіїa-zA-Z]{3,12}$/)]),
    phone: new FormControl(`${this.getUserData('phone')}`, [Validators.required, Validators.pattern(/^(0\d{9})$/)]),
    region: new FormControl(`${this.getUserData('region')}`, [Validators.required, Validators.pattern(/^[А-ЩЬЮЯҐЄІЇа-щьюяґєіїa-zA-Z]{3,12}$/)]),
    city: new FormControl(`${this.getUserData('city')}`, [Validators.required, Validators.pattern(/^[А-ЩЬЮЯҐЄІЇа-щьюяґєіїa-zA-Z]{3,12}$/)]),
    branch: new FormControl(`${this.getUserData('branch')}`, [Validators.required, Validators.pattern(/^[А-ЩЬЮЯҐЄІЇа-щьюяґєіїa-zA-Z0-9]{1,12}$/)]),
  });

  constructor(private auth: AuthService,
    private order: OrderService,
    private productService: ProductsService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getMenu()
  }
  getMenu(){
    this.productService.getMenu()
  }
  getUserData(key) {
    if (this.auth.currentOrders) {
      this.orders = this.auth.currentOrders
      return this.orders[key]
    } else {
      return "";
    }
  }
  getUserEmail() {
    if (this.auth.justUser) {
      this.user = this.auth.justUser;
      console.log(this.user.userName);
      return this.user.userName
    }
    else {
      return ""
    }

  }
  totalSum() {
    this.total = 0
    if (this.products) {
      this.products.forEach(prod => {
        this.total += prod.price
      })
    }
  }
  getProducts() {
    if (JSON.parse(localStorage.getItem("products"))) {
      this.products = JSON.parse(localStorage.getItem("products"));
      console.log(this.products);
      this.totalSum()
    }

  }
  delete(i) {
    this.products.splice(i, 1);
    localStorage.setItem("products", JSON.stringify(this.products));
    this.getProducts();
  }
  buy(formData: FormData) {
    const order: IOrder = {
      products: this.products,
      email: formData['email'],
      name: formData['name'],
      lastName: formData['lastName'],
      phone: formData['phone'],
      region: formData['region'],
      city: formData['city'],
      branch: formData['branch'],
      totalPrice: this.total,
      data: new Date().toLocaleDateString('en-GB', this.options)
    }
    this.order.addOrder(order)
    this.products.forEach(prod => {
      prod.count -= prod.buyCount
      this.productService.updateProduct(prod)
    })
    this.products = []
    localStorage.setItem('products', JSON.stringify(this.products))
    this.totalSum()
    this.productService.showBuySuccessToaster()
  }
}
