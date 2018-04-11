import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StoreModule} from '../store/store.module';
import {RouterModule, Routes} from '@angular/router';
import {UserListComponent} from '../users/user-list/user-list.component';
import {UserListItemComponent} from '../users/user-list-item/user-list-item.component';
import {UserEditComponent} from '../users/user-edit/user-edit.component';
import {UserResolver} from './resolvers/user.resolver';
import {UserListResolver} from './resolvers/user-list.resolver';
import {InitializationGuard} from './guards/initialization.guard';

const routes: Routes = [
  {
    path: 'user',
    component: UserListComponent,
    // can't use in gq cause delete works on list page and users needs to be watchQuery and update accordingly,
    // if in resolve, then we have to call users.getAll again, not a crime as all is in cache, but maybe better
    // to just ditch resolves and work on watchQueries instead? The reason for resolves was: code would mess up cause no
    // users array yet, so UI might flash and show things it's not supposed to. Not a crime then to resolve, just that
    // you want to try to watchQuery just this once. Maybe do a new branch with all components on same page,
    // and watchQuery updating the list on add/update/delete.
    // resolve: {users: UserListResolver},
    canActivate: [InitializationGuard]
  },
  {
    path: 'user/:id',
    component: UserEditComponent,
    resolve: {user: UserResolver},
    canActivate: [InitializationGuard]
  },
  {path: '**', redirectTo: '/user'}
];

@NgModule({
  imports: [
    CommonModule,
    StoreModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: false} // <-- debugging purposes only
    )
  ],
  exports: [RouterModule],
  providers: [UserListResolver, UserResolver, InitializationGuard]
})
export class RoutingModule {
}
