import { RouteContainer } from "./router";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux";
import "./reset.css";

const App = () => {
  return (
    <Provider store={store}>
      <RouteContainer></RouteContainer>
    </Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
