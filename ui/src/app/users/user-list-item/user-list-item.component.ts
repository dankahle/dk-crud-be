import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {User} from '../user';
import {AppComponent} from '../../app.component';
import {MakeRedDirective} from '../../shared/directives/make-red.directive';

@Component({
  selector: 'dk-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss']
})
export class UserListItemComponent {
  @Input() user: User;
  @Output() delete = new EventEmitter();

  constructor(public app: AppComponent, private makeRed: MakeRedDirective) {
    // console.log('makered', makeRed.color);
  }

  deleteUser(event) {
    event.preventDefault();
    this.delete.emit(this.user.id);
  }

}
