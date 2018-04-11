import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../user';
import * as _ from 'lodash';
import {UserService} from '../../core/services/user.service';
import {Apollo} from 'apollo-angular';
import * as Joi from 'joi';

@Component({
  selector: 'dk-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent {
  user: User;
  addMode: boolean;

  constructor(private route: ActivatedRoute, public router: Router, private userService: UserService,
              private apollo: Apollo) {
    this.addMode = route.snapshot.params.id === 'add';
    if (this.addMode) {
      this.user = <User>{name: '', age: undefined};
    } else {
      this.user = _.cloneDeep(route.snapshot.data.user);
    }
  }


  submit() {

    const schema = Joi.object().keys({
      name: Joi.string().alphanum().min(3).max(30).required(),
      age: Joi.number().integer().max(10).min(100),
    });

    // so joi works on client and I guess everything works on client frome nodeland then?
    // all of this will be transpiled into es5 and junk up your app, but validation on client is huge
    const result = Joi.validate(this.user, schema, {abortEarly: false});
    if (result.error) {
      // console.error(JSON.stringify(result.error, null, 2));
      // return;
    }

    if (this.addMode) {
      this.userService.addOne(this.user)
        .subscribe(newUser => {
          const cache = this.apollo.getClient().cache as any;
          // console.log(cache.data.data);
          this.router.navigateByUrl('/');

          // mutate.refreshQueries timing bug: It appears out add mutation's refreshQueries probably forces
          // a network only fetchPolicy, BUT... those queries happen "after" this subscribe fires, so when
          // we navigate to list page... still have old query values. It's something like this cause when we
          // put this setTimeout in there before routing, all works fine. Without it, it doesn't have enough
          // time to update the cache. Better to update the cache yourself then with update maybe?
/*
          setTimeout(() => {
            this.router.navigateByUrl('/');
          }, 30); // 1000 works, 0 doesn't
*/
        });
    } else {
      this.userService.updateOne(this.user)
        .subscribe(updatedUser => {

          this.router.navigateByUrl('/');
        });
    }
  }
}
