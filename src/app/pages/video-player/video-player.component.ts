import * as videojs from 'video.js';

import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { AutoUnsubscribe } from 'rx-angular-autounsubscribe';
import { Channel } from '../../models/channel.model';
import { MediaService } from '../../services/media.service';
import { PreferencesService } from '../../services/preferences.service';
import { Video } from '../../models/video.model';

@Component({
  selector: 'video-player',
  templateUrl: 'video-player.component.html',
  styleUrls: ['video-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

  public url: string;
  public channel: Channel;
  public video: Video;

  @AutoUnsubscribe() protected routeSubscription;
  @AutoUnsubscribe() protected mediaSubscription;

  private player;
  private params: any = {};
  private intervalHandler;

  constructor(
    private activatedRoute: ActivatedRoute,
    private preferences: PreferencesService,
    private media: MediaService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.routeSubscription = this.activatedRoute
      .params
      .subscribe(({ channel, video, index }) => {
        this.params = { channel, video, index };
        this.fetchVideoUrl();
        this.cd.markForCheck();
      });
    this.mediaSubscription = this.media.onMediaUpdated
      .subscribe(() => {
        if (this.params) {
          this.fetchVideoUrl();
          this.startPlayback();
        }
        this.cd.markForCheck();
      });
    this.intervalHandler = setInterval(() => this.markPoistionLru(), 1000);
  }

  public ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
    clearInterval(this.intervalHandler);
  }

  public ngAfterViewInit() {
    // ID with which to access the template's video element
    const el = 'video_player';

    // setup the player via the unique element ID
    const element = document.getElementById(el);
    const player = this.player = videojs(el, {
      // player options
    });
    player.on('ended', () => {
      this.media.removePositionLru(this.video);
      this.playNextVideo();
    });
    this.startPlayback();
  }

  public goToChannels() {
    this.router.navigate(['/channels']);
  }

  private playNextVideo() {
    const nextVideo = this.media.getNextVideo(this.channel, this.video);
    if (nextVideo) {
      this.media.navigateTo(this.channel, nextVideo);
    }
  }

  private startPlayback() {
    if (this.channel && this.video) {
      this.preferences.setLastPlayedChannel(this.channel);
      this.preferences.setLastPlayedVideo(this.video);
    }
    if (this.video && this.player) {
      const url = this.media.getFullUrl(this.channel, this.video);
      const position = this.media.getPositionLru(this.video);
      this.player.ready(() => {
        this.player.src(url);
        this.player.currentTime(position);
        this.player.play();
        this.player.requestFullscreen();
      });
    }
  }

  private fetchVideoUrl() {
    const { channel, video, index } = this.params;
    const indexNum = +index;
    this.channel = this.media.getChannel(channel);
    if (this.channel) {
      this.video = this.media.getVideo(this.channel, indexNum, video);
      this.startPlayback();
    } else {
      this.video = null;
    }
  }

  private markPoistionLru() {
    if (this.video && this.player && !this.player.paused()) {
      this.media.addPositionLru(this.video, this.player.currentTime());
    }
  }
}
