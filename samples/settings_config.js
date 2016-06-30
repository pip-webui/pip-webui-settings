(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSettingsConfig', []);
    
    thisModule.config(function (pipSettingsProvider) {
        pipSettingsProvider.addPage({
            state: 'test1',
            title: 'Test1 settings page',
            auth: true,
            stateConfig: {
                url: '/test1',
                templateUrl: 'settings_page.html'
            }
        });

    });

})(window.angular);