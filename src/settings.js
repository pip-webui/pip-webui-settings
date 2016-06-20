/**
 * @file Registration of settings components
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipSettings', [
        'pipSettings.Service',
        'pipSettings.Page',
        'pipUserSettings'
    ]);
    
})(window.angular);