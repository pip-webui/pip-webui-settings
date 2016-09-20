# Pip.WebUI.Settings Changelog

Добавлены настроки appBar для  settingsPage.
            showTitleText(string) - задает текст, убирает лого. По умолчанию отображается текст "Settings".
            showTitleLogo(string) - задает путь  к картинке логотипа, текст убирается.
            showNavIcon(boolean) - прячет кнопку меню в appBar, по умолчанию кнопка отображается.

## <a name="1.0.0"></a> 1.0.0 (2016-07-30)

Initial release of extensible settings page

#### Features
* **settings provider**: settings provider to configure settings page and add tabs
* **basic info**: tab with general information about signed user (requires **users** REST API)
* **active sessions**: tab with active sessions opened by the current user (requires **sessions** REST API)

#### Breaking Changes
No breaking changes in this version

#### Bug Fixes
No fixes in this version 
