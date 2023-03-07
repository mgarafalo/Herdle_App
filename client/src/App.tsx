import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import { User } from "./Interfaces/Account";
import AppRouter from "./Router";
import agent from "./service/Agent";
import { setUserState } from "./store/slice";
import { AppState } from "./store/store";

function App() {
  const dispatch = useDispatch();
  const store = useSelector((state: AppState) => state.appState.user);

  async function loadData(userId: string) {
    await agent.Account.getUserInfo(userId).then((user) => {
      dispatch(
        setUserState({
          ...user,
        })
      );
    });
  }

  useEffect(() => {
    const userToken: User = JSON.parse(
      window.localStorage.getItem("Herdle/Auth")!
    );
    if (userToken) {
      loadData(userToken.id!);
    }
  }, []);

  return (
    <div className="App" style={{ backgroundColor: "#dad7cd" }}>
      <NavBar
        email={store.email !== "" ? store.email : ""}
        id={store.email !== "" ? store.id! : ""}
      />
      <AppRouter />
    </div>
  );
}

export default App;
