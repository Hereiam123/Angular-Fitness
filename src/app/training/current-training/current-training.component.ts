import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material";
import { StopTrainingComponent } from "./stop-training.component";

@Component({
  selector: "app-current-training",
  templateUrl: "./current-training.component.html",
  styleUrls: ["./current-training.component.css"]
})
export class CurrentTrainingComponent implements OnInit {
  @Output() trainingExitEvent: EventEmitter<void> = new EventEmitter<void>();
  progress: number = 0;
  timer: number;
  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    //Why can I do this?
    //The interval returns an ID, I believe
  }

  startOrResumeTimer(): void {
    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      if (this.progress >= 100) {
        clearInterval(this.timer);
      }
    }, 1000);
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
        this.trainingExitEvent.emit();
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
