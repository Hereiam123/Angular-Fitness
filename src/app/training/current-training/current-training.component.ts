import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StopTrainingComponent } from "./stop-training.component";
import { TrainingService } from '../training.service';

@Component({
  selector: "app-current-training",
  templateUrl: "./current-training.component.html",
  styleUrls: ["./current-training.component.css"]
})
export class CurrentTrainingComponent implements OnInit {
  progress: number = 0;
  timer: number;
  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit() {
    this.startOrResumeTimer()
  }

  startOrResumeTimer(): void {
    const step: number = this.trainingService.getRunningExercise().duration / 60 * 1000;
    //Why can I do this?
    //The interval returns an ID, I believe
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, step);
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
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
