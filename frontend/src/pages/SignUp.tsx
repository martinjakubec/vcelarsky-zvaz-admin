import {Link, Navigate} from '@tanstack/react-router';
import {PageBody} from '../components/PageBody';
import {PageTitle} from '../components/PageTitle';
import {useContext, useState} from 'react';
import {UserContext} from '../App';
import {decodeTokenPayload} from '../utils/decodeTokenPayload';
import {setLoginToken} from '../utils/localStorageUtils';
import { fetchAPI } from '../utils/fetchAPI';

export function Signup() {
  const {isUserLoggedIn, setIsUserLoggedIn, setUsername, username} =
    useContext(UserContext);

  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;
    const passwordConfirmation = form.passwordConfirmation.value;

    const response = await fetchAPI('/users', {body: JSON.stringify({username, password, passwordConfirmation}), method: 'POST'});

    if (response.ok) {
      setSuccess('Account created successfully');
      setError(null);
      const {token} = await response.json();
      const decodedToken = decodeTokenPayload(token);
      if (decodedToken) {
        setLoginToken(token);
        setUsername(decodedToken.username);
        setIsUserLoggedIn(true);
      }
    } else {
      const message = await response.text();
      setSuccess(null);
      setError(message);
    }
  }

  return (
    <PageBody>
      {isUserLoggedIn && <Navigate to="/" />}
      <PageTitle>Sign Up</PageTitle>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="p-1 border border-gray-300 rounded"
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="p-1 border border-gray-300 rounded"
          />
          <label htmlFor="password">Confirm password</label>
          <input
            type="password"
            id="passwordConfirmation"
            name="passwordConfirmation"
            className="p-1 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="p-1 border border-gray-300 rounded bg-blue-500 text-white"
          >
            Sign Up
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
      <Link to="/signup">Already have an account? Log in here.</Link>
    </PageBody>
  );
}
