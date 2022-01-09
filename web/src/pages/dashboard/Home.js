import { useContext } from 'react';
import { AuthContext } from '../../store/context/authContext';

export const Home = () => {
  const { userSession } = useContext(AuthContext);

  return (
    <div>
      <h1>Home</h1>

      <h3>
        {userSession.user.email}: {userSession.token}
      </h3>
    </div>
  );
};
