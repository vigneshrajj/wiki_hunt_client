import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { jwtDecode } from 'jwt-decode';

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_PUBLIC_API_BASE_URL,
});

const authLink = setContext(async (_, { headers }) => {
  const token = localStorage.getItem('token');

  if (token) {
    const parsedJwt = jwtDecode(token);
    if (parsedJwt?.exp && parsedJwt.exp >= Date.now()) {
      location.reload();
    }
  }

  return {
    headers: {
      ...headers,
      ...(token ? {authorization: `Bearer ${token}`} : {}),
    }
  }
});

export const gqlClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});