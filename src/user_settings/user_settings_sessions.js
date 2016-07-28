/**
 * @file Settings sessions controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _, async) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Sessions', []);

    thisModule.config(function (pipSettingsProvider, pipUserSettingsTabDataProvider) {
        pipSettingsProvider.addTab({
            state: 'sessions',
            index: 3,
            title: 'SETTINGS_ACTIVE_SESSIONS_TITLE',
            stateConfig: {
                url: '/sessions',
                controller: 'pipUserSettingsSessionsController',
                templateUrl: 'user_settings/user_settings_sessions.html',
                auth: true,
                resolve: {
                    sessions: pipUserSettingsTabDataProvider.readSessionsResolver,
                    sessionId: pipUserSettingsTabDataProvider.readSessionIdResolver
                }
            }
        });
    });

    /**
     * @ngdoc controller
     * @name pipUserSettings.Sessions:pipUserSettingsSessionsController
     *
     * @description
     * Controller provides an interface for managing active sessions.
     */
    thisModule.controller('pipUserSettingsSessionsController',
        function ($scope, pipTransaction, pipUserSettingsTabData, sessions, sessionId) {

            $scope.sessionId = sessionId;
            $scope.transaction = pipTransaction('settings.sessions', $scope);
            $scope.sessions = sessions;

            $scope.onRemoveAll = onRemoveAll;
            $scope.onRemove = onRemove;

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
             * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemoveAll
             *
             * @description
             * Closes all active session.
             */
            function onRemoveAll() {
                async.each($scope.sessions, function (session) {
                    if (session.id !== $scope.sessionId) {
                        $scope.onRemove(session);
                    }
                });
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
             * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemove
             *
             * @description
             * Closes passed session.
             *
             * @param {Object} session  Session configuration object
             */
            function onRemove(session) {
                if (session.id === $scope.sessionId) {
                    return;
                }

                pipUserSettingsTabData.removeSession($scope.transaction, session,
                    function () {
                        $scope.sessions = _.without($scope.sessions, session);
                    },
                    function (error) {
                        $scope.message = 'ERROR_' + error.status || error.data.status_code;
                    }
                );
            }
        }
    );

})(window.angular, window._, window.async);
