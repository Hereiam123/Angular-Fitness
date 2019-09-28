import { Component, OnInit, EventEmitter, Output, Inject } from '@angular/core';
import { TrainingService } from '../training.service';
import { Excercise } from '../excercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {

  @Output() trainingStart: EventEmitter<void> = new EventEmitter<void>();
  possibleExcercises: Excercise[];

  constructor(trainingService: TrainingService) {
    this.possibleExcercises = trainingService.availableExcercises
  }

  ngOnInit() {
  }

  onStartTraining(): void {
    this.trainingStart.emit();
  }
}
