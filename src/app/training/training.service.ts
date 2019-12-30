import { Subject } from "rxjs/Subject";
import { Exercise } from "./exercise.model";
import { AngularFirestore } from "angularfire2/firestore";
import { map } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

@Injectable()
export class TrainingService {
  excerciseChanged: Subject<Exercise> = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExerisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  getAvailableExercises(): void {
    this.fbSubs.push(
      this.db
        .collection("availableExcercises")
        .snapshotChanges()
        .pipe(
          map(docData => {
            return docData.map(doc => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.data().name,
                duration: doc.payload.doc.data().duration,
                calories: doc.payload.doc.data().calories
              };
            });
          })
        )
        .subscribe((exercises: Exercise[]) => {
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        })
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
        .subscribe((exercises: Exercise[]) => {
          this.finishedExerisesChanged.next(exercises);
        })
    );
  }

  cancelSubscriptions(): void {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise): void {
    this.db.collection("finishedExercises").add(exercise);
  }
}
