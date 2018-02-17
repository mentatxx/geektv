import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Channel } from '../../models/channel.model';
import { MediaService } from '../../services/media.service';
import { Video } from '../../models/video.model';

@Component({
  selector: 'channels',
  templateUrl: 'channels.component.html',
  styleUrls: ['channels.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ChannelsComponent implements OnInit {

  public channels: Channel[] = [];
  public videos: Video[] = [];

  constructor(private media: MediaService) { }

  public ngOnInit() {
    //
    this.channels = this.media.channels;

  }
}
