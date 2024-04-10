import {useContext, useEffect} from 'react';
import {UserContext} from '../App';
import {decodeTokenPayload} from '../utils/decodeTokenPayload';
import {setLoginToken} from '../utils/localStorageUtils';
import {useAuth} from '../hooks/useAuth';
import {Link, Navigate, redirect} from '@tanstack/react-router';
import { fetchAPI } from '../utils/fetchAPI';

export function LoginPage() {
  const {username, isUserLoggedIn, setUsername, setIsUserLoggedIn} =
    useContext(UserContext);

  useAuth();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const username = form.username.value;
    const password = form.password.value;

    const response = await fetchAPI('/login', {
      method: 'POST',
      body: JSON.stringify({username, password}),
    });

    if (response.ok) {
      const {token} = await response.json();
      const decodedToken = decodeTokenPayload(token);
      if (decodedToken) {
        setLoginToken(token);
        setUsername(decodedToken.username);
        setIsUserLoggedIn(true);
      }
    } else {
      console.error(await response.text());
    }
  }

  return (
    <div className="p-2">
      {isUserLoggedIn && <Navigate to="/" />}
      <h3>Login</h3>
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
          <button
            type="submit"
            className="p-1 border border-gray-300 rounded bg-blue-500 text-white"
          >
            Login
          </button>
        </div>
      </form>
      <Link to="/signup">Sign Up</Link>
    </div>
  );
}
