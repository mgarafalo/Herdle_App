import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import NavBar from './components/layout/NavBar';
import Login from './components/Views/Login/Login';
import SignUp from './components/Views/Signup/Signup';
import './index.css';
import { appStore } from './store/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <BrowserRouter>
      <Provider store={appStore}>
        <App />
      </Provider>
    </BrowserRouter>
  </>
);
