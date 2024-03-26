import React, { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file

const LogViewer = ({ logs }) => (
  <div className="log-container">
    {logs.map((log, index) => (
      <div key={index} className="log-item">
        {log}
      </div>
    ))}
  </div>
);

const App = () => {
  // State variables for sensor data and automation status
  const [logs, setLogs] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // True or False
  const [menuOpen, setMenuOpen] = useState(false); // True or False
  const [systemStatus, setSystemStatus] = useState({
      windowOpen: null,
      fanOn: null,
      lightsOn: null,
      blinds: null,
      doorLocked: null,
      securityArmed: null,
      securityBreached: null,
      temperature: null,
      humidity: null
  });

  //This code sents a get request to backend to obtain updated system data once per second
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:8000/systemstatus/', {method: 'GET'})
      .then(response => response.json())
      .then(responseData => {
        setSystemStatus(responseData);
      })
      .catch(error => {
        console.error('Error obtaining system status from server:', error);
      });
    }, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  const log = (message) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  const sendSecurityArmedChange = () => {
    fetch('http://localhost:8000/systemstatus/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ securityArmed: !systemStatus.securityArmed }),
    })
      .then(response => response.json())
      .then(data => {
        setSystemStatus(data);
      })
      .catch(error => {
        console.error('Error toggling security:', error);
      });
  };

  const sendDoorLockChange = () => {
    fetch('http://localhost:8000/systemstatus/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ doorLocked: !systemStatus.doorLocked }),
    })
      .then(response => response.json())
      .then(data => {
        setSystemStatus(data);
      })
      .catch(error => {
        console.error('Error toggling security:', error);
      });
  };

  const sendLightChange = () => {
    fetch('http://localhost:8000/systemstatus/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lightsOn: systemStatus.lightsOn !== true ? true : false }),
    })
      .then(response => response.json())
      .then(data => {
        setSystemStatus(data);
      })
      .catch(error => {
        console.error('Error toggling window:', error);
      });
  };

  const sendFanChange = () => {
    fetch('http://localhost:8000/systemstatus/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fanOn: systemStatus.fanOn !== true ? true : false }),
    })
      .then(response => response.json())
      .then(data => {
        setSystemStatus(data);
      })
      .catch(error => {
        console.error('Error toggling window:', error);
      });
  };

  const sendWindowChange = () => {
    fetch('http://localhost:8000/systemstatus/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ windowOpen: systemStatus.windowOpen !== true ? true : false }),
    })
      .then(response => response.json())
      .then(data => {
        setSystemStatus(data);
      })
      .catch(error => {
        console.error('Error toggling window:', error);
      });
  };

  const toggleDarkMode = () => {
    console.log("Toggling dark mode");
    setDarkMode((prev) => !prev);
  };

  const toggleMenu = () => {
    console.log("Toggling menu");
    setMenuOpen((prev) => !prev);
  };

  const changeBlinds = (event) => {
    sendBlindsChange(event.target.value)
  };

  const sendBlindsChange = (newValue) => {
    fetch('http://localhost:8000/systemstatus/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blinds: newValue}),
    })
      .then(response => response.json())
      .then(data => {
        setSystemStatus(data);
      })
      .catch(error => {
        console.error('Error toggling fan:', error);
      });
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <div className="menu">
        <button className="menu-button" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <label className="switch">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>
      <h1 className={`title ${darkMode ? "dark" : ""}`}>Home Screen</h1>
      <div className="card-container">
      <div className={`card ${darkMode ? "dark" : "light"}`}>
          <div className="card-icon">
            <i className="fas fa-thermometer-half"></i>
          </div>
          <div className="card-info">
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Temperature</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.temperature !== null ? `${systemStatus.temperature}°C` : "Loading..."}</p>
            <p className={`card-title ${darkMode ? "dark" : ""}`}>humidity</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.humidity !== null ? `${systemStatus.humidity}%` : "Loading..."}</p>
          </div>
        </div>
        <div className={`card ${darkMode ? "dark" : "light"}`}>
          <div className="card-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="card-info">
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Security Armed</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.securityArmed !== null ? `${systemStatus.securityArmed === true ? "Armed" : "Disarmed"}` : "Loading..."}</p>
            <button className={`control-button ${darkMode ? "dark" : ""}`} onClick={sendSecurityArmedChange}>
              {systemStatus.securityArmed === true ? "Disarm" : "Arm"}
            </button>
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Security Status</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.securityBreached !== null ? `${systemStatus.securityBreached === true ? "Breached" : "Secure"}` : "Loading..."}</p>
          </div>
        </div>
        <div className={`card ${darkMode ? "dark" : "light"}`}>
          <div className="card-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="card-info">
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Door</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.doorLocked !== null ? `${systemStatus.doorLocked === true ? "Locked" : "Unlocked"}` : "Loading..."}</p>
            <button className={`control-button ${darkMode ? "dark" : ""}`} onClick={sendDoorLockChange}>
              {systemStatus.doorLocked === true ? "Unlock" : "Lock"}
            </button>
          </div>
        </div>
        <div className={`card ${darkMode ? "dark" : "light"}`}>
          <div className="card-icon">
            <i className="fas fa-window-maximize"></i>
          </div>
          <div className="card-info">
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Window</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.windowOpen !== null ? systemStatus.windowOpen === true ? "Open" : "Closed" : "Loading..."}</p>
            <button className={`control-button ${darkMode ? "dark" : ""}`} onClick={sendWindowChange}>
              {systemStatus.windowOpen !== true ? "Open" : "Close"}
            </button>
          </div>
        </div>
        <div className={`card ${darkMode ? "dark" : "light"}`}>
          <div className="card-icon">
            <i className="fas fa-lightbulb"></i>
          </div>
          <div className="card-info">
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Lighting</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.lightsOn !== null ? systemStatus.lightsOn === true ? "On" : "Off" : "Loading..."}</p>
            <button className={`control-button ${darkMode ? "dark" : ""}`} onClick={sendLightChange}>
              {systemStatus.lightsOn !== true ? "Turn On" : "Turn Off"}
            </button>
          </div>
        </div>
        <div className={`card ${darkMode ? "dark" : "light"}`}>
          <div className="card-icon">
            <i className="fas fa-fan"></i>
          </div>
          <div className="card-info">
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Fan</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.fanOn !== null ? systemStatus.fanOn === true ? "On" : "Off" : "Loading..."}</p>
            <button className={`control-button ${darkMode ? "dark" : ""}`} onClick={sendFanChange}>
              {systemStatus.fanOn !== true ? "Turn On" : "Turn Off"}
            </button>
          </div>
        </div>
        <div className={`card ${darkMode ? "dark" : "light"}`}>
          <div className="card-icon">
            <i className="fas fa-blinds"></i>
          </div>
          <div className="card-info">
            <p className={`card-title ${darkMode ? "dark" : ""}`}>Blinds</p>
            <p className={`card-value ${darkMode ? "dark" : ""}`}>{systemStatus.blinds !== null ? `${systemStatus.blinds}%` : "Loading..."}</p>
            <input
              type="range"
              step="50"
              min="0"
              max="100"
              value = {systemStatus.blinds}
              onChange={changeBlinds}
              className="slider"
            />
          </div>
        </div>
      </div>
      <LogViewer logs={logs} />
    </div>
  );
};

export default App;
