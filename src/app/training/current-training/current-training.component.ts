import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StopTrainingComponent } from "./stop-training.component";
import { TrainingService } from "../training.service";
import { Store } from "@ngrx/store";
import * as fromTraining from "../training.reducer";
import { take } from "rxjs/operators";

@Component({
  selector: "app-current-training",
  templateUrl: "./current-training.component.html",
  styleUrls: ["./current-training.component.css"]
})
export class CurrentTrainingComponent implements OnInit {
  progress: number = 0;
  timer: number;
  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer(): void {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        const step: number = (exercise.duration / 60) * 1000;
        this.timer = setInterval(() => {
          this.progress = this.progress + 1;
          if (this.progress >= 100) {
            this.trainingService.completeExcercise();
            clearInterval(this.timer);
          }
        }, step);
      });
  }

  onStop(): void {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    //Action values returned from dialog after closed
    //Should contain the button value clicked
    //within the dialog
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExcercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
