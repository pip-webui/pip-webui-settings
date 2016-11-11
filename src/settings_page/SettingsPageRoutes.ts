'use strict';

function configureSettingsPageRoutes($stateProvider) {
    $stateProvider
        .state('settings', {
            url: '/settings?party_id',
            auth: true,
            controllerAs: 'vm',
            controller: 'pipSettingsPageController',
            templateUrl: 'settings_page/SettingsPage.html'
        });
       
}

angular.module('pipSettings.Page')
    .config(configureSettingsPageRoutes);