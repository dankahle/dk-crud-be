import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModifyRequestInterceptor} from './interceptors/modify-request.interceptor';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {UserService} from './services/user.service';
import {StoreModule} from '../store/store.module';
import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular-link-http';
import {defaultDataIdFromObject, InMemoryCache} from 'apollo-cache-inmemory';
import { toIdValue } from 'apollo-utilities';
import {environment} from '../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    StoreModule
  ],
  declarations: [],
  providers: [
    UserService
    // {provide: HTTP_INTERCEPTORS, useClass: ModifyRequestInterceptor, multi: true},
  ],
})
export class CoreModule {
  constructor(
    apollo: Apollo,
    httpLink: HttpLink
  ) {
    apollo.create({
      // By default, this client will send queries to the
      // `/graphql` endpoint on the same host
      link: httpLink.create({uri: environment.apiUrl + '/api/graphql'}),
      cache: new InMemoryCache({
        // dataIdFromObject: o => (<any>o).id,
        cacheRedirects: { // this doesn't work, the cache is still namespaced by query
          Query: {
            user: (_, args) => {
              // return toIdValue({ typename: 'User', id: args.id }); // this doesn't work. I suspect it needs __typename
              // but the type needs typename sent in, so a disconnect, can't compile without "typename"
              // and can't do its thing without __typename. BUT... this does work (below)
              return toIdValue('User:' + args.id);
            },
          },
        },
      })
    });
  }
}
