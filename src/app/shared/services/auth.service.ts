import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import "firebase/firestore";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { IUser } from '../interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: "root",
})
export class AuthService {
  currentUser = new Subject();
  justUser;
  currentOrders
  userStatus: string;
  userChecker: boolean;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private ngZone: NgZone,
    private toastr: ToastrService
  ) { }


  isLogin(): boolean {
    return this.userChecker;
  }
  getUserToken(id) {
    this.ngZone.run(() => this.router.navigate(["/products", "bikes", 'all']))
    this.firestore.collection('user').ref.where('id', '==', id).limit(1).onSnapshot(data => {
      data.forEach(user => {
        this.justUser = user.data()
        this.currentUser.next(user.data())
        this.getUserData(this.justUser.userName)
        if (this.justUser.role === 'admin') {
          this.userChecker = true;
        }
      });
    })
  }

  getUserData(email) {
    this.firestore.collection('orders').ref.where('email', '==', email).orderBy('data','desc').limit(1).onSnapshot(data => {
      data.forEach(user => {
        this.currentOrders = user.data()
      });
    })
  }
  showSuccessRegistrationToaster() {
    this.toastr["success"]("Ласкаво просимо", "Успішна Реєстрація")
  }
  showSuccessSignInToaster() {
    this.toastr["success"]("Ласкаво просимо", "Успішний вхід")
  }
  showErrorSignInToaster() {
    this.toastr["error"]("Невірно введенний логін або пароль", "Помилка реєстрації")
  }
  showErrorReigstrationToaster() {
    this.toastr["error"]("Такий логін уже існує", "Помилка реєстрації")
  }
  showLogOutToaster() {
    this.toastr["success"]("Чекаємо наступної зустрічі!", "Успішний вихід")
  }
  randomId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  login(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password)
      .then((user) => {
        this.firestore
          .collection("user")
          .ref.where("userName", "==", user.user.email)
          .onSnapshot((snap) => {
            snap.forEach((userRef) => {
              this.justUser = userRef.data();
              this.currentUser.next(userRef.data());
              this.getUserData(this.justUser.userName)
              this.myToken(this.justUser.id)
              if (userRef.data().role !== "admin") {
                this.ngZone.run(() => this.router.navigate(["/order"]))
              } else {
                this.userChecker = true;
                this.ngZone.run(() => this.router.navigate(["/admin"]))
              }
              this.showSuccessSignInToaster()
            });
          });
      })
      .catch((err)=>{
        this.showErrorSignInToaster()
      })
  }

  myToken(id) {
    localStorage.setItem("token", JSON.stringify(id))
  }

  signUp(email: string, password: string, userName: string) {
    this.auth
      .createUserWithEmailAndPassword(email, password)
      .then((userResponse) => {
        const user: IUser = {
          id: userResponse.user.uid,
          userName: userResponse.user.email,
          role: "user",
          name: userName,
        };
        this.myToken(user.id)
        this.firestore
          .collection("user")
          .add(user)
          .then((user) => {
            user.get().then((u) => {
              this.currentUser.next(u.data());
              this.justUser = u.data();
              this.showSuccessRegistrationToaster()
              this.ngZone.run(() => this.router.navigate(["/home"]))
            });
          })
          .catch((err) => {
            this.showErrorReigstrationToaster()
          });
      })
      .catch((err) => {
        this.showErrorReigstrationToaster()
      });
  }

  getAllUser() {
    return this.firestore.collection('user').snapshotChanges()
  }

  logOut() {
    this.auth
      .signOut()
      .then(() => {
        this.currentUser.next(null);
        this.justUser = null;
        this.userChecker = false;
        this.currentOrders = null;
        localStorage.setItem('token', JSON.stringify(""))
        this.ngZone.run(() => this.router.navigate(["/sign"]))
        this.showLogOutToaster()
      })
      .catch((err) => {
        console.log("Sign out", err);
      });
  }
}
