import {Navigate, RouterProvider, redirect} from '@tanstack/react-router';
import {router} from './routes/router';
import {createContext, useEffect, useState} from 'react';

export interface UserContextType {
  username: string | null;
  isUserLoggedIn: boolean;
  setUsername: (username: string) => void;
  setIsUserLoggedIn: (isUserLoggedIn: boolean) => void;
}

export const UserContext = createContext<UserContextType>({
  isUserLoggedIn: true,
  setUsername: () => {},
  setIsUserLoggedIn: () => {},
  username: 'null',
});

export function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(true);
  
  return (
    <div className="container mx-auto">
      <UserContext.Provider
        value={{
          username,
          isUserLoggedIn,
          setUsername,
          setIsUserLoggedIn,
        }}
      >
        <RouterProvider router={router} context={UserContext} />
      </UserContext.Provider>
    </div>
  );
}
