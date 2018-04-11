import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {User} from '../../users/user';
import {UserService} from '../../core/services/user.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';


@Injectable()
export class UserResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
      const id = route.paramMap.get('id');
      if (id === 'add') {
        return null;
      } else {
        return this.userService.getOne(id).take(1).map(user => {
          if (user) {
            return user;
          } else { // nid not found
            this.router.navigate(['/users']);
            return null;
          }
        });
      }
    }
}
