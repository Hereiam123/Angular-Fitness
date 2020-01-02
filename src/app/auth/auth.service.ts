import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";
import { Store } from "@ngrx/store";
import * as fromApp from "../app.reducer";

@Injectable()
export class AuthService {
  authChange: Subject<boolean> = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ ui: fromApp.State }>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(["/login"]);
      }
    });
  }

  registerUser(authData: AuthData): void {
    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({ type: "START_LOADING" });
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(() => this.uiService.loadingStateChanged.next(false))
      .catch(error => {
        //this.uiService.loadingStateChanged.next(false);
        this.store.dispatch({ type: "STOP_LOADING" });
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  login(authData: AuthData): void {
    //this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({ type: "START_LOADING" });
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(() => this.uiService.loadingStateChanged.next(false))
      .catch(error => {
        //this.uiService.loadingStateChanged.next(false);
        this.store.dispatch({ type: "STOP_LOADING" });
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  logout(): void {
    this.afAuth.auth.signOut();
  }

  isAuth(): boolean {
    return this.isAuthenticated;
  }
}
