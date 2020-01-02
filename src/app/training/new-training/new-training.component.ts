import { Component, OnInit } from "@angular/core";
import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { NgForm } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit {
  possibleExercises: Exercise[];
  isLoading$: Observable<boolean>;
  private exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises: Exercise[]) => {
        this.possibleExercises = exercises;
      }
    );
    this.getExercises();
  }

  getExercises(): void {
    this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }
}
