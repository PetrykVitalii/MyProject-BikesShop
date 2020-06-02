import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import 'firebase/storage'
import 'firebase/firestore'
import { IBike } from 'src/app/shared/interfaces/bike.interface';
import { ProductsService } from 'src/app/shared/services/products.service';
import { NgForm } from '@angular/forms';
import { IComponent } from 'src/app/shared/interfaces/component.interface';


@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit {
  urlImg: string
  products
  status: boolean
  statusButton:boolean
  options ={ year: 'numeric', month: '2-digit', day: '2-digit',hour: '2-digit',minute: '2-digit',second: '2-digit' }
  oneProduct:IBike|IComponent
  @ViewChild('f', { static: false }) form: NgForm;

  constructor(private afStorage: AngularFireStorage,
    private productsService: ProductsService
  ) { }


  ngOnInit(): void {
    this.getProduct()
  }
  getProduct() {
    this.productsService.getProducts('bikes', 'all', 0, 10000)
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
    const bike: IBike = {
      nameEN: value.nameEN,
      type: value.type,
      price: value.price,
      count: value.count,
      weight: value.weight,
      size: value.size,
      color: value.color,
      image: this.urlImg,
      fork: value.fork,
      steeringColumn: value.steeringColumn,
      shifters: value.shifters,
      connectingRodSystem: value.connectingRodSystem,
      brake: value.brake,
      frontSwitch: value.frontSwitch,
      rearSwitch: value.rearSwitch,
      cassette: value.cassette,
      shain: value.shain,
      wheels: value.wheels,
      col: value.col,
      reinforcingPin: value.reinforcingPin,
      collar: value.collar,
      category: "bikes",
      data: new Date().toLocaleDateString('en-GB', this.options)
    }
    this.productsService.addProducts(bike)
    form.reset();
    this.getProduct()
    this.urlImg = null
  }
  switch() {
    this.status = !this.status
  }
  delete(id){
    this.productsService.deleteProduct(id,'bikes')
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
      weight: prod.weight,
      size: prod.size,
      color: prod.color,
      fork: prod.fork,
      steeringColumn: prod.steeringColumn,
      shifters: prod.shifters,
      connectingRodSystem: prod.connectingRodSystem,
      brake: prod.brake,
      frontSwitch: prod.frontSwitch,
      rearSwitch: prod.rearSwitch,
      cassette: prod.cassette,
      shain: prod.shain,
      wheels: prod.wheels,
      col: prod.col,
      reinforcingPin: prod.reinforcingPin,
      collar: prod.collar,
    })
  }
  updateProduct(){   
    this.statusButton = false
    const value = this.form.value
    const bike: IBike = {
      nameEN: value.nameEN,
      type: value.type,
      price: value.price,
      count: value.count,
      weight: value.weight,
      size: value.size,
      color: value.color,
      image: this.urlImg,
      fork: value.fork,
      steeringColumn: value.steeringColumn,
      shifters: value.shifters,
      connectingRodSystem: value.connectingRodSystem,
      brake: value.brake,
      frontSwitch: value.frontSwitch,
      rearSwitch: value.rearSwitch,
      cassette: value.cassette,
      shain: value.shain,
      wheels: value.wheels,
      col: value.col,
      reinforcingPin: value.reinforcingPin,
      collar: value.collar,
      category: "bikes",
      id:this.oneProduct.id,
      data: new Date().toLocaleDateString('en-GB', this.options)
    }
    this.form.reset();
    this.productsService.updateProduct(bike)
    this.getProduct()
    this.urlImg = null
  }
}
