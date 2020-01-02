import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { AuthService } from "src/app/auth/auth.service";
@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  @Output() sideNavToggle: EventEmitter<void> = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onLogout(): void {
    this.authService.logout();
  }

  onToggleSideNav(): void {
    this.sideNavToggle.emit();
  }
}
