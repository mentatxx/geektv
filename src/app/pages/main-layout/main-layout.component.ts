import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MediaService } from '../../services/media.service';

@Component({
  selector: 'main-layout',
  templateUrl: 'main-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MainLayoutComponent implements OnInit {
  constructor(public media: MediaService) { }

  ngOnInit() {
    this.media.fetchFromLocalStorage();
    this.media.fetchChannels();
  }
}
