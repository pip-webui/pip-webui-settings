/**
 * @file Settings sessions controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function () {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Sessions', [
        'pipSettings.Service', 'pipSettings.Page',]);

    thisModule.config(function (pipSettingsProvider, pipDataSessionProvider) {
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
                    sessions: pipDataSessionProvider.readSessionsResolver,
                    sessionId: pipDataSessionProvider.readSessionIdResolver
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
        function ($scope, pipTransaction, pipDataSession, sessions, sessionId) {

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
                var tid = $scope.transaction.begin('REMOVING');

                async.eachSeries(
                    $scope.sessions,
                    function (session: any, callback) {
                        if (session.id == $scope.sessionId) {
                            callback();
                        } else {
                            pipDataSession.removeSession(
                                {
                                    session: session
                                },
                                function () {
                                    $scope.sessions = _.without($scope.sessions, session);
                                    callback();
                                },
                                function (error) {
                                    callback;
                                }
                            );
                        }
                    },
                    function (err) {
                        if (err) {
                            $scope.transaction.end(err);
                        }
                        if ($scope.transaction.aborted(tid)) {
                            return;
                        }
                        $scope.transaction.end();
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
            function onRemove(session, callback) {
                if (session.id === $scope.sessionId) {
                    return;
                }
                var tid = $scope.transaction.begin('REMOVING');
                pipDataSession.removeSession(
                    {
                        session: session
                    },
                    function () {
                        if ($scope.transaction.aborted(tid)) {
                            return;
                        }
                        $scope.transaction.end();

                        $scope.sessions = _.without($scope.sessions, session);
                        if (callback) {
                            callback();
                        }
                    },
                    function (error) {
                        $scope.transaction.end(error);
                        $scope.message = 'ERROR_' + error.status || error.data.status_code;
                    }
                );
            }
        }
    );

})();
