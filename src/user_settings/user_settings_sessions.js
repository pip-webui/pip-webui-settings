/**
 * @file Settings sessions controller
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Sessions', []);

    thisModule.config(function (pipSettingsProvider, pipUserSettingsPageDataProvider,  pipAuthStateProvider) {
        pipSettingsProvider.addPage({
            state: 'sessions',
            index: 3,
            title: 'SETTINGS_ACTIVE_SESSIONS_TITLE',
            stateConfig: {
                url: '/sessions',
                controller: 'pipUserSettingsSessionsController',
                templateUrl: 'user_settings/user_settings_sessions.html',
                auth: true,
                resolve: {
                    sessions: pipUserSettingsPageDataProvider.readSessionsResolver,
                    sessionId: pipUserSettingsPageDataProvider.readSessionIdResolver
                }
            }
        });
    });

    thisModule.controller('pipUserSettingsSessionsController',
        function ($scope, pipTransaction, pipUserSettingsPageData, sessions, sessionId) {

            $scope.sessionId = sessionId;
            $scope.transaction = pipTransaction('settings.sessions', $scope);
            $scope.sessions = sessions;

            $scope.onRemoveAll = onRemoveAll;
            $scope.onRemove = onRemove;

            return;
            //-----------------------------

            function onRemoveAll() {
                async.each($scope.sessions, function (session) {
                    if (session.id != $scope.sessionId)
                        $scope.onRemove(session);
                });
            }

            function onRemove(session) {
                if (session.id == $scope.sessionId) return;

                pipUserSettingsPageData.removeSession($scope.transaction, session,
                    function () {
                        $scope.sessions = _.without($scope.sessions, session);
                    }, 
                    function (error) {
                        $scope.message = 'ERROR_' + error.status || error.data.status_code;

                        //$scope.onShowToast(message, 'error');
                    }
                );
            }
        }
    );
	
})(window.angular, window._);
