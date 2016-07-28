(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSettingsConfig', []);
    
    thisModule.config(function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
            state: 'test1',
            title: 'Test1 settings tab',
            auth: true,
            stateConfig: {
                url: '/test1',
                templateUrl: 'settings_tab.html'
            }
        });

    });

})(window.angular);