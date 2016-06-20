/**
 * @file Settings page logic
 * @copyright Digital Living Software Corp. 2014-2016
 */


(function () {
    'use strict';

    var thisModule = angular.module('pipUserSettings', [
        'ngMaterial', 'pipData',
        'pipSettings.Service',
        'pipSettings.Page',

        'pipUserSettings.Data',
        'pipUserSettings.Strings',
        'pipUserSettings.BasicInfo',
        'pipUserSettings.Sessions',
        'pipSettings.Templates'

    ]);

})();