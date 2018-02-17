import { Video } from './video.model';

export class Channel {
  public videos: Video[] = [];

  constructor(
    public name: string,
    public urls: string[],
  ) { }
}
