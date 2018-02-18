import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from 'rx-angular-autounsubscribe';
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

  @AutoUnsubscribe() protected updateSubscription;
  @AutoUnsubscribe() protected channelSubscription;

  constructor(
    private media: MediaService,
    private cd: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    //
    this.channels = this.media.channels;
    this.updateSubscription = this.media.onMediaUpdated.subscribe(() => {
      this.channels = this.media.channels;
      this.cd.markForCheck();
    });
    this.channelSubscription = this.media
      .onChannelSelected
      .subscribe((channel: Channel) => {
        this.videos = channel.videos;
        this.cd.markForCheck();
      });
  }
}
