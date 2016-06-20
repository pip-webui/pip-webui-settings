/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', ['pipRest.State', 'pipRest', 'pipEntry', 'pipSideNav', 
        'pipAppBar', 'pipUserSettings', 'pipSettingsData']);

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $urlRouterProvider, pipAuthStateProvider, pipRestProvider, pipSideNavProvider, 
                  pipSettingsDataProvider, pipAppBarProvider, pipEntryProvider, $mdIconProvider, pipSettingsProvider) {

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            // Set global constants
            pipAppBarProvider.appTitleText('Sample Application');
            pipAppBarProvider.globalSecondaryActions([
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ]);

            // Configure REST API
            //pipRestProvider.version('1.0');
            pipRestProvider.serverUrl('http://alpha.pipservices.net');

            // Configure entry pages
            //pipEntryProvider.fixedServerUrl('http://alpha.pipservices.net');

            // Configure default states
            pipAuthStateProvider.unauthorizedState('signin');
            pipAuthStateProvider.authorizedState('settings');

            $urlRouterProvider.otherwise(function ($injector, $location) {
                if ($location.$$path == '') return '/signin';
                else  return '/settings';
            });

            // Configure navigation menu
            pipSideNavProvider.sections([
                {
                    links: [
                        {title: 'Settings', url: '/settings'}
                    ]
                },
                {
                    links: [
                        {title: 'Signout', url: '/signout'}
                    ]
                },
            ]);

            pipSettingsProvider.addPage({
                state: 'test1',
                title: 'Test1 settings page',
                auth: true,
                stateConfig: {
                    url: '/test1',
                    template: '<h1>This is test 1 page in settings inserted through provider</h1>'
                }
            });

        }
    );

})(window.angular);

