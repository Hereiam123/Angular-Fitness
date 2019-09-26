import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable()
export class AuthService {
  authChange: Subject<boolean> = new Subject<boolean>();
  private user: User;

  constructor(private router: Router) {}

  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccess();
  }

  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authSuccess();
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
