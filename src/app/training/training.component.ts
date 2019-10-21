import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription'
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  onGoingTraining: boolean = false;
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.excerciseChanged.subscribe(exercise => {
      if (exercise) {
        this.onGoingTraining = true;
      }
      else {
        this.onGoingTraining = false;
      }
    })
  }
}
