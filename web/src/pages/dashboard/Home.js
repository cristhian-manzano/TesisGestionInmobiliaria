import { useContext } from 'react';
import { LoadingContext } from '../../store/context/LoadingGlobal';

export const Home = () => {
  const { handleLoadingOpen } = useContext(LoadingContext);

  const handleClick = () => {
    handleLoadingOpen();
  };

  return (
    <div>
      <h1>Home</h1>
      <button type="button" onClick={handleClick}>
        Hello
      </button>
    </div>
  );
};
