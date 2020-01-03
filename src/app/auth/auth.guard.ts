import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Route,
  CanLoad
} from "@angular/router";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import * as fromRoot from "../app.reducer";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private store: Store<fromRoot.State>) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }

  canLoad(route: Route): Observable<boolean> {
    return this.store.select(fromRoot.getIsAuthenticated).pipe(take(1));
  }
}
