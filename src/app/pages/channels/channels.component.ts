import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { AutoUnsubscribe } from 'rx-angular-autounsubscribe';
import { Channel } from '../../models/channel.model';
import { MediaService } from '../../services/media.service';
import { PreferencesService } from '../../services/preferences.service';
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
  public allVideos: Video[] = [];
  public selectedChannel: Channel = null;
  public selectedVideo: Video = null;
  public searchText: string = '';

  @AutoUnsubscribe() protected updateSubscription;
  @AutoUnsubscribe() protected channelSubscription;
  @AutoUnsubscribe() protected videoSubscription;

  constructor(
    private media: MediaService,
    private preferences: PreferencesService,
    private cd: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    //
    this.setupSubscriptions();
    this.channels = this.media.channels;
    if (this.channels.length) {
      this.selectLastPlayedChannelAndVideo();
      if (this.selectedChannel) {
        this.allVideos = this.selectedChannel.videos;
        this.filterVideos();
      }
    }
  }

  public selectChannel(channel: Channel) {
    this.media.selectChannel(channel);
  }

  public searchTextChange($event) {
    this.searchText = $event;
    this.filterVideos();
  }

  private filterVideos() {
    if (this.searchText) {
      this.videos = this.allVideos
        .filter((video: Video) =>
          video.name.toLocaleLowerCase().indexOf(this.searchText.toLocaleLowerCase()) >= 0);
    } else {
      this.videos = this.allVideos;
    }
  }

  private setupSubscriptions() {
    this.updateSubscription = this.media
      .onMediaUpdated.subscribe(() => {
        this.channels = this.media.channels;
        this.selectLastPlayedChannelAndVideo();
        this.cd.markForCheck();
      });
    this.channelSubscription = this.media
      .onChannelSelected
      .subscribe((channel: Channel) => {
        this.selectedChannel = channel;
        this.allVideos = channel.videos;
        this.filterVideos();
        this.cd.markForCheck();
      });
    this.videoSubscription = this.media
      .onVideoSelected
      .subscribe((video: Video) => {
        this.selectedVideo = video;
        this.cd.markForCheck();
      });
  }

  private selectLastPlayedChannelAndVideo() {
    const lastPlayedChannelName = this.preferences.getLastPlayedChannel();
    const lastPlayedChannel = this.channels.find((c) => c.name === lastPlayedChannelName);
    if (lastPlayedChannel) {
      this.selectChannel(lastPlayedChannel);
    }
    const lastPlayedVideoName = this.preferences.getLastPlayedVideoId();
    this.selectedVideo = lastPlayedChannel.videos.find((v) => v.url === lastPlayedVideoName);
    this.cd.markForCheck();
  }
}
