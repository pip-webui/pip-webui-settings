/**
 * @file Sample application to provide end-to-end example of WebUI
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSample', [
        // 3rd Party Modules
        'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
        'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',
        // Application Configuration must go first
        'pipSampleConfig', 'pipSettings',
        // Modules from WebUI Framework
        'pipCore', 'pipRest', 'pipData', 'pipBasicControls', 'pipLayout', 'pipNav',
        // Sample Application Modules
        'pipEntry', 'pipRest.State', 'pipUserSettings'
    ]);

    thisModule.controller('pipSampleController',
        function () {
            // Sample controller code here...
        }
    );

})(window.angular);

