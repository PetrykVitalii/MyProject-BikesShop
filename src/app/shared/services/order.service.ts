import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orders = new Subject
  allOrders = new Subject
  constructor(private fireStore: AngularFirestore) { }

  addOrder(order) {
    this.fireStore.collection('orders').add(order)
  }
  getOrder(email) {
    let orders = []
    this.fireStore.collection('orders').ref.where('email', '==', email).orderBy('data', 'desc').onSnapshot(data => {
      data.forEach(order => {
        orders.push(order.data())
      })
      return this.orders.next(orders)
    })
  }
  getAllOrder() {
    let allOrders = []
    this.fireStore.collection('orders').ref.orderBy('data', 'desc').onSnapshot(data => {
      data.forEach(order => {
        allOrders.push(order.data())
      })
     this.allOrders.next(allOrders)
    })
  }
}

