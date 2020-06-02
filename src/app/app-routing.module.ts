import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';


import { ProductsComponent } from './pages/products/products.component';
import { HomeComponent } from './pages/home/home.component';
import { SignComponent } from './pages/sign/sign.component';
import { ProductsDetComponent } from './pages/products-det/products-det.component';
import { BasketComponent } from './pages/basket/basket.component';
import { OrderComponent } from './pages/order/order.component';


import { AdminComponent } from './admin/admin.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminComponentsComponent } from './admin/admin-components/admin-components.component';
import { AdminOrderComponent } from './admin/admin-order/admin-order.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: "home", component: HomeComponent },
  { path: "products/:category/:type", component: ProductsComponent },
  { path: "products/:category/:type/:id", component: ProductsDetComponent },
  { path: "basket", component: BasketComponent },
  { path: "sign", component: SignComponent },
  { path: "order", component: OrderComponent },
  {
    path: "admin", component: AdminComponent,canActivate:[AuthGuard], children:
      [
        { path: '', pathMatch: 'full', redirectTo: 'bike' },
        { path: "bike", component: AdminProductsComponent },
        { path: "component", component: AdminComponentsComponent },
        { path: "allOrder", component: AdminOrderComponent }
      ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }