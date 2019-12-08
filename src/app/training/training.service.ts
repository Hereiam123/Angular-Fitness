import { Subject } from 'rxjs/Subject'
import { Exercise } from './exercise.model';

export class TrainingService {
    excerciseChanged: Subject<Exercise> = new Subject<Exercise>();
    private availableExercises: Exercise[] = [
        { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
        { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
        { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
        { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    ];

    private runningExercise: Exercise;
    private exercises: Exercise[] = [];

    getAvailableExercises(): Exercise[] {
        return this.availableExercises.slice()
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