import { Component, OnInit } from '@angular/core';
import { IOrder } from 'src/app/shared/interfaces/order.inteerface';
import { OrderService } from 'src/app/shared/services/order.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-admin-order',
  templateUrl: './admin-order.component.html',
  styleUrls: ['./admin-order.component.scss']
})
export class AdminOrderComponent implements OnInit {

  orders: IOrder[];
  user;
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getAllOrder();
  }

  getAllOrder() {
    this.orderService.getAllOrder();
    this.orderService.allOrders.subscribe((order: IOrder[]) => {
      this.orders = order;
    });
  }
}
