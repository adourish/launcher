import RobodogLib from '../../node_modules/robodoglib/dist/robodoglib.bundle';
const providerService = new RobodogLib.ProviderService();

class LauncherService {

   getData() {
      let launcherYaml = providerService.getJson('launcherYaml', this.getDefault());
      console.debug('LauncherService.getdata', launcherYaml);
      // Filter to only return enabled items
      return launcherYaml.filter(item => item.enabled === true);
   }

   getDefault() {
      let yaml = `
- url: https://chat.google.com/
  width: 1600
  height: 1000
  left: 0
  top: 0
  name: Chat
  group: b
  enabled: true
  focused: false
  fullscreen: true
- url: https://web.whatsapp.com/
  width: 1600
  height: 1000
  left: 0
  top: 0
  name: Whatsapp
  group: b
  enabled: false
  focused: false
  fullscreen: true
- url: https://todoist.com/app/project/2149072136
  width: 1600
  height: 1000
  left: 0
  top: 0
  name: Tasks
  group: a
  enabled: false
  focused: false
  fullscreen: true
- url: https://mail.google.com/mail/u/0/#inbox
  width: 1600
  height: 1000
  left: 0
  top: 0
  name: Mail
  group: a
  enabled: true
  focused: false
  fullscreen: true
- url: https://calendar.google.com/calendar/u/0/r
  width: 1600
  height: 1000
  left: 0
  top: 0
  name: Calendar
  group: a
  enabled: true
  focused: true
  fullscreen: true

`;
      return yaml;
   }

}

export { LauncherService };