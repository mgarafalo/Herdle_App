import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { appStore } from "./store/store";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={appStore}>
          <App />
        </Provider>
        <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />
      </QueryClientProvider>
    </BrowserRouter>
  </>
);
