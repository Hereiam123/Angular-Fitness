import { Subject } from "rxjs/Subject";
import { Exercise } from "./exercise.model";
import { AngularFirestore } from "angularfire2/firestore";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { UIService } from "../shared/ui.service";
import * as UI from "../shared/ui.actions";
import * as fromRoot from "../app.reducer";
import { Store } from "@ngrx/store";

@Injectable()
export class TrainingService {
  excerciseChanged: Subject<Exercise> = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExerisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  getAvailableExercises(): void {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection("availableExcercises")
        .snapshotChanges()
        .pipe(
          map(docData => {
            return docData.map(doc => {
              const exerciseSnapShot = doc.payload.doc.data() as Exercise;
              return {
                id: doc.payload.doc.id,
                name: exerciseSnapShot.name,
                duration: exerciseSnapShot.duration,
                calories: exerciseSnapShot.calories
              };
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(
              "Fetching Exercises Failed",
              null,
              3000
            );
            this.exercisesChanged.next(null);
          }
        )
    );
  }

  startExercise(selectedValue: string): void {
    this.runningExercise = this.availableExercises.find(ex => {
      return ex.id === selectedValue;
    });
    this.excerciseChanged.next({ ...this.runningExercise });
  }

  completeExcercise(): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.excerciseChanged.next(null);
  }

  cancelExcercise(progress: number): void {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "cancelled",
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100)
    });
    this.runningExercise = null;
    this.excerciseChanged.next(null);
  }

  getRunningExercise(): Exercise {
    return { ...this.runningExercise };
  }

  getCompletedorCancelledExercises(): void {
    this.fbSubs.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            this.finishedExerisesChanged.next(exercises);
          },
          error => {
            this.uiService.showSnackBar(
              "Fetching Exercises Failed",
              null,
              3000
            );
          }
        )
    );
  }

  cancelSubscriptions(): void {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise): void {
    this.db.collection("finishedExercises").add(exercise);
  }
}
