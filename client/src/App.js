import React from 'react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';

import Header from './components/Header';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Follow from './pages/Follow';
import Signup from './pages/Signup';

const httpLink = createHttpLink({
  uri: '/graphql',
});

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
        <main className='container'>
          <div className='flex-row'>
            <Header />
            <section className='col-6'>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/profile'>
                  <Route path=':username' element={<Profile />} />
                  <Route path=':username/following' element={<Follow navMode='following'/>} />
                  <Route path=':username/followers' element={<Follow navMode='followers'/>} />
                </Route>
                <Route path='/thought/:id' element={<SingleThought />} />

                <Route path='*' element={<NoMatch />} />
              </Routes>
            </section>
          </div>
        </main>
      </Router>
    </ApolloProvider>
  );
}

export default App;

