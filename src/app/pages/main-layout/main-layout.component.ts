import { Component, OnInit } from '@angular/core';

import { StationsService } from '../../services/stations.service';

@Component({
  selector: 'main-layout',
  templateUrl: 'main-layout.component.html'
})

export class MainLayoutComponent implements OnInit {
  constructor(public stations: StationsService) { }

  ngOnInit() {
    this.stations.fetchFromLocalStorage();
    this.stations.fetchStations();
  }
}
