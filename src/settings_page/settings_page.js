/**
 * @file Define controller for a settings page
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSettings.Page', [
        'pipState', 'pipSettings.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipSettings.Templates'
    ]);

    thisModule.config(function (pipAuthStateProvider) {
        pipAuthStateProvider.state('settings', {
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
     * The controller is used for the whole settings pages and provides
     * navigation menu on the left and load content into right panel.
     * This component is integrated with `'pipAppBar'` component and adapt the pages header.
     * The component has predefined states `'settings.base_info'` and `'settings.active_sessions'`. Each of these states
     * require user's authorization.
     *
     * @requires pipAppBar
     */
    thisModule.controller('pipSettingsPageController',
        function ($scope, $state, $rootScope, $timeout, pipAppBar, pipSettings) {

            $scope.pages = _.filter(pipSettings.getPages(), function (page) {
                if (page.visible === true && (page.access ? page.access($rootScope.$user, page) : true)) {
                    return page;
                }
            });

            $scope.pages = _.sortBy($scope.pages, 'index');

            $scope.selected = {};
            if ($state.current.name !== 'settings') {
                initSelect($state.current.name);
            }
            if ($state.current.name === 'settings' && pipSettings.getDefaultPage()) {
                initSelect(pipSettings.getDefaultPage().state);
            } else {
                $timeout(function () {
                    if (pipSettings.getDefaultPage()) {
                        initSelect(pipSettings.getDefaultPage().state);
                    }
                    if (!pipSettings.getDefaultPage() && $scope.pages.length > 0) {
                        initSelect($scope.pages[0].state);
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
                pipAppBar.showMenuNavIcon();
                pipAppBar.showTitleText('SETTINGS_TITLE');
                pipAppBar.showLocalActions(null, []);
                pipAppBar.showShadowSm();
                pipAppBar.hideSearch();
            }

            /**
             * @ngdoc method
             * @methodOf pipSettings.Page:pipSettingsPageController
             * @name pipSettings.Page:pipSettingsPageController:onDropdownSelect
             *
             * @description
             * Method changes selected page in the navigation menu and transfer to selected page(state).
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
             * Method changes selected page in the navigation menu and transfer to selected page(state).
             * It uses on screens more than mobile.
             *
             * @param {string} state    Name of new state
             */
            function onNavigationSelect(state) {
                initSelect(state);

                if ($scope.selected.page) {
                    $state.go(state);
                }
            }

            /**
             * Establish selected page
             */
            function initSelect(state) {
                $scope.selected.page = _.find($scope.pages, function (page) {
                    return page.state === state;
                });
                $scope.selected.pageIndex = _.indexOf($scope.pages, $scope.selected.page);
                $scope.selected.pageId = state;
            }
        });

})(window.angular, window._);
