'use strict';

import './settings_service/index';
import './settings_page/index';

angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);

export * from './settings_service';
export * from './settings_page';