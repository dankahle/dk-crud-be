import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {UserService} from '../../core/services/user.service';
import * as _ from 'lodash';
import {User} from '../user';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'dk-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  users;

  constructor(private userService: UserService, public app: AppComponent, route: ActivatedRoute) {
/*
    route.data.subscribe((data: { users: User[] }) => {
      this.users = data.users;
    });
*/
    this.userService.getAll({watch: true})
      .subscribe(users => {
        // console.log('users watch', users);
        this.users = users;
      });

  }

  refresh() {
    this.userService.getAll({networkOnly: true})
      .subscribe(users => this.users = users);
  }

  deleteUser(userId) {
    this.userService.deleteOne(userId)
      .subscribe(delUser => {
        // without the mutate update addition, the users remains unchanged and a refresh gets old list, so you
        // added networkOnly option to the refresh call, but in reality, just need mutate.update to update the
        // users and a watchQuery if on the same page, OH... which this is... cool, we can test that out then...
        // this.refresh();
        const i = 5;
      });
  }


}
