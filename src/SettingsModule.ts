'use strict';

import './settings_service/settings_service';
import './settings_page/index';

angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);

export * from './settings_page';