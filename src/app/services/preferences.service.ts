import { Channel } from '../models/channel.model';
import { Injectable } from '@angular/core';
import { MediaService } from './media.service';
import { Video } from '../models/video.model';

@Injectable()
export class PreferencesService {

  public getLastPlayedVideoId(): string {
    try {
      if (window && window.localStorage) {
        return window.localStorage.getItem('lastPlayedVideo');
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public setLastPlayedVideo(video: Video) {
    try {
      if (window && window.localStorage) {
        window.localStorage.setItem('lastPlayedVideo', video.url);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public getLastPlayedChannel(): string {
    try {
      if (window && window.localStorage) {
        return window.localStorage.getItem('lastPlayedChannel');
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public setLastPlayedChannel(channel: Channel) {
    try {
      if (window && window.localStorage) {
        window.localStorage.setItem('lastPlayedChannel', channel.name);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public getVolume(): number {
    try {
      if (window && window.localStorage) {
        const storedVolume = window.localStorage.getItem('volume');
        return storedVolume ? +storedVolume : 1.0;
      } else {
        return 1.0;
      }
    } catch (error) {
      console.error(error);
      return 1.0;
    }
  }

  public setVolume(volume: number) {
    try {
      if (window && window.localStorage) {
        window.localStorage.setItem('volume', '' + volume);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
