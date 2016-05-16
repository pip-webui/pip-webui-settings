/* global angular */

(function () {
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

    thisModule.controller('pipSettingsPageController', function ($scope, $state, $rootScope, pipAppBar, pipSettings) {

        $scope.pages = _.filter(pipSettings.getPages(), function (page) {
            if (page.visible === true && (page.access ? page.access($rootScope.$user, page) : true)) {
                return page;
            }
        });

        $scope.pages =_.sortBy($scope.pages, function(page){
            return page.index;
        });

        $scope.selected = {};
        if ($state.current.name != 'settings')
            initSelect($state.current.name);
        else {
            if (pipSettings.getDefaultPage())
                initSelect(pipSettings.getDefaultPage().state);
            else {
                setTimeout(function () {
                    if (pipSettings.getDefaultPage())
                        initSelect(pipSettings.getDefaultPage().state);
                    else {
                        if($scope.pages.length >0)
                            initSelect($scope.pages[0].state);

                    }
                }, 0);

            }

        }

        appHeader();

        $scope.onNavigationSelect = onNavigationSelect;
        $scope.onDropdownSelect = onDropdownSelect;

        return;

        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleText('SETTINGS_TITLE');
            pipAppBar.showLocalActions(null, []);
            pipAppBar.hideShadow();
            pipAppBar.hideSearch();
        };

        function onDropdownSelect(state) {
            onNavigationSelect(state.state);
        }

        function onNavigationSelect(state) {
            initSelect(state);

            if ($scope.selected.page) {

                $state.go(state);

            }
        };

        function initSelect(state) {
            $scope.selected.page = _.find($scope.pages, function (page) {
                return page.state == state;
            });
            $scope.selected.pageIndex = _.indexOf($scope.pages, $scope.selected.page);
            $scope.selected.pageId = state;
        }
    });


})();