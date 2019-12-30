import { NgModule } from "@angular/core";
import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { AngularFireAuthModule } from "angularfire2/auth";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [AngularFireAuthModule, ReactiveFormsModule, SharedModule],
  exports: []
})
export class AuthModule {}
