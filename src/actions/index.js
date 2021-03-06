import { getData, postData } from '../api';

let baseUrlOverride = 'dev.getpassiv.com';
if (process.env.REACT_APP_BASE_URL_OVERRIDE) {
  baseUrlOverride = process.env.REACT_APP_BASE_URL_OVERRIDE;
}
export const baseUrl = 'https://' + baseUrlOverride;

console.log('Base URL:', baseUrl);

export const loginStartedAsync = payload => {
  return dispatch => {
    postData(
      baseUrl + '/api/v1/auth/login/',
      { email: payload.email, password: payload.password }
    )
      .then(response => dispatch(loginSucceeded(response)))
      .catch(error => dispatch(loginFailed(error)));
  };
};

export const loginSucceeded = payload => ({
  type: 'LOGIN_SUCCEEDED',
  payload,
});

export const loginFailed = () => ({
  type: 'LOGIN_FAILED',
});

export const logoutStartedAsync = () => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, 1000);
  }
}

export const logout = () => ({
  type: 'LOGOUT',
});

export const registerStartedAsync = payload => {
  return dispatch => {
    dispatch(registerStarted());
    postData(
      baseUrl + '/api/v1/auth/register/',
      { name: payload.name, email: payload.email, password: payload.password }
    )
      .then(response => {
        // login
        return dispatch(loginSucceeded(response));
      })
      .catch(error => dispatch(registerFailed(error)));
  };
};

export const registerStarted = payload => ({
  type: 'REGISTER_STARTED',
  payload,
});

export const registerFailed = payload => ({
  type: 'REGISTER_FAILED',
  payload,
});

export const toggleDemoMode = () => {
  return dispatch => {
    dispatch({ type: 'TOGGLE_DEMO_MODE' });
  }
};

export const initialLoad = payload => {
  return dispatch => {
    dispatch(fetchAuthorizationsStart());
    getData(baseUrl + '/api/v1/authorizations', payload)
      .then(response => dispatch(fetchAuthorizationsSuccess(response)))
      .catch(error => dispatch(fetchAuthorizationsError(error)));

    dispatch(fetchCurrenciesStart());
    getData(baseUrl + '/api/v1/currencies/', payload)
      .then(response => dispatch(fetchCurrenciesSuccess(response)))
      .catch(error => dispatch(fetchCurrenciesError(error)));

    dispatch(fetchGroupsStart());
    getData(baseUrl + '/api/v1/portfolioGroups/', payload)
      .then(response => {
        response.forEach(group => {
          dispatch(fetchGroupInfoStart(group.id));
          getData(baseUrl + '/api/v1/portfolioGroups/' + group.id + '/info/', payload)
            .then(r => dispatch(fetchGroupInfoSuccess(r, group.id)))
            .catch(e => dispatch(fetchGroupInfoError(e, group.id)));
        });
        return dispatch(fetchGroupsSuccess(response));
      })
      .catch(error => dispatch(fetchGroupsError(error)));

    dispatch(fetchBrokeragesStart());
      getData(baseUrl + '/api/v1/brokerages/', payload)
        .then(response => dispatch(fetchBrokeragesSuccess(response)))
        .catch(error => dispatch(fetchBrokeragesError(error)));

    dispatch(fetchSettingsStart());
      getData(baseUrl + '/api/v1/settings/', payload)
        .then(response => dispatch(fetchSettingsSuccess(response)))
        .catch(error => dispatch(fetchSettingsError(error)));

    dispatch(fetchSubscriptionsStart());
      getData(baseUrl + '/api/v1/subscriptions/', payload)
        .then(response => dispatch(fetchSubscriptionsSuccess(response)))
        .catch(error => dispatch(fetchSubscriptionsError(error)));

    dispatch(fetchAccountsStart());
    getData(baseUrl + '/api/v1/accounts/', payload)
      .then(response => dispatch(fetchAccountsSuccess(response)))
      .catch(error => dispatch(fetchAccountsError(error)));

  };
};

export const loadCurrencies = payload => {
  return dispatch => {
    dispatch(fetchCurrenciesStart);
    getData(baseUrl + '/api/v1/currencies/', payload)
      .then(response => dispatch(fetchCurrenciesSuccess(response)))
      .catch(error => dispatch(fetchCurrenciesError(error)));
  };
};

export const loadGroups = payload => {
  return dispatch => {
    dispatch(fetchGroupsStart);
    getData(baseUrl + '/api/v1/portfolioGroups/', payload)
      .then(response => dispatch(fetchGroupsSuccess(response)))
      .catch(error => dispatch(fetchGroupsError(error)));
  };
};

export const loadBrokerages = payload => {
  return dispatch => {
    dispatch(fetchBrokeragesStart());
    getData(baseUrl + '/api/v1/brokerages/', payload)
      .then(response => dispatch(fetchBrokeragesSuccess(response)))
      .catch(error => dispatch(fetchBrokeragesError(error)));
  };
};

export const loadSettings = payload => {
  return dispatch => {
    dispatch(fetchSettingsStart());
    getData(baseUrl + '/api/v1/settings/', payload)
      .then(response => dispatch(fetchSettingsSuccess(response)))
      .catch(error => dispatch(fetchSettingsError(error)));
  };
};

export const loadSubscriptions = payload => {
  return dispatch => {
    dispatch(fetchSubscriptionsStart());
    getData(baseUrl + '/api/v1/subscriptions/', payload)
      .then(response => dispatch(fetchSubscriptionsSuccess(response)))
      .catch(error => dispatch(fetchSubscriptionsError(error)));
  };
};

export const loadAccounts = payload => {
  return dispatch => {
    dispatch(fetchAccountsStart());
    getData(baseUrl + '/api/v1/accounts/', payload)
      .then(response => dispatch(fetchAccountsSuccess(response)))
      .catch(error => dispatch(fetchAccountsError(error)));
  };
};

export const loadAccount = payload => {
  return dispatch => {
    payload.ids.forEach((id) => {
      dispatch(fetchAccountDetailsStart(id));
      getData(baseUrl + `/api/v1/accounts/${id}/`, payload.token)
        .then(response => dispatch(fetchAccountDetailsSuccess(response, id)))
        .catch(error => dispatch(fetchAccountDetailsError(error, id)));
    });
  };
};

export const loadGroupDetails = payload => {
  return dispatch => {
    payload.ids.forEach((id) => {
      dispatch(fetchGroupDetailsStart(id));
      getData(baseUrl + `/api/v1/portfolioGroups/${id}/`, payload.token)
        .then(response => dispatch(fetchGroupDetailsSuccess(response, id)))
        .catch(error => dispatch(fetchGroupDetailsError(error, id)));
    });
  };
};

export const loadGroup = payload => {
  return dispatch => {
    payload.ids.forEach((id) => {
      dispatch(fetchGroupInfoStart(id));
      getData(`${baseUrl}/api/v1/portfolioGroups/${id}/info/`, payload.token)
        .then(response => dispatch(fetchGroupInfoSuccess(response, id)))
        .catch(error => dispatch(fetchGroupInfoError(error, id)));
    });
  }
}

export const fetchAuthorizationsStart = () => ({
  type: 'FETCH_AUTHORIZATIONS_START',
});

export const fetchAuthorizationsSuccess = payload => ({
  type: 'FETCH_AUTHORIZATIONS_SUCCESS',
  payload,
});

export const fetchAuthorizationsError = payload => ({
  type: 'FETCH_AUTHORIZATIONS_ERROR',
  payload,
});

export const fetchCurrenciesStart = () => ({
  type: 'FETCH_CURRENCIES_START',
});

export const fetchCurrenciesSuccess = payload => ({
  type: 'FETCH_CURRENCIES_SUCCESS',
  payload,
});

export const fetchCurrenciesError = payload => ({
  type: 'FETCH_CURRENCIES_ERROR',
  payload,
});

export const fetchGroupsStart = () => ({
  type: 'FETCH_GROUPS_START',
});

export const fetchGroupsSuccess = payload => ({
  type: 'FETCH_GROUPS_SUCCESS',
  payload,
});

export const fetchGroupsError = payload => ({
  type: 'FETCH_GROUPS_ERROR',
  payload,
});

export const fetchBrokeragesStart = () => ({
  type: 'FETCH_BROKERAGES_START',
});

export const fetchBrokeragesSuccess = payload => ({
  type: 'FETCH_BROKERAGES_SUCCESS',
  payload,
});

export const fetchBrokeragesError = payload => ({
  type: 'FETCH_BROKERAGES_ERROR',
  payload,
});

export const fetchSettingsStart = () => ({
  type: 'FETCH_SETTINGS_START',
});

export const fetchSettingsSuccess = payload => ({
  type: 'FETCH_SETTINGS_SUCCESS',
  payload,
});

export const fetchSettingsError = payload => ({
  type: 'FETCH_SETTINGS_ERROR',
  payload,
});

export const fetchSubscriptionsStart = () => ({
  type: 'FETCH_SUBSCRIPTIONS_START',
});

export const fetchSubscriptionsSuccess = payload => ({
  type: 'FETCH_SUBSCRIPTIONS_SUCCESS',
  payload,
});

export const fetchSubscriptionsError = payload => ({
  type: 'FETCH_SUBSCRIPTIONS_ERROR',
  payload,
});

export const fetchAccountsStart = () => ({
  type: 'FETCH_ACCOUNTS_START',
});

export const fetchAccountsSuccess = payload => ({
  type: 'FETCH_ACCOUNTS_SUCCESS',
  payload,
});

export const fetchAccountsError = payload => ({
  type: 'FETCH_ACCOUNTS_ERROR',
  payload,
});

export const fetchAccountDetailsStart = id => ({
  type: 'FETCH_ACCOUNT_DETAILS_START',
  id,
});

export const fetchAccountDetailsSuccess = (payload, id) => ({
  type: 'FETCH_ACCOUNT_DETAILS_SUCCESS',
  payload,
  id,
});

export const fetchAccountDetailsError = (payload, id) => ({
  type: 'FETCH_ACCOUNT_DETAILS_ERROR',
  payload,
  id,
});

export const fetchGroupDetailsStart = id => ({
  type: 'FETCH_GROUP_DETAILS_START',
  id,
});

export const fetchGroupDetailsSuccess = (payload, id) => ({
  type: 'FETCH_GROUP_DETAILS_SUCCESS',
  payload,
  id,
});

export const fetchGroupDetailsError = (payload, id) => ({
  type: 'FETCH_GROUP_DETAILS_ERROR',
  payload,
  id,
});


export const fetchGroupInfoStart = id => ({
  type: 'FETCH_GROUP_INFO_START',
  id,
});

export const fetchGroupInfoSuccess = (payload, id) => ({
  type: 'FETCH_GROUP_INFO_SUCCESS',
  payload,
  id,
});

export const fetchGroupInfoError = (payload, id) => ({
  type: 'FETCH_GROUP_INFO_ERROR',
  payload,
  id,
});

export const importTargetStart = payload => ({
  type: 'IMPORT_TARGET_START',
  payload,
});

export const importTargetSuccess = payload => ({
  type: 'IMPORT_TARGET_SUCCESS',
  payload,
});

export const importTargetError = payload => ({
  type: 'IMPORT_TARGET_ERROR',
  payload,
});

export const importTarget = groupId => {
  return dispatch => {
    dispatch(importTargetStart);
    postData(baseUrl + '/api/v1/portfolioGroups/' + groupId + '/import/')
      .then(response => dispatch(importTargetSuccess(response)))
      .catch(error => dispatch(importTargetError(error)));
  };
};
