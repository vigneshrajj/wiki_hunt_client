import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../api/api';

const PublicLayout = () => {
    const { getUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      (async function() {
        const user = await getUser();
        if (user) navigate('/search');
      })();
    }, [])

    return (
        <Outlet />
    )
}

export default PublicLayout