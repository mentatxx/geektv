import { Video } from './video.model';

export class Station {
  public videos: Video[] = [];

  constructor(
    public name: string,
    public urls: string[],
  ) { }
}
