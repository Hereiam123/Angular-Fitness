import { Subject } from "rxjs/Subject";
import { Exercise } from "./exercise.model";
import { AngularFirestore } from "angularfire2/firestore";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { UIService } from "../shared/ui.service";
import * as UI from "../shared/ui.actions";
import * as Training from "./training.actions";
import * as fromTraining from "./training.reducer";
import { Store } from "@ngrx/store";
import { take } from "rxjs/operators";

@Injectable()
export class TrainingService {
  finishedExerisesChanged = new Subject<Exercise[]>();

  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
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
            this.store.dispatch(new Training.SetAvailableTrainings(exercises));
          },
          error => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(
              "Fetching Exercises Failed",
              null,
              3000
            );
            this.store.dispatch(new Training.SetAvailableTrainings(null));
          }
        )
    );
  }

  startExercise(selectedValue: string): void {
    this.store.dispatch(new Training.StartTraining(selectedValue));
  }

  completeExcercise(): void {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        this.addDataToDatabase({
          ...exercise,
          date: new Date(),
          state: "completed"
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  cancelExcercise(progress: number): void {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe(exercise => {
        this.addDataToDatabase({
          ...this.runningExercise,
          date: new Date(),
          state: "cancelled",
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100)
        });
        this.store.dispatch(new Training.StopTraining());
      });
  }

  getCompletedorCancelledExercises(): void {
    this.fbSubs.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));
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
