import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

export interface DialogData {
  progress: number;
}

@Component({
  selector: "app-stop-training",
  template: `
    <h1 mat-dialog-title>Are you sure?</h1>
    <mat-dialog-content>
      <p>You already got {{ data.progress }}%</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true">Yes</button>
      <button mat-button [mat-dialog-close]="false">No</button>
    </mat-dialog-actions>
  `
})
export class StopTrainingComponent {
  //MAT_DIALOG_DATA allows passing in data, and
  //Angular material uses this constant as an identifier
  //for the data
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
