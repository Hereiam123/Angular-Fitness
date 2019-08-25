import { NgModule } from '@angular/core';
import { MatButtonModule, MatSidenavModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MatCheckboxModule } from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule
  ],
  exports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSidenavModule
  ]
})
export class MaterialModule {}
