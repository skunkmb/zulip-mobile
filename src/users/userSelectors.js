/* @flow */
import { createSelector } from 'reselect';

import { NULL_USER } from '../nullObjects';
import { getPresence, getUsers } from '../directSelectors';
import { getCurrentRouteParams } from '../nav/navigationSelectors';
import { getOwnEmail } from '../account/accountSelectors';
import { getUserByEmail } from './userHelpers';

export const getAccountDetailsUser = createSelector(
  [getUsers, getCurrentRouteParams],
  (allUsers, params) => {
    if (!params || !params.email) {
      return NULL_USER;
    }

    return (
      allUsers.find(x => x.email === params.email) || {
        ...NULL_USER,
        email: params.email,
        fullName: params.email,
      }
    );
  },
);

export const getSelfUserDetail = createSelector(getUsers, getOwnEmail, (users, ownEmail) =>
  getUserByEmail(users, ownEmail),
);

export const getActiveUsers = createSelector(getUsers, users =>
  users.filter(user => user.isActive),
);

export const getSortedUsers = createSelector(getUsers, users =>
  [...users].sort((x1, x2) => x1.fullName.toLowerCase().localeCompare(x2.fullName.toLowerCase())),
);

export const getUsersStatusActive = createSelector(getActiveUsers, getPresence, (users, presence) =>
  users.filter(user => presence[user.email] && presence[user.email].aggregated.status === 'active'),
);

export const getUsersStatusIdle = createSelector(getActiveUsers, getPresence, (users, presence) =>
  users.filter(user => presence[user.email] && presence[user.email].aggregated.status === 'idle'),
);

export const getUsersStatusOffline = createSelector(
  getActiveUsers,
  getPresence,
  (users, presence) =>
    users.filter(
      user => presence[user.email] && presence[user.email].aggregated.status === 'offline',
    ),
);
