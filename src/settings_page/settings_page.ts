/**
 * @file Define controller for a settings tab
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function () {
    'use strict';

    var thisModule = angular.module('pipSettings.Page', [

        'pipSettings.Service', 'pipNav', 'pipSelected', 'pipTranslate',
        'pipSettings.Templates'
    ]);

    thisModule.config(function ($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings?party_id',
            auth: true,
            controller: 'pipSettingsPageController',
            templateUrl: 'settings_page/settings_page.html'
        });
    });

    /**
     * @ngdoc controller
     * @name pipSettings.Page:pipSettingsPageController
     *
     * @description
     * The controller is used for the whole settings tabs and provides
     * navigation menu on the left and load content into right panel.
     * This component is integrated with `'pipAppBar'` component and adapt the tabs header.
     * The component has predefined states `'settings.base_info'` and `'settings.active_sessions'`. Each of these states
     * require user's authorization.
     *
     * @requires pipAppBar
     */
    thisModule.controller('pipSettingsPageController',
        function ($scope, $state, $rootScope, $timeout, pipAppBar, pipSettings, pipActions,
                  pipBreadcrumb, pipNavIcon) {

            $scope.tabs = _.filter(pipSettings.getTabs(), function (tab: any) {
                if (tab.visible === true && (tab.access ? tab.access($rootScope.$user, tab) : true)) {
                    return tab;
                }
            });

            $scope.tabs = _.sortBy($scope.tabs, 'index');

            $scope.selected = {};
            if ($state.current.name !== 'settings') {
                initSelect($state.current.name);
            } else if ($state.current.name === 'settings' && pipSettings.getDefaultTab()) {
                initSelect(pipSettings.getDefaultTab().state);
            } else {
                $timeout(function () {
                    if (pipSettings.getDefaultTab()) {
                        initSelect(pipSettings.getDefaultTab().state);
                    }
                    if (!pipSettings.getDefaultTab() && $scope.tabs.length > 0) {
                        initSelect($scope.tabs[0].state);
                    }
                });
            }

            appHeader();

            /** @see onNavigationSelect */
            $scope.onNavigationSelect = onNavigationSelect;
            /** @see onDropdownSelect */
            $scope.onDropdownSelect = onDropdownSelect;

            /**
             * Config header panel
             */
            function appHeader() {
                pipActions.hide();
                pipAppBar.part('menu', true);
                pipAppBar.part('actions', 'primary');
                pipAppBar.part('icon', true);
                pipAppBar.part('title', 'breadcrumb');
                pipAppBar.removeShadow();
                pipBreadcrumb.text = 'Settings';
                pipNavIcon.showMenu();
            }

            /**
             * @ngdoc method
             * @methodOf pipSettings.Page:pipSettingsPageController
             * @name pipSettings.Page:pipSettingsPageController:onDropdownSelect
             *
             * @description
             * Method changes selected tab in the navigation menu and transfer to selected tab(state).
             * It used on mobile screens.
             *
             * @param {Object} state    State configuration object
             */
            function onDropdownSelect(state) {
                onNavigationSelect(state.state);
            }

            /**
             * @ngdoc method
             * @methodOf pipSettings.Page:pipSettingsPageController
             * @name pipSettings.Page:pipSettingsPageController:onNavigationSelect
             *
             * @description
             * Method changes selected tab in the navigation menu and transfer to selected tab(state).
             * It uses on screens more than mobile.
             *
             * @param {string} state    Name of new state
             */
            function onNavigationSelect(state) {
                initSelect(state);

                if ($scope.selected.tab) {
                    $state.go(state);
                }
            }

            /**
             * Establish selected tab
             */
            function initSelect(state) {
                $scope.selected.tab = _.find($scope.tabs, function (tab: any) {
                    return tab.state === state;
                });
                $scope.selected.tabIndex = _.indexOf($scope.tabs, $scope.selected.tab);
                $scope.selected.tabId = state;
            }
        });

})();
