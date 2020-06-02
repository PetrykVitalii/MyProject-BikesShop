import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/shared/services/order.service";
import { AuthService } from "src/app/shared/services/auth.service";
import { IOrder } from "src/app/shared/interfaces/order.inteerface";
import { ProductsService } from 'src/app/shared/services/products.service';

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
})
export class OrderComponent implements OnInit {
  orders: IOrder[];
  user;
  constructor(private orderService: OrderService, 
              private auth: AuthService,
              private productService:ProductsService) {}

  ngOnInit(): void {
    this.getOrder();
    this.getMenu()
  }
  getMenu(){
    this.productService.getMenu()
  }

  getOrder() {
    this.user = this.auth.justUser;
    if (this.user) {
      this.orderService.getOrder(this.user.userName);
      this.orderService.orders.subscribe((order: IOrder[]) => {
        if(order.length>0){
          this.orders = order;
        }
      });
    }
  }
}
