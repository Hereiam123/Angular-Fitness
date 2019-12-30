import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { Exercise } from "../exercise.model";
import { TrainingService } from "../training.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-past-trainings",
  templateUrl: "./past-trainings.component.html",
  styleUrls: ["./past-trainings.component.css"]
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  private finishedExerciseSubscription: Subscription;
  displayedColumns: Array<string> = [
    "date",
    "name",
    "duration",
    "calories",
    "state"
  ];
  dataSource: MatTableDataSource<Exercise> = new MatTableDataSource<Exercise>();

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.finishedExerciseSubscription = this.trainingService.finishedExerisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      }
    );
    this.trainingService.getCompletedorCancelledExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.finishedExerciseSubscription) {
      this.finishedExerciseSubscription.unsubscribe();
    }
  }
}
