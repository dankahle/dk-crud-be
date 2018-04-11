import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute} from '@angular/router';
import {Store} from '../../store/store';
import * as _ from 'lodash';
import {UserService} from '../../core/services/user.service';
import '../../shared/observable-additions';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
/**
 * InitializationGuard
 * desc - provide a complex hierarchy of initialization "before" app starts up including dependecies of dependencies
 */
export class InitializationGuard implements CanActivate {
  response$ = new Subject<boolean>();

  constructor(private store: Store,
              private route: ActivatedRoute,
              private userService: UserService) {

  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleCanActivate();
  }

  canActivateChild(next: ActivatedRouteSnapshot,
                   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.handleCanActivate();
  }

  handleCanActivate() {
    if (this.store.state.initialized) {
      return true;
    } else {
      this.init();
      return this.response$;
    }
  }

  init() {
    // console.log('initguard start');

    // an example of a complex initialization flow with dependencies of dependencies
    Observable.forkJoin(this.userService.getAll({networkOnly: true}))
      .map(x => {
        // console.log('initguard done');
        this.store.pub({...this.store.state, initialized: true});
        this.afterInit();
        this.response$.next(true);
        return true;
      })
      .catch(err => {
        this.response$.next(false);
        return Observable.throw(err);
      })
      .subscribe();
  }

  afterInit() {
  }
}

