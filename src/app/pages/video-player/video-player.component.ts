import * as videojs from 'video.js';

import { AfterViewInit, Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Channel } from '../../models/channel.model';
import { MediaService } from '../../services/media.service';
import { Video } from '../../models/video.model';

@Component({
  selector: 'video-player',
  templateUrl: 'video-player.component.html'
})

export class VideoPlayerComponent implements OnInit, AfterViewInit {

  public url: string;

  private player;
  private channel: Channel;
  private video: Video;

  constructor(
    private activatedRoute: ActivatedRoute,
    private media: MediaService,
  ) { }

  public ngOnInit(): void {
    this.activatedRoute
      .params
      .subscribe(({ channel, video }) => {
        this.channel = this.media.getChannel(channel);
        if (this.channel) {
          this.video = this.media.getVideo(this.channel, video);
        } else {
          this.video = null;
        }
      });
  }

  public ngAfterViewInit() {
    // ID with which to access the template's video element
    const el = 'video_player';

    // setup the player via the unique element ID
    const element = document.getElementById(el);
    const player = this.player = videojs(element, {
      autoplay: true
    });
    player.on('ended', () => this.playNextVideo());

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
}
