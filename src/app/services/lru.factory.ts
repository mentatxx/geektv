import { Injectable } from '@angular/core';
import { LruList } from './lru-list';

@Injectable()
export class LruService {

  public factory(prefix: string): LruList {
    return new LruList(prefix);
  }
}
