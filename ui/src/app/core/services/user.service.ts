import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {User} from '../../users/user';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs/Observable';
import '../../shared/observable-additions';
import * as _ from 'lodash';

const apiUrl = environment.apiUrl;

@Injectable()
export class UserService {

  constructor(private apollo: Apollo, private http: HttpClient) {
  }

  userFragment = gql`
    fragment UserFragment on User {
      id
      name
      age
  }
  `;

  getAllQuery = gql`
         query GetUsers {
          users {
            ...UserFragment
          }             
         }  
         ${this.userFragment}
      `;

  // we need to not watch by default as init/route resolves are one time things only, also we have a bug
  // with apollo.mutate refreshQueries, in that the subscribe following only waits for mutation NOT FOR REFRESHQUERIES
  // this messes up up as we navigate to list page, but get there before the cache is updated via rereshQueries.
  // solution is maybe to use mutate's update instead to update cache, but this networkOnly force on resolve works
  // too, just that the update would save us a server request, and in such, the proper way to go. Here's the thing:
  // we're trying to do best practices. Surely if you have a clientside cache, you should update that locally if you can
  // not do server hits that gets all the data all over again (when all you needed to do was add one to the list).
  getAll({watch = false, networkOnly = false} = {}): Observable<User[]> {

    const query = gql`
         query GetUsers {
          users {
            ...UserFragment
          }             
         }  
         ${this.userFragment}
      `;

    const fetchPolicy = networkOnly ? 'network-only' : 'cache-first';
    const obs =  this.apollo.watchQuery<any>({query: this.getAllQuery, fetchPolicy: fetchPolicy})
      .valueChanges
      .map(result => {
        // just shows defaultId, not the one you changed to if you modified in new InMemoryCache() options
        // maybe try: apollo.getClient().cache.config.dataIdFromObject??, thing is: the id is in the cache anyway
        // just hit devtools/cache to see it
        // result.data.users.forEach(u => console.log(u, defaultDataIdFromObject(u)));

        return this.sortUserList(result.data.users);
      })
      .catch(err => {
        console.error(err);
        return Observable.throw(err);
      });

    if (watch) {
      return obs;
    } else {
      return obs.first();
    }

/*
// for cache testing, stuff it in init, then enforce it's in cache after.
    if (init) {
      // this is init so only done once, so apollo.query not watchQuery right?
      return this.apollo.query<any>({query})
        .map(result => {
          // just shows defaultId, not the one you changed to if you modified in new InMemoryCache() options
          // result.data.users.forEach(u => console.log(u, defaultDataIdFromObject(u)));
          return result.data.users;
        })
        .catch(err => {
          console.error(err);
          return Observable.throw(err);
        });
    } else { // this was for insuring everything after init was just getting from cache, init calls with init=true and default is init=false
      const rtn = this.apollo.getClient().readQuery<any>({query});
      return Observable.of(rtn.users)
        .catch(err => {
          console.error(err);
          return Observable.throw(err);
        });
    }
*/

  }

  getOne(id: string) {

    const query = gql`
         query GetUser($id: ID!) {
          user(id: $id) {
            ...UserFragment
          }             
         }  
         ${this.userFragment}
      `;

    return this.apollo.query<any>({query, variables: {id}})
      .map(result => {
        return result.data.user;
      })
      .catch(err => {
        console.error(err);
        return Observable.throw(err);
      });
    }

  addOne(user) {
    const mutation = gql`
      mutation AddOne($data: UserInput!) {
        add(data: $data) {
          ...UserFragment
        }
      }
      ${this.userFragment}
    `;

    return this.apollo.mutate({mutation, variables: {data: user},
      update: (store, { data: {add}, errors }) => {
        // Read the data from our cache for this query.
        const _data: {users} = store.readQuery({ query: this.getAllQuery });
        // Add our comment from the mutation to the end.
        _data.users.push(add);
        _data.users = this.sortUserList(_data.users);
        // Write our data back to the cache.
        store.writeQuery({ query: this.getAllQuery, data: _data });
      }})
      .map(result => {
        return result.data.add;
      })
      .catch(err => {
        console.error(err);
        return Observable.throw(err);
      });

    /*
        // context for comments below: edit page, add one >> subscribe >> router.navigate to list page:
        // refreshQueries option. This wasn't working as you had to setTimeout for the router.navigate to make things work
        // BUT... when you write out the cache at this point, both users cache and items cache all have new value,
        // so truth be told: you don't really knwo what's going on there. It's clear things need more time, but the
        // cache values associated exist "before" the router.navigate, so go figure. I'm gonna say: it does refreshQueries
        // before it returns the subscribe, but for some reason, the routing messes things up.
        return this.apollo.mutate({mutation, variables: {data: user},
          refetchQueries: [{query: this.getAllQuery}]})
          .map(result => {
            return result.data.user;
          })
          .catch(err => {
            console.error(err);
            return Observable.throw(err);
          });
    */


  }

  updateOne(user) {
    const mutation = gql`
        mutation UpdateOne($id: ID!, $data: UserInput!) {
          update(id: $id, data: $data) {
          ...UserFragment
        }
      }
      ${this.userFragment}
    `;

    return this.apollo.mutate({mutation, variables: {id: user.id,
        data: {name: user.name, age: user.age}
        // data: user
    }})
    // no update command required for updates, just for add/delete
      .map(result => {
        return result.data.update;
      })
      .catch(err => {
        console.error(err);
        return Observable.throw(err);
      });
  }

  deleteOne(id: string) {
    const mutation = gql`
      mutation DeleteOne($id: ID!) {
        remove(id: $id) {
          ...UserFragment
        }
      }
      ${this.userFragment}
    `;

    return this.apollo.mutate({mutation, variables: {id: id},
      update: (store, { data: {remove}, errors }) => {
        // Read the data from our cache for this query.
        const _data: {users} = store.readQuery({ query: this.getAllQuery });
        // Add our comment from the mutation to the end.
        _.remove(_data.users, x => x.id === remove.id);
        _data.users = this.sortUserList(_data.users);
        // Write our data back to the cache.
        store.writeQuery({ query: this.getAllQuery, data: _data });
      }})
      .map(result => {
        return result.data.remove;
      })
      .catch(err => {
        console.error(err);
        return Observable.throw(err);
      });
  }

  // for reuse between getall and addOne update section
  sortUserList(users) {
    return _.sortBy(users, user => user.name.toLowerCase());
  }
}
