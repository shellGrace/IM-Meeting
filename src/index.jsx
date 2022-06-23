import { RouteContainer } from "./router";
import ReactDOM from "react-dom";
import "./reset.css";

const App = () => {
  return <RouteContainer></RouteContainer>;
};

ReactDOM.render(<App />, document.getElementById("root"));
