import { User } from "./user.model";
import { AuthData } from "./auth-data.model";

export class AuthService {
  private user: User;
  registerUser(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
  }

  login(authData: AuthData): void {
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
  }

  logout(): void {
    this.user = null;
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
