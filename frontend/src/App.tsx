import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import WalletSetup from "./pages/WalletSetup";
import SelectNetwork from "./pages/SelectNetwork";
import GenerateAccounts from "./pages/GenerateAccounts";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WalletSetup />} />
        <Route path="/select-network" element={<SelectNetwork />} />
        <Route path="/generate-accounts" element={<GenerateAccounts />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
