import * as videojs from 'video.js';

import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Channel } from '../../models/channel.model';
import { MediaService } from '../../services/media.service';
import { PreferencesService } from '../../services/preferences.service';
import { Video } from '../../models/video.model';

@Component({
  selector: 'video-player',
  templateUrl: 'video-player.component.html',
  styleUrls: ['video-player.component.scss']
})

export class VideoPlayerComponent implements OnInit, OnDestroy, AfterViewInit {

  public url: string;

  private player;
  private channel: Channel;
  private video: Video;

  constructor(
    private activatedRoute: ActivatedRoute,
    private preferences: PreferencesService,
    private media: MediaService,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute
      .params
      .subscribe(({ channel, video, index }) => {
        const indexNum = +index;
        this.channel = this.media.getChannel(channel);
        if (this.channel) {
          this.video = this.media.getVideo(this.channel, indexNum, video);
          this.startPlayback();
        } else {
          this.video = null;
        }
      });
  }

  public ngOnDestroy(): void {
    if (this.player) {
      this.player.dispose();
      this.player = null;
    }
  }

  public ngAfterViewInit() {
    // ID with which to access the template's video element
    const el = 'video_player';

    // setup the player via the unique element ID
    const element = document.getElementById(el);
    const player = this.player = videojs(el, {
      autoplay: true
    });
    player.on('ended', () => this.playNextVideo());
    this.startPlayback();

    // Make up an aspect ratio
    // const aspectRatio = 264 / 640;

    // internal method to handle a window resize event to adjust the video player
    // const resizeVideoJS = () => {
    //   const width = document.getElementById(id).parentElement.offsetWidth;
    //   myPlayer.width(width).height(width * aspectRatio);
    // };

    // Initialize resizeVideoJS()
    // resizeVideoJS();

    // Then on resize call resizeVideoJS()
    // window.onresize = resizeVideoJS;
  }

  private playNextVideo() {
    // TODO:
  }

  private startPlayback() {
    if (this.channel && this.video) {
      this.preferences.setLastPlayedChannel(this.channel);
      this.preferences.setLastPlayedVideo(this.video);
    }
    if (this.video && this.player) {
      const url = this.media.getFullUrl(this.channel, this.video);
      this.player.src(url);
    }
  }

}
