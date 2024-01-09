import "./App.css";
import "./components/Recorder";
import Recorder from "./components/Recorder";

function App() {
  return (
    <>
      <h1 className="text-xl font-bold my-5">
        This is a prototype app for Speech AI!
      </h1>
      <Recorder />
    </>
  );
}

export default App;
