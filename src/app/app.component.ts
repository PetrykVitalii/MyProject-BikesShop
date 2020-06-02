import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myShop';
  constructor(private authService:AuthService){}
  ngOnInit(): void {
    this.getToken()
  }

  getToken(){
    if(localStorage.getItem("token")){
      this.authService.getUserToken(JSON.parse(localStorage.getItem("token")))
    }
  }
}
