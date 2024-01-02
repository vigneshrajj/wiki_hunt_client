import { Navigate, createBrowserRouter, redirect } from 'react-router-dom';
import Search from './components/Search';
import PrivateLayout from './layouts/PrivateLayout';
import Saved from './components/Saved';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PublicLayout from './layouts/PublicLayout';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateLayout />,
        children: [
            {
                index: true,
                loader: () => redirect('/auth/signin'),
            },
            {
                path: 'search',
                element: <Search />,
            },
            {
                path: 'saved',
                element: <Saved />,
            },
            {
                path: '*',
                element: <Navigate to={'search'} />,
            },
        ],
    },
    {
        path: 'auth',
        element: <PublicLayout />,
        children: [
            {
                index: true,
                loader: () => redirect('/auth/signin'),
            },
            {
                path: 'signin',
                element: <SignIn />,
            },
            {
                path: 'signup',
                element: <SignUp />,
            },
            {
                path: '*',
                element: <Navigate to={'signin'} />
            },
        ],
    }
])

export default router;