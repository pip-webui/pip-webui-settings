'use strict';

angular.module('pipSettings.Page', [
    'ui.router', 
    'pipSettings.Service',
    'pipNav', 
    'pipSelected',
    'pipTranslate',
    'pipSettings.Templates'
    ]);


import './SettingsPageController';
import './SettingsPageRoutes';