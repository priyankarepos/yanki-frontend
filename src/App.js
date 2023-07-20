import { useEffect, useState } from "react";
import Homepage from "./Components/Homepage";
import axios from "axios";
import { createContext } from "react";

// Exporting context
export const Context = createContext("");

function App() {
  // State for User city
  const [userCity, setUserCity] = useState(null);
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  const nominatim_api = process.env.REACT_APP_NOMINATIM_API;
  // Success callback function
  const success = async pos => {
    const crd = pos.coords;
    const city = await axios.get(
      `${nominatim_api}/reverse?format=json&lat=${crd.latitude}&lon=${crd.longitude}`
    );
    setUserCity(city.data.address.city);
  };

  // Error callback function
  const errors = err => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: "geolocation" }).then(result => {
        if (result.state === "granted") {
          //If granted then directly call function here
          navigator.geolocation.getCurrentPosition(success, errors, options);
        } else if (result.state === "prompt") {
          //If prompt then the user will be asked to give permission
          navigator.geolocation.getCurrentPosition(success, errors, options);
        }
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  });
  return (
    <div className="App">
      {/* Wrapping with context */}
      <Context.Provider value={{ userCity }}>
        <Homepage />
      </Context.Provider>
    </div>
  );
}

export default App;
