import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatTableDataSource, MatSort, MatPaginator } from "@angular/material";
import { Exercise } from "../exercise.model";
import { TrainingService } from "../training.service";
import { Store } from "@ngrx/store";
import * as fromTraining from "../training.reducer";

@Component({
  selector: "app-past-trainings",
  templateUrl: "./past-trainings.component.html",
  styleUrls: ["./past-trainings.component.css"]
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
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

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) {}

  ngOnInit() {
    this.store
      .select(fromTraining.getFinishedExercises)
      .subscribe((exercises: Exercise[]) => {
        this.dataSource.data = exercises;
      });
    this.trainingService.getCompletedorCancelledExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
