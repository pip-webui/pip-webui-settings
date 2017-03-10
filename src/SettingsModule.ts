'use strict';

import './common/SettingsService';
import './page/index';

angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);

export * from './page';