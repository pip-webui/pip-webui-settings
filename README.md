# <img src="https://github.com/pip-webui/pip-webui/blob/master/doc/Logo.png" alt="Pip.WebUI Logo" style="max-width:30%"> <br/> Guidance module

# Pip.WebUI Settings

Settings web pages is a sub-module for Pip.Services platform and can be used in applications
based on the platform.

This module provides:

* Settings service
* User basic info settings page
* Open sessions settings page

This module provides predefined pages ('Basic info' and 'Active sessions'). It demands some fixed REST endpoints to retrieve user's personal data.
Navigation through its pages demands user's authentication.

<a name="settings_basic_info"></a>'Basic info' page example
<a href="doc/images/img-settings-basic-info.png" style="border: 3px ridge #c8d2df; width: 50%; margin: auto; display: block">
    <img src="doc/images/img-settings-basic-info.png"/>
</a>

## Learn more about the module

- [API Reference]()
- [Module Dependencies](#dependencies)
- [Online Samples](http://webui.pipdevs.com/pip-webui-settings/index.html)
- [Developer Guide](doc/DeveloperGuide.md)
- [User Guide](doc/UserGuide.md)
- [Forum](https://pip-webui.blogspot.com/)
- [Pip.WebUI Framework](https://github.com/pip-webui/pip-webui)
- [Pip.WebUI Official Website](http://www.pipwebui.org)

## <a name="dependencies">Module dependencies</a>

* <a href="https://github.com/pip-webui/pip-webui-core">pip-webui-core</a>
* <a href="https://github.com/pip-webui/pip-webui-rest">pip-webui-rest</a>
* <a href="https://github.com/pip-webui/pip-webui-css">pip-webui-css</a>
* <a href="https://github.com/pip-webui/pip-webui-lib">pip-webui-lib</a>
* <a href="https://github.com/pip-webui/pip-webui-locations">pip-webui-locations</a>
* <a href="https://github.com/pip-webui/pip-webui-pictures">pip-webui-pictures</a>


### <a name="howto_use_it"></a>

Example of adding a new page is reproduced below:

```javascript
angular
    .module('appSettings', ['pipSettings'])
    .config(function (pipSettingsProvider) {
        pipSettingsProvider.addPage({
            state: 'test',
            title: 'Title of the page', //in left column
            auth: true,
            stateConfig: {
                url: '/test',
                template: '<h1>Here must be content which will be visible while this page will be active</h1>'
            }
        })
    });
```


## <a name="license"></a>License

PIP.WebUI is under [MIT licensed](LICENSE).

