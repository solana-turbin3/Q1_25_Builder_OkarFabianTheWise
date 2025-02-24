import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import TokenCreator from "./components/Generator";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WalletContextProvider from "./solactions/WalletConnect";
import { UpdateTokenMetadata } from "./components/met";

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16">
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<TokenCreator />} />
              <Route path="/met" element={<UpdateTokenMetadata />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </WalletContextProvider>
  );
};

export default App;
