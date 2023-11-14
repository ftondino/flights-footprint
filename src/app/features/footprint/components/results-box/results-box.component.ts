import { Component, OnInit, OnDestroy } from '@angular/core';
import { FootprintService } from '../../services/footprint.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-results-box',
  templateUrl: './results-box.component.html',
  styleUrls: ['./results-box.component.scss'],
})
export class ResultsBoxComponent implements OnInit, OnDestroy {
  results: any;
  private subscription: Subscription | undefined;

  constructor(private footprintService: FootprintService) {}

  ngOnInit() {
    this.subscription = this.footprintService.currentTravel.subscribe(
      (data) => {
        if (data) {
          this.results = data;
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.results = null;
    this.footprintService.resetTravelData();
  }

  newSearch() {
    this.footprintService.resetTravelData();
    this.results = null;
  }
}
