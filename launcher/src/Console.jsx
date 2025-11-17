import './Console.css';
import React, { useEffect, useState } from 'react';
import { LauncherService } from './Services/LauncherService'
import Dashboard from './Dashboard';
import RobodogLib from '../node_modules/robodoglib/dist/robodoglib.bundle';
var build = '';
if (window) {
  const version = window.version;
  const buildNumber = window.buildNumber;
  const buildInfo = window.buildInfo;
  build = version + " - " + buildNumber + " - " + buildInfo;
}

const controlService = new RobodogLib.ControlService('launcherWindow');
const formatService = new RobodogLib.FormatService();
const laucherService = new LauncherService();
const providerService = new RobodogLib.ProviderService();
const ConsoleContentComponent = RobodogLib.ConsoleContentComponent;
const SettingsComponent = RobodogLib.SettingsComponent;
console.debug(ConsoleContentComponent)
function Console() {

  const [content, setContent] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [yamlConfig, setYamlConfig] = useState('')
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [apps, setApps] = useState([]);
  useEffect(() => {
    console.log('Component has mounted!');
    if (!isLoaded) {

      let _data = laucherService.getData();
      setData(_data)
      
      // Initialize apps with isOpen status
      const initialApps = _data.map(app => ({ ...app, isOpen: false }));
      setApps(initialApps);
      
      // Load the YAML config from storage
      const storedYaml = providerService.getYaml('launcherYaml', laucherService.getDefault());
      setYamlConfig(storedYaml);
      
      print(_data, setContent);
      setIsLoaded(true);
      
    }
  }, [isLoaded, setIsLoaded, content, setContent]);

  function print(d, setContent) {
    var _cc = [
      ...content,
      formatService.getMessageWithTimestamp('Launcher ' + build, 'assistent')
    ];
    setContent(_cc);
    d.forEach(d => {
      _cc.push(formatService.getMessageWithTimestamp(d.name, 'popup', d.url))
      setContent(_cc);
    });
  }

  function launchWindow(windowData) {
    console.debug('launchWindow', windowData.name);
    // Use simple relative path - wrapper.html is in the same directory
    const wrapperUrl = `./wrapper.html?url=${encodeURIComponent(windowData.url)}&title=${encodeURIComponent(windowData.name)}`;
    
    controlService.createWindow(
      wrapperUrl,
      windowData.width,
      windowData.height,
      windowData.left,
      windowData.top,
      windowData.name,
      windowData.focused,
      windowData.fullscreen
    );
    
    // Update app status
    setApps(prevApps => 
      prevApps.map(app => 
        app.name === windowData.name ? { ...app, isOpen: true } : app
      )
    );
  }

  const handleDashboardLaunch = (name) => {
    if (name === 'all') {
      apps.forEach(app => {
        if (!app.isOpen) {
          launchWindow(app);
        }
      });
    } else {
      const app = apps.find(a => a.name === name);
      if (app && !app.isOpen) {
        launchWindow(app);
      }
    }
  };

  const handleDashboardFocus = (name) => {
    console.debug('handleDashboardFocus', name);
    controlService.focus(name);
  };

  const handleDashboardReload = (name) => {
    console.debug('handleDashboardReload', name);
    const app = apps.find(a => a.name === name);
    if (app) {
      controlService.closeWindow(name);
      setTimeout(() => launchWindow(app), 100);
    }
  };

  const handleDashboardClose = (name) => {
    if (name === 'all') {
      apps.forEach(app => {
        if (app.isOpen) {
          controlService.closeWindow(app.name);
        }
      });
      setApps(prevApps => prevApps.map(app => ({ ...app, isOpen: false })));
    } else {
      console.debug('handleDashboardClose', name);
      controlService.closeWindow(name);
      setApps(prevApps => 
        prevApps.map(app => 
          app.name === name ? { ...app, isOpen: false } : app
        )
      );
    }
  };

  const handleDashboardToggleFullscreen = (name) => {
    console.debug('handleDashboardToggleFullscreen', name);
    const app = apps.find(a => a.name === name);
    if (app) {
      controlService.setFullScreen(name, !app.fullscreen);
      setApps(prevApps => 
        prevApps.map(a => 
          a.name === name ? { ...a, fullscreen: !a.fullscreen } : a
        )
      );
    }
  };

  useEffect(() => {
    function handleUnload(event) {
      console.debug('handleUnload event', event);
      data.forEach(windowData => {
        console.debug('handleUnload each', windowData.name, windowData);
        controlService.closeWindow(windowData.name);
      });
    }
  
    window.addEventListener('beforeunload', handleUnload);
  
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [data, controlService]);

  const handleSettingsToggle = () => {
    console.debug('handleSettingsToggle', showSettings)
    setShowSettings(!showSettings);
  };
  const handleYamlConfigKeyChange = (key) => {
    console.debug('handleYamlConfigKeyChange', key);
    providerService.setYaml('launcherYaml', key);
    setYamlConfig(key);
  };
  //handleLauch
  function handleLaunch(name, url) {
    console.debug('handleLaunch', name, url)
    controlService.focus(name, url)
  }

  const handleSetModel = (event) => {
    var message = 'Model is set to ' + event;
    console.debug('handleSetModel', message);
    }
    function copyToClipboard(text) {
      console.debug('copyToClipboard', text);
    }

    const toggleDashboard = () => {
      setShowDashboard(!showDashboard);
    };

    return (
      <div className="console">
        <span className="char-count">
          <button 
            type="button" 
            onClick={toggleDashboard} 
            aria-label="dashboard" 
            className="button-uploader" 
            title="Toggle Dashboard"
            style={{ marginRight: '10px' }}
          >
            📊
          </button>
          <button type="button" onClick={handleSettingsToggle} aria-label="settings" className="button-uploader" title="Settings">⚙️</button>
        </span>
        
        {showDashboard && (
          <Dashboard
            apps={apps}
            onLaunch={handleDashboardLaunch}
            onFocus={handleDashboardFocus}
            onReload={handleDashboardReload}
            onClose={handleDashboardClose}
            onToggleFullscreen={handleDashboardToggleFullscreen}
          />
        )}
        
        <SettingsComponent
          showSettings={showSettings}
          yamlConfig={yamlConfig}
          handleYamlConfigKeyChange={handleYamlConfigKeyChange}
        />
        <ConsoleContentComponent
          content={content}
          handleCopyToClipboard={copyToClipboard}
          handleSetModel={handleSetModel}
          handleLaunch={handleLaunch}
        />
      </div>
    );
  }

  export default Console;