import {Link} from '@tanstack/react-router';
import {useContext} from 'react';
import {UserContext} from '../App';
import {removeLoginToken} from '../utils/localStorageUtils';

export function Navbar() {
  const {isUserLoggedIn, setIsUserLoggedIn, setUsername} =
    useContext(UserContext);

  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to='/reports' className='[&.active]:font-bold'>
          Reports
        </Link>
        <Link to="/districts" className="[&.active]:font-bold">
          Districts
        </Link>
        <Link to="/members" className="[&.active]:font-bold">
          Members
        </Link>
        <Link to="/admin" className="[&.active]:font-bold">
          Admin
        </Link>
        <div className="ml-auto">
          {!isUserLoggedIn ? (
            <Link to="/login" className="[&.active]:font-bold">
              Login
            </Link>
          ) : (
            <button
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
      <hr />
    </>
  );
}
