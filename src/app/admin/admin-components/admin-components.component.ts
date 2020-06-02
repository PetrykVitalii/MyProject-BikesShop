import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage'
import 'firebase/firestore'
import { IComponent } from 'src/app/shared/interfaces/component.interface';
import { ProductsService } from 'src/app/shared/services/products.service';
import { NgForm } from '@angular/forms';
import { IBike } from 'src/app/shared/interfaces/bike.interface';

@Component({
  selector: 'app-admin-components',
  templateUrl: './admin-components.component.html',
  styleUrls: ['./admin-components.component.scss']
})
export class AdminComponentsComponent implements OnInit {
  @ViewChild('f', { static: false }) form: NgForm;
  urlImg: string
  products
  status: boolean
  statusButton:boolean
  oneProduct:IBike|IComponent
  options ={ year: 'numeric', month: '2-digit', day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit' }
  constructor(private afStorage: AngularFireStorage,
    private productsService: ProductsService
  ) { }


  ngOnInit(): void {
    this.getProduct()
  }
 
  getProduct() {
    this.productsService.getProducts('components', 'all', 0, 10000)
    this.productsService.arr.subscribe(data => {
      this.products = data
    })
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = `images/${this.randomId()}.${file.type.split('/')[1]}`;
    const task = this.afStorage.upload(filePath, file);
    task.then(e => {
      this.afStorage.ref(`images/${e.metadata.name}`).getDownloadURL().subscribe(url => {
        this.urlImg = url
      })
    })
  }
  randomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  onSubmit(form: NgForm) {
    const value = form.value
    const component: IComponent = {nameEN:value.nameEN, 
                                  type:value.type, 
                                  price:value.price, 
                                  count:value.count, 
                                  image:this.urlImg,
                                  category:'components',
                                  data: new Date().toLocaleDateString('en-GB', this.options)
    }
    this.productsService.addProducts(component)
    this.getProduct()
    this.urlImg = null
    form.reset();
  }
  switch() {
    this.status = !this.status
  }
  delete(id){
    this.productsService.deleteProduct(id,'components')
    this.getProduct()
  }
  update(prod){
    this.status = !this.status
    this.urlImg = prod.image
    this.statusButton = true
    this.oneProduct = prod
    this.form.setValue({
      nameEN:prod.nameEN,
      type:prod.type,
      price: prod.price,
      count: prod.count,
    })
  }
  updateProduct(){   
    this.statusButton = false
    const value = this.form.value
    const component: IComponent = {
      nameEN: value.nameEN,
      type: value.type,
      price: value.price,
      count: value.count,
      id:this.oneProduct.id,
      image: this.urlImg,
      category: "components",
      data: new Date().toLocaleDateString('en-GB', this.options)
    }
    this.form.reset();
    this.productsService.updateProduct(component)
    this.getProduct()
    this.urlImg = null
  }
}
