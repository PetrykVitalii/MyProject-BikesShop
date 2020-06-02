import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore'
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  arr = new Subject
  category = new Subject
  type = new Subject
  productId = new Subject
  constructor(private fireStore: AngularFirestore,
    private toastr: ToastrService) { }
    getProducts(category, type, min, max) {
      let arr = []
      let id = []
      if (type == "all") {
        this.fireStore.collection(category).ref.where('category', '==', category).where('price', '<=', max).where('price', '>=', min).onSnapshot(data => {
          data.forEach(product => {
            arr.push(product.data())
            id.push(product.id)
          })
          arr = arr.map((prod, index) => {
            prod.id = id[index]
            return prod
          })
          return this.arr.next(arr)
        })
      }
      else {
        this.fireStore.collection(category).ref.where('type', '==', type).where('price', '<=', max).where('price', '>=', min).onSnapshot(data => {
          data.forEach(product => {
            id.push(product.id)
            arr.push(product.data())
          })
          arr = arr.map((prod, index) => {
            prod.id = id[index]
            return prod
          })
          return this.arr.next(arr)
        })
      }
    }
  getSize(category) {
    return this.fireStore.collection(category).snapshotChanges()
  }
  getOneProduct(id, category) {
    return this.fireStore.doc(`${category}/${id}`).snapshotChanges()
  }
  addProducts(product) {
    this.fireStore.collection(product.category).add(product)
  }
  buy(prod) {
    let localProd = []
    if (localStorage.length > 0 && localStorage.getItem("products")) {
      localProd = JSON.parse(localStorage.getItem("products"))
      if (localProd.some(prodLocal => prodLocal.id === prod.id)) {
        localProd.forEach(prodLocal => {
          if (prodLocal.id == prod.id) {
            if (prodLocal.count !== prodLocal.buyCount) {
              prodLocal.buyCount += 1
              this.showSuccessToaster()
            }
            else {
              this.showErrorToaster()
            }
          }
        })
      } else {
        prod.buyCount = 1
        localProd.push(prod)
        this.showSuccessToaster()
      }

    }
    else {
      prod.buyCount = 1
      localProd.push(prod)
    }
    localStorage.setItem("products", JSON.stringify(localProd))

  }
  deleteProduct(id, category) {
    this.fireStore.doc(`${category}/${id}`).delete()
  }
  updateProduct(product) {
    this.fireStore.doc(`${product.category}/${product.id}`).update(product)
  }
  showBuySuccessToaster() {
    this.toastr["success"]("Ви можете перевірити замовлення у своєму профілі", "Дякуємо за покупку")
  }
  showSuccessToaster() {
    this.toastr["success"]("Товар знаходиться у корзині", "Успішна покупка")
  }
  showErrorToaster() {
    this.toastr["error"]("Недостатньо товару на складі", "Вибачте")
  }
  getMenu(category = undefined,type = undefined,productId = undefined){
    this.category.next(category)
    this.type.next(type)
    this.productId.next(productId)
  }
}
