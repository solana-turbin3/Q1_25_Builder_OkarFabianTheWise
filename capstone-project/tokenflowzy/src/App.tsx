import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  // Navigate,
} from "react-router-dom";
// import Home from './pages/Home';
import TokenCreator from "./components/Generator";
import Header from "./components/Header";
import WalletContextProvider from "./solactions/WalletConnect";

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <Router>
        <Header />
        {/* public routes */}
        <Routes>
          <Route path="/" element={<TokenCreator />} />
        </Routes>
      </Router>
    </WalletContextProvider>
  );
};

export default App;
