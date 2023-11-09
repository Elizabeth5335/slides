import "./App.css";
import Slides from "./components/Slides.tsx";
import React from "react";

function App() {

    return (
      <>
        <header className="App-header">
          <h1>Sounds of nature</h1>
        </header>
        <main>
          <Slides />
        </main>
        <footer></footer>
      </>
    );
}

export default App;
