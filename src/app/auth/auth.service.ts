import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs/Subject";

export class AuthService {
  authChange: Subject<boolean> = new Subject<boolean>();
  private user: User;
  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authChange.next(true);
  }

  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
    this.authChange.next(true);
  }

  logout(): void {
    this.user = null;
    this.authChange.next(false);
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
