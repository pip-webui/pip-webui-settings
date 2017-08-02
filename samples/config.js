/**
 * @file Global configuration for sample application
 * @copyright Digital Living Software Corp. 2014-2015
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipSampleConfig', [ 'pipSideNav',
        'pipAppBar', 'pipSettings', 'pipSettingsConfig']);
    // 'pipRest.State', 'pipRest', 'pipData', 'pipDataSettings', 'pipEntry',

    // Configure application services before start
    thisModule.config(
        function ($mdThemingProvider, $urlRouterProvider,
                  //pipAuthStateProvider,
                  // pipSideNavProvider, pipDataConfigProvider,
                  pipAppBarProvider, $mdIconProvider, pipSettingsProvider) {

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            pipAppBarProvider.parts = {icon: true, title: 'breadcrumb', actions: 'primary', menu: true };
            // Set global constants
            //pipAppBarProvider.appTitleText('Sample Application');

            // pipSettingsProvider.showNavIcon(false);
            // pipSettingsProvider.showTitleLogo('images/piplife_logo.svg');

            /*
            pipAppBarProvider.globalSecondaryActions([
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ]);*/

            // Configure REST API
            //pipDataConfigProvider.serverUrl('http://alpha.pipservices.net');

            // Configure default states

            $urlRouterProvider.otherwise('settings');
            //pipAuthStateProvider.unauthorizedState('signin');
            //pipAuthStateProvider.authorizedState('settings');

            $urlRouterProvider.otherwise(function ($injector, $location) {
                return $location.$$path === '' ? '/signin' : '/settings/test1';
            });

            pipSettingsProvider.setDefaultTab('test1');

            // Configure navigation menu
            /*pipSideNavProvider.sections([
                {
                    links: [
                        {title: 'Settings', url: '/settings'}
                    ]
                }, {
                    links: [
                        {title: 'Signout', url: '/signout'}
                    ]
                }
            ]);*/
        }
    );

})(window.angular);

