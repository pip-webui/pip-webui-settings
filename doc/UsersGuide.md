# Pip.WebUI.Settings User's Guide

## <a name="contents"></a> Contents
- [Installing](#install)
- [pipSettings provider](#settings_provider)
- [Settings page](#settings_page)
- [Basic Info tab](#basic_info_tab)
- [Active Sessions tab](#active_sessions_tab)
- [Questions and bugs](#issues)


## <a name="install"></a> Installing

Add dependency to **pip-webui** into your **bower.json** or **package.json** file depending what you use.
```javascript
"dependencies": {
  ...
  "pip-webui": "*"
  ...
}
```

Alternatively you can install **pip-webui** manually using **bower**:
```bash
bower install pip-webui
```

or install it using **npm**:
```bash
npm install pip-webui
```

Include **pip-webui** files into your web application.
```html
<link rel="stylesheet" href=".../pip-webui-lib.min.css"/>
...
<script src=".../pip-webui-lib.min.js"></script>
<script src=".../pip-webui-test.min.js"></script>
```

Register **pipSettings** module in angular module dependencies.
```javascript
angular.module('myApp',[..., 'pipSettings']);
```

## <a name="settings_provider"></a> pipSettings provider

**pipSettings** provider allows to configure **Settings** page
and dynamically add there tabs during configure and run phases.

### Usage
```javascript
pipSettingsProvider.addTab({
    state: 'custom',
    title: 'Custom tab',
    auth: true,
    stateConfig: {
        url: '/custom',
        templateUrl: 'custom_tab.html'
    }
});
```
Todo: How tab controller is defined?

### Methods

* **addTab(tab: any): void** - adds a new tab into the **Settings** page
  - Params:
    + tab - tab configuration object (see below).

* **getTabs(): any[]** - gets a list of tabs in the **Settings** page
  - Returns: array with tab configuration objects
  
* **getDefaultTab(): string** - gets name of the default tab
  - Returns: name of the default tab

* **setDefaultTab(name: string): void** - sets name of the new default tab
  - Params:
    + name - name of the new default tab

### Tab Configuration object

Todo: List tab configuration fields


## <a name="settings_page"></a> Settings page

TBD...


## <a name="basic_info_tab"></a> Basic Info tab

TBD...


## <a name="sessions_tab"></a> Active Sessions tab

TBD...


## <a name="issues"></a> Questions and bugs

If you have any questions regarding the module, you can ask them using our 
[discussion forum](https://groups.google.com/forum/#!forum/pip-webui).

Bugs related to this module can be reported using [github issues](https://github.com/pip-webui/pip-webui-test/issues).
