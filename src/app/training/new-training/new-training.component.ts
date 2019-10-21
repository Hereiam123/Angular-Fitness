import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {

  possibleExercises: Exercise[];

  constructor(private trainingService: TrainingService) {

  }

  ngOnInit() {
    this.possibleExercises = this.trainingService.getAvailableExercises()
  }

  onStartTraining(): void {
    this.trainingService.startExercise();
  }
}
