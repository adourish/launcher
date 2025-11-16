import './Console.css';
import React, { useRef, useEffect, useState } from 'react';
import { LauncherService } from './Services/LauncherService'
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
  const [yamlConfig, setYamlConfig] = useState('')
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    console.log('Component has mounted!');
    if (!isLoaded) {

      let _data = laucherService.getData();
      setData(_data)
      
      // Load the YAML config from storage
      const storedYaml = providerService.getYaml('launcherYaml', laucherService.getDefault());
      setYamlConfig(storedYaml);
      
      print(_data, setContent);
      launch(_data);
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

  function launch(data) {
    console.debug('console.constrolservice', controlService, providerService, laucherService, formatService, build)
    data.forEach(windowData => {
      controlService.createWindow(
        windowData.url,
        windowData.width,
        windowData.height,
        windowData.left,
        windowData.top,
        windowData.name,
        windowData.focused,
        windowData.fullscreen
      );

    });
    return data;
  }
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

    return (

      <div className="console">
        <span className="char-count">
          <button type="button" onClick={handleSettingsToggle} aria-label="settings" className="button-uploader" title="Settings">⚙️</button>
        </span>
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