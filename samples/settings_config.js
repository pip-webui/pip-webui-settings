(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSettingsConfig', []);
    
    thisModule.config(function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
            state: 'test1',
            title: 'Test1 settings tab',
            auth: true,
            icon: 'icons:people-team',
            iconClass: 'piople-team-settings-icon',
            stateConfig: {
                url: '/test1',
                templateUrl: 'settings_tab.html'
            }
        });
        pipSettingsProvider.addTab({
            state: 'test2',
            title: 'Test2 settings tab',
            icon: 'icons:person-star',
            // iconClass: 'person-star-settings-icon',
            auth: true,
            stateConfig: {
                url: '/test2',
                template: 'test2'
            }
        });


    });

})(window.angular);