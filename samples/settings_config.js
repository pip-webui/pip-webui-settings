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
                template: '<h1>This is test 1 page in settings inserted through provider</h1>'
            }
        });

    });

})(window.angular);