import React from 'react';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import { Toaster } from 'sonner';

import Header from './components/Header';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Follow from './pages/Follow';
import SingleThought from './pages/SingleThought';
import Notifications from './pages/Notifications';
import NoMatch from './pages/NoMatch';

const httpLink = createHttpLink({ uri: '/graphql' });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className='min-h-screen bg-muted text-gray-900 dark:bg-dark dark:text-white transition-colors duration-300'>
          <Toaster position='top-center' richColors />

          {/* Global Header */}
          <Header />

          {/* Main Layout */}
          <main className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6'>
            {/* Sidebar placeholder for future nav or widgets */}
            <aside className='hidden lg:block lg:col-span-3'></aside>

            {/* Route Display Area */}
            <section className='col-span-1 lg:col-span-9 bg-white dark:bg-zinc-900 rounded-2xl shadow-subtle p-6 space-y-6'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/profile'>
                  <Route path=':username' element={<Profile />} />
                  <Route path=':username/likes' element={<Profile />} />
                  <Route path=':username/following' element={<Follow navMode='following' />} />
                  <Route path=':username/followers' element={<Follow navMode='followers' />} />
                </Route>
                <Route path='/thought/:id' element={<SingleThought />} />
                <Route path='/notifications' element={<Notifications />} />
                <Route path='*' element={<NoMatch />} />
              </Routes>
            </section>
          </main>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
