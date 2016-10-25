/**
 * @file Settings tab logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function () {
    'use strict';

    angular.module('pipUserSettings', [
        'ngMaterial', 'pipData',
        'pipSettings.Service',
        'pipSettings.Page',

        'pipUserSettings.Strings',
        'pipUserSettings.Sessions',
        'pipUserSettings.BasicInfo',
        'pipSettings.Templates'
    ]);

})();
