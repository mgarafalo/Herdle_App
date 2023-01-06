import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import NavBar from './components/layout/NavBar';
import { User } from './Interfaces/Account';
import AppRouter from './Router';
import { getAppState, setUserState, State } from './store/slice';
import { AppState } from './store/store';

function App() {
  const dispatch = useDispatch();
  const { appState } = useSelector((state: AppState) => state);

  useEffect(() => {
    const userToken: User = JSON.parse(
      window.localStorage.getItem('Herdle/Auth')!
    );
    if (userToken) {
      console.log(userToken);
      dispatch(
        setUserState({
          email: userToken.email,
          id: userToken.id,
          token: userToken.token,
        })
      );
    }
  }, []);

  return (
    <div className='App' style={{ backgroundColor: '#dad7cd' }}>
      <NavBar
        email={appState.user.email !== '' ? appState.user.email : ''}
        id={appState.user.email !== '' ? appState.user.id! : ''}
      />
      <AppRouter />
    </div>
  );
}

export default App;
