import './service';
import './page';

angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);

export * from './service';