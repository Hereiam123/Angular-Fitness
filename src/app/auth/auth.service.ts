import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";

@Injectable()
export class AuthService {
  authChange: Subject<boolean> = new Subject<boolean>();
  private user: User;

  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  registerUser(authData: AuthData): void {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => console.log(result))
      .catch(error => console.log(error));
    //this.authSuccess();
  }

  login(authData: AuthData): void {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => console.log(result))
      .catch(error => console.log(error));
    //this.authSuccess();
  }

  logout(): void {
    this.user = null;
    this.authChange.next(false);
    this.router.navigate(["/login"]);
  }

  private authSuccess(): void {
    this.authChange.next(true);
    this.router.navigate(["/training"]);
  }

  getUser(): User {
    //Need to prevent outside components and structures
    //from being allowed to manipulate interval user object
    return { ...this.user };
  }

  isAuth(): boolean {
    return this.user != null;
  }
}
