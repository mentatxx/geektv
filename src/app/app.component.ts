import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { PreferencesService } from './services/preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(public preferences: PreferencesService) { }

  public ngOnInit(): void {
    const lastPlayedChannel = this.preferences.getLastPlayedChannel();
    const lastPlayedVideo = this.preferences.getLastPlayedChannel();
  }
}
