import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Station } from '../models/station.model';
import { Video } from '../models/video.model';

const STATIONS_URL = '/assets/stations.json';

@Injectable()
export class StationsService {
  public stations: Station[] = [];
  constructor(public httpClient: HttpClient) { }

  public fetchFromLocalStorage() {
    if (window && window.localStorage) {
      try {
        const savedStations = window.localStorage.getItem('stations');
        if (savedStations) {
          const stationsJson = JSON.parse(savedStations);
          this.stations = this.rawStationsToModels(stationsJson);
        }
      } catch (error) {
        this.stations = [];
        console.error(error);
      }
    }
  }

  public fetchStations() {
    return this.httpClient
      .get(STATIONS_URL)
      .toPromise()
      .then((stationsJson) => {
        if (stationsJson instanceof Array) {
          this.stations = this.rawStationsToModels(stationsJson);
          this.stations.forEach((station) => {
            this.fetchVideosForStation(station)
              .then((videos: Video[]) => station.videos = videos);
          });
          this.saveToLocalStorage();
        } else {
          this.stations = [];
          console.error('Invalid structure of stations.json');
        }
      }, (error) => console.error(error));
  }

  private fetchVideosForStation(station: Station): Promise<Video[]> {
    const promises = station.urls.map((url) => this.fetchVideosFromUrl(url));
    return Promise.all(promises)
      .then((results) => results.reduce((prev, curr) => prev.concat(...curr), []));
  }

  private fetchVideosFromUrl(url: string): Promise<Video[]> {
    return this.httpClient
      .get(url)
      .toPromise()
      .then((items: any[]) =>
        items
          .filter((item) => item.type === 'file')
          .map(({ name, size }) => new Video(name, size, name))
      );
  }

  private rawStationsToModels(json: any[]): Station[] {
    return json.map(({ name, urls }) => new Station(name, urls || []));
  }

  private saveToLocalStorage() {
    if (window && window.localStorage) {
      try {
        window.localStorage.setItem('stations', JSON.stringify(this.stations));
      } catch (error) {
        // nothing 2 do
      }
    }
  }
}
