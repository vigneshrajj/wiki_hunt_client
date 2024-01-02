import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from './router.tsx'
import { ApolloProvider } from '@apollo/client'
import { gqlClient } from './api/gqlClient.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={gqlClient}>
    <RouterProvider router={router} />
  </ApolloProvider>
  ,
)
