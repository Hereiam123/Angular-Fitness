import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { TrainingService } from "../training/training.service";

@Injectable()
export class AuthService {
  authChange: Subject<boolean> = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService
  ) {}

  registerUser(authData: AuthData): void {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => this.authSuccess())
      .catch(error => console.log(error));
  }

  login(authData: AuthData): void {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => this.authSuccess())
      .catch(error => console.log(error));
  }

  logout(): void {
    this.trainingService.cancelSubscriptions();
    this.isAuthenticated = false;
    this.authChange.next(false);
    this.router.navigate(["/login"]);
  }

  private authSuccess(): void {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(["/training"]);
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
