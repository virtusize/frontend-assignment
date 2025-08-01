import { BrowserRouter } from "react-router-dom";

import { Toaster } from "sonner";
import AppRoutes from "./routes/AppRoutes";
import ModalProvider from "./providers/ModalProvider";

const App = () => {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <ModalProvider />
        <AppRoutes />
      </BrowserRouter>
    </>
  );
};

export default App;
