import {Injectable} from '@angular/core';
import {INITIAL_STATE} from './state';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class Store {
  state = INITIAL_STATE;
  state$ = new BehaviorSubject(this.state);
  sub = this.state$.subscribe.bind(this);
  pub(_state) {
    this.state = _state;
    this.state$.next(this.state);
  }
}
