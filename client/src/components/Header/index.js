import React from 'react';
import { Link } from 'react-router-dom';

import Auth from '../../utils/auth';

const Header = () => {
  const logout = (event) => {
    event.preventDefault();
    Auth.logout();
  };

  return (
    <header className='col-3 mb-4 py-2 flex-column align-center'>
      <div className='container flex-column justify-space-between-lg justify-center align-center'>
        <Link to='/'>
          <h1>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              fill='rgb(214, 217, 219)'
              className='bi bi-chat-dots-fill'
              viewBox='0 0 16 16'
            >
              <path d='M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z' />
            </svg>
          </h1>
        </Link>

        <nav className='flex-column text-light'>
          {Auth.loggedIn() ? (
            <>
              <Link to='/'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='23'
                  height='23'
                  fill='#e7e9ea'
                  className='bi bi-house-fill  mr-3'
                  viewBox='0 0 16 16'
                >
                  <path d='M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z' />
                  <path d='m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z' />
                </svg>
                Home
              </Link>
              <Link to={`/profile/${Auth.getProfile().data.username}`}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='23'
                  height='23'
                  fill='#e7e9ea'
                  className='bi bi-person mr-3'
                  viewBox='0 0 16 16'
                >
                  <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z' />
                </svg>
                Profile
              </Link>
              <a href='/' onClick={logout}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='23'
                  height='23'
                  fill='currentColor'
                  className='bi bi-box-arrow-right mr-3'
                  viewBox='0 0 16 16'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z'
                  />
                  <path
                    fillRule='evenodd'
                    d='M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z'
                  />
                </svg>
                Logout
              </a>
            </>
          ) : (
            <>
              <Link to='/login'>Login</Link>
              <Link to='/signup'>Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

