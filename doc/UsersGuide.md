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


## <a name="settings_provider"></a> pipSettings provider

TBD...


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
