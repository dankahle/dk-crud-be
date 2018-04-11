import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {UserService} from '../core/services/user.service';

import {SharedModule} from '../shared/shared.module';
import {UserListComponent} from './user-list/user-list.component';
import {UserListItemComponent} from './user-list-item/user-list-item.component';
import {UserEditComponent} from './user-edit/user-edit.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [UserListComponent, UserListItemComponent, UserEditComponent],
  exports: [UserListComponent, UserListItemComponent],
  providers: [
    UserService
  ],
})
export class UsersModule {
}
