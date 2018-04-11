import {Component} from '@angular/core';
import * as _ from 'lodash';
import {User} from './users/user';
import {UserService} from './core/services/user.service';

@Component({
  selector: 'dk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  name = 'dank5';


}
