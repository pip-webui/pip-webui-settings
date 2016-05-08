/**
 * @file Settings page logic
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUserSettings', [
        'ngMaterial', 'pipData', 'pipSettings.Service', 'pipSettings.Page',
        'pipUserSettings.Data', 'pipUserSettings.Strings',  //'pipUserSettings.Blacklist',
        'pipUserSettings.BasicInfo',
        //'pipUserSettings.ContactInfo',
        'pipUserSettings.Sessions', 'pipSettings.Templates'

    ]);

})();