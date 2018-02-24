import { Channel } from '../models/channel.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LruList } from './lru-list';
import { LruService } from './lru.factory';
import { PreferencesService } from './preferences.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { Video } from '../models/video.model';

const CHANNELS_URL = '/assets/stations.json';

@Injectable()
export class MediaService {
  public channels: Channel[] = [];
  public selectedChannel: Channel = null;
  public selectedVideo: Video = null;
  public onChannelSelected = new Subject<Channel>();
  public onVideoSelected = new Subject<Video>();
  public onMediaUpdated = new Subject<void>();
  public positionLru: LruList = null;

  constructor(
    public httpClient: HttpClient,
    public preferences: PreferencesService,
    private router: Router,
    private lruFactory: LruService,
  ) {
    this.positionLru = lruFactory.factory('position');
  }

  public fetchFromLocalStorage() {
    if (window && window.localStorage) {
      try {
        const savedChannels = window.localStorage.getItem('channels');
        if (savedChannels) {
          const channelsJson = JSON.parse(savedChannels);
          this.channels = this.rawChannelsToModels(channelsJson);
        }
      } catch (error) {
        this.channels = [];
        console.error(error);
      }
    }
  }

  public fetchChannels() {
    return this.httpClient
      .get(CHANNELS_URL)
      .toPromise()
      .then((channelsJson) => {
        if (channelsJson instanceof Array) {
          this.channels = this.rawChannelsToModels(channelsJson);
          this.channels.forEach((channel) => {
            this.fetchVideosForChannel(channel)
              .then((videos: Video[]) => channel.videos = videos)
              .then(() => this.saveToLocalStorage())
              .then(() => this.onMediaUpdated.next());
          });
        } else {
          this.channels = [];
          console.error('Invalid structure of stations.json');
        }
      }, (error) => console.error(error));
  }

  public getChannel(channelId: string): Channel {
    return this.channels.find((c) => c.name === channelId);
  }

  public getVideo(channel: Channel, index: number, videoId: string): Video {
    return channel.videos.find((v) => v.url === videoId && v.idx === index);
  }

  public getNextVideo(channel: Channel, video: Video): Video {
    if (channel) {
      const idx = channel.videos.indexOf(video);
      if (idx < 0) {
        return channel.videos.length ? channel.videos[0] : null;
      } else {
        return idx < channel.videos.length - 1 ?
          channel.videos[idx + 1] : channel.videos[0];
      }
    } else {
      return null;
    }
  }

  public selectChannel(channel: Channel) {
    this.selectedChannel = channel;
    this.onChannelSelected.next(channel);
    this.preferences.setLastPlayedChannel(channel);
  }

  public selectVideo(video: Video) {
    this.selectedVideo = video;
    this.onVideoSelected.next(video);
    this.preferences.setLastPlayedVideo(video);
  }

  public getFullUrl(channel: Channel, video: Video) {
    if (channel && video) {
      return channel.urls[video.idx] + '/' + video.url;
    }
  }

  public navigateTo(channel: Channel, video: Video) {
    this.router.navigate(['/video', channel.name, video.idx, video.url]);
  }

  public addPositionLru(video: Video, position: number) {
    if (!video) {
      return;
    }
    this.positionLru.addToLruList(video.name, position);
  }

  public removePositionLru(video: Video) {
    if (!video) {
      return;
    }
    this.positionLru.removeFromLruList(video.name);
  }

  public getPositionLru(video: Video): number {
    if (!video) {
      return 0;
    }
    return this.positionLru.getFromLruList(video.name) || 0;
  }

  private fetchVideosForChannel(channel: Channel): Promise<Video[]> {
    const promises = channel.urls.map((url, index) => this.fetchVideosFromUrl(url, index));
    return Promise.all(promises)
      .then((results) => results.reduce((prev, curr) => prev.concat(...curr), []));
  }

  private fetchVideosFromUrl(url: string, streamIndex: number): Promise<Video[]> {
    return this.httpClient
      .get(url)
      .toPromise()
      .then((items: any[]) =>
        items
          // TODO: include sub-directories
          .filter((item) => item.type === 'file')
          .map(({ name, size }) => new Video(name, size, this.escapeName(name), streamIndex)),
        (error) => {
          console.error(error);
          return [];
        });
  }

  private rawChannelsToModels(json: any[]): Channel[] {
    return json.map(({ name, urls }) => new Channel(name, urls || []));
  }

  private saveToLocalStorage() {
    if (window && window.localStorage) {
      try {
        window.localStorage.setItem('stations', JSON.stringify(this.channels));
      } catch (error) {
        // nothing 2 do
      }
    }
  }

  private escapeName(name) {
    return encodeURIComponent(name).replace(/[!'()*]/g, (c) => {
      // Also encode !, ', (, ), and *
      return '%' + c.charCodeAt(0).toString(16);
    });
  }
}
