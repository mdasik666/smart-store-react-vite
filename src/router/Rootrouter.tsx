import { BrowserRouter } from "react-router-dom";
import Adminroute from "./adminrouters/Adminroute";

const Rootrouter = () => {
  
  return (
      <BrowserRouter>        
        <Adminroute/>       
      </BrowserRouter>    
  );
}

export default Rootrouter;