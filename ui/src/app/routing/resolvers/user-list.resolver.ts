import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {User} from '../../users/user';
import {UserService} from '../../core/services/user.service';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';


@Injectable()
export class UserListResolver implements Resolve<User[]> {
    constructor(private userService: UserService, private router: Router) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User[]> {
        const id = parseInt(route.paramMap.get('id'), 10);

        return this.userService.getAll({networkOnly: false}).take(1).map(users => {
            if (users) {
                return users;
            } else {
                return null;
            }
        });
    }
}
