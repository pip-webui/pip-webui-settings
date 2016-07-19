## How to use it
если подключить модули
* 'pipSettings.Service',
* 'pipSettings.Page'
и добавить pipSettingsProvider в config
то будет зарегистрировано абстрактное состояние settings и доступна возможность добавлять странцы с помощью функции addPage
пример:

```javascript
pipSettingsProvider.addPage({
            state: 'test1',
            title: 'Test1 settings page',
            auth: true,
            stateConfig: {
                url: '/test1',
                templateUrl: 'settings_page.html'
            }
        });

```
после довбления страницы пример которой приведен выше имя состояния будет settings.tast1
при передаче параметра index в функцию addPage страницы будут отсортированы согласно ему по возрастанию
при отсутствии данного параметра страницы будут распологаться согласно подключению их в config

При подключении модуля
'pipUserSettings' будут добавлены страницы settings по умолчанию, а именно Basic info и Active Sessions

Для краткого подключения модулей:
 'pipSettings.Service',
 'pipSettings.Page',
 'pipUserSettings'

Необходимо подключить только 'pipSettings' модуль

Если вы хотите подключить отдельно страницу BasicInfo необходимо добавить модули:
'pipUserSettings.BasicInfo'
'pipSettings.Service',
'pipSettings.Page'

Если вы хотите подключить отдельно страницу Active sessions необходимо добавить модули:
'pipUserSettings.Sessions',
'pipSettings.Service',
'pipSettings.Page'


### **Basic info** page features
_<span style="color:red;">This page required authenticated state.<span>_

<a name="settings_basic_info"></a>'Basic info' page example
<a href="images/img-settings-basic-info.png" style="border: 1px ridge #ccc; width: 50%;  display: block">
    <img src="images/img-settings-basic-info.png"/>
</a>

[Online example](http://webui.pipdevs.com/pip-webui-settings/index.html#/settings/basic_info)

List of features:

* change email
* change password
* add location
* point out his/her personal info
* upload avatar
    
    <a href="images/pic_profile.png" style="border: 1px ridge #ccc; width: 260px; margin-left: 30px; display: block; float: left;">
        <img src="images/pic_profile.png"/>
    </a>

```javascript

```
### <a name="settings_sessions"></a>'Active sessions' page
_<span style="color:red;">This page required authenticated state.<span>_
<a href="images/img-settings-active-sessions.png" style="border: 1px ridge #ccc; width: 50%; display: block !important;">
    <img src="images/img-settings-active-sessions.png"/>
</a>

[Online Example](http://webui.pipdevs.com/pip-webui-settings/index.html#/settings/sessions)

This page notified user about devices or locations where used the same credentials. 
And user can close unfamiliar session. This page also required authenticated state.



### **Settings service** page feature
Settings service provides an interface for configuring UI component. It implements next features:

* add new page into component navigation menu
* establish default page, which will be opened within component entrance


### Browser support:
 
 * IE11+
 * Edge
 * Chrome 47+
 * Firefox 43
 * Opera 35