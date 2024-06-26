import {Link} from '@tanstack/react-router';
import {useContext} from 'react';
import {UserContext} from '../App';
import {removeLoginToken} from '../utils/localStorageUtils';

export function Navbar() {
  const {isUserLoggedIn, setIsUserLoggedIn, setUsername} =
    useContext(UserContext);

  return (
    <>
      <div className="p-2 flex gap-5">
        <Link
          to="/"
          className="[&.active]:font-bold [&.active]:border-b-4 border-solid hover:border-dashed hover:border-yellow-500 [&.active]:border-yellow-500 border-white border-b-2"
        >
          Domov
        </Link>
        <Link
          to="/reports"
          className="[&.active]:font-bold [&.active]:border-b-4 border-solid hover:border-dashed hover:border-yellow-500 [&.active]:border-yellow-500 border-white border-b-2"
        >
          Reporty
        </Link>
        <Link
          to="/districts"
          className="[&.active]:font-bold [&.active]:border-b-4 border-solid hover:border-dashed hover:border-yellow-500 [&.active]:border-yellow-500 border-white border-b-2"
        >
          Obvody
        </Link>
        <Link
          to="/members"
          className="[&.active]:font-bold [&.active]:border-b-4 border-solid hover:border-dashed hover:border-yellow-500 [&.active]:border-yellow-500 border-white border-b-2"
        >
          Členovia
        </Link>
        <Link
          to="/admin"
          className="[&.active]:font-bold [&.active]:border-b-4 border-solid hover:border-dashed hover:border-yellow-500 [&.active]:border-yellow-500 border-white border-b-2"
        >
          Admin dáta
        </Link>
        <div className="ml-auto">
          {!isUserLoggedIn ? (
            <Link
              to="/login"
              className="[&.active]:font-bold [&.active]:border-b-4 border-solid hover:border-dashed hover:border-yellow-500 [&.active]:border-yellow-500 border-white border-b-2"
            >
              Login
            </Link>
          ) : (
            <button
            className='hover:border-dashed hover:border-yellow-500 border-white border-b-2'
              onClick={() => {
                removeLoginToken();
                setIsUserLoggedIn(false);
                setUsername('');
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
      <hr className="border-t border-yellow-500" />
    </>
  );
}
