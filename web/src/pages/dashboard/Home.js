import { useContext } from 'react';
import { AuthContext } from '../../store/context/authContext';

export const Home = () => {
  const { userAuth } = useContext(AuthContext);

  return (
    <div>
      <h1>Home</h1>

      <h3>
        {userAuth.user.email}: {userAuth.user.token}
      </h3>
    </div>
  );
};
