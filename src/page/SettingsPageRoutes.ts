{
    function configureSettingsPageRoutes($stateProvider) {
        $stateProvider
            .state('settings', {
                url: '/settings?user_id&details',
                auth: true,
                controllerAs: 'vm',
                controller: 'pipSettingsPageController',
                templateUrl: 'page/SettingsPage.html'
            });

    }

    angular.module('pipSettings.Page')
        .config(configureSettingsPageRoutes);
}
