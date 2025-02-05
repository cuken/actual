import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as actions from 'loot-core/src/client/actions';
import {
  View,
  Text,
  Button,
  ButtonWithLoading
} from 'loot-design/src/components/common';
import { colors, styles } from 'loot-design/src/style';
import { loggedIn } from 'loot-core/src/client/actions/user';
import { createBudget } from 'loot-core/src/client/actions/budgets';
import { send } from 'loot-core/src/platform/client/fetch';
import { ConfirmPasswordForm } from './ConfirmPasswordForm';
import { useBootstrapped, Title, Input, Link, ExternalLink } from './common';

export default function ChangePassword() {
  let dispatch = useDispatch();
  let history = useHistory();
  let [error, setError] = useState(null);
  let [msg, setMessage] = useState(null);

  function getErrorMessage(error) {
    switch (error) {
      case 'invalid-password':
        return 'Password cannot be empty';
      case 'password-match':
        return 'Passwords do not match';
      case 'network-failure':
        return 'Unable to contact the server';
      default:
        return 'Internal server error';
    }
  }

  async function onSetPassword(password) {
    setError(null);
    let { error } = await send('subscribe-change-password', { password });

    if (error) {
      setError(error);
    } else {
      setMessage('Password successfully changed');

      setTimeout(() => {
        history.push('/');
      }, 1500);
    }
  }

  return (
    <>
      <View style={{ width: 500, marginTop: -30 }}>
        <Title text="Change account password" />
        <Text
          style={{
            fontSize: 16,
            color: colors.n2,
            lineHeight: 1.4
          }}
        >
          This will change the password for this account. All existing
          sessions will stay logged in.
        </Text>

        {error && (
          <Text
            style={{
              marginTop: 20,
              color: colors.r4,
              borderRadius: 4,
              fontSize: 15
            }}
          >
            {getErrorMessage(error)}
          </Text>
        )}

        {msg && (
          <Text
            style={{
              marginTop: 20,
              color: colors.g4,
              borderRadius: 4,
              fontSize: 15
            }}
          >
            {msg}
          </Text>
        )}

        <ConfirmPasswordForm
          buttons={
            <Button
              bare
              type="button"
              style={{ fontSize: 15, marginRight: 10 }}
              onClick={() => history.push('/')}
            >
              Cancel
            </Button>
          }
          onSetPassword={onSetPassword}
          onError={setError}
        />
      </View>
    </>
  );
}
