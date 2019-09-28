import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {

  @Output() trainingStart: EventEmitter<void> = new EventEmitter<void>();
  possibleExercises: Exercise[];

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.possibleExercises = this.trainingService.getAvailableExercises()
  }

  onStartTraining(): void {
    this.trainingStart.emit();
  }
}
