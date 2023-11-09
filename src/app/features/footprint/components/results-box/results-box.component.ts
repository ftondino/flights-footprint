import { Component, OnInit } from '@angular/core';
import { FootprintService } from '../../services/footprint.service';

@Component({
  selector: 'app-results-box',
  templateUrl: './results-box.component.html',
  styleUrls: ['./results-box.component.scss'],
})
export class ResultsBoxComponent implements OnInit {
  results: any;
  constructor(private footprintService: FootprintService) {}
  ngOnInit() {
    this.footprintService.currentTravel.subscribe((data) => {
      if (data) {
        this.results = data;
        console.log('results', this.results);
      }
    });
  }

  newSearch() {
    this.footprintService.resetTravelData();
    this.results = null;
  }
}
