import { Subject } from 'rxjs/Subject'
import { Exercise } from './exercise.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService {
    excerciseChanged: Subject<Exercise> = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];

    private runningExercise: Exercise;
    private exercises: Exercise[] = [];

    constructor(private db: AngularFirestore) { }

    getAvailableExercises(): void {
        this.db.collection('availableExcercises').snapshotChanges().pipe(map(docData => {
            return docData.map(doc => {
                return {
                    id: doc.payload.doc.id,
                    name: doc.payload.doc.data().name,
                    duration: doc.payload.doc.data().duration,
                    calories: doc.payload.doc.data().calories
                }
            })
        }
        )).subscribe((exercises: Exercise[]) => {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
        });
    }

    startExercise(selectedValue: string): void {
        this.runningExercise = this.availableExercises.find(ex => {
            return ex.id === selectedValue
        });
        this.excerciseChanged.next({ ...this.runningExercise })
    }

    completeExcercise(): void {
        this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'completed' });
        this.runningExercise = null;
        this.excerciseChanged.next(null);
    }

    cancelExcercise(progress: number): void {
        this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'cancelled', duration: this.runningExercise.duration * (progress / 100), calories: this.runningExercise.calories * (progress / 100) });
        this.runningExercise = null;
        this.excerciseChanged.next(null);
    }

    getRunningExercise(): Exercise {
        return { ...this.runningExercise };
    }

    getCompletedorCancelledExercises(): Exercise[] {
        return this.exercises.slice();
    }
}