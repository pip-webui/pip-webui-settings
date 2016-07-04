/**
 * @file Settings basic info controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';
    var thisModule = angular.module('pipUserSettings.BasicInfo',
        ['pipUserSettings.ChangePassword', 'pipUserSettings.VerifyEmail']);

    thisModule.config(function (pipSettingsProvider) {
        pipSettingsProvider.addPage({
            state: 'basic_info',
            index: 1,
            title: 'SETTINGS_BASIC_INFO_TITLE',
            stateConfig: {
                url: '/basic_info',
                controller: 'pipUserSettingsBasicInfoController',
                templateUrl: 'user_settings/user_settings_basic_info.html',
                auth: true
            }
        });

        pipSettingsProvider.setDefaultPage('basic_info');
    });

    /**
     * @ngdoc controller
     * @name pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
     *
     * @description
     * Controller for the predefined 'basic_info' state.
     * Provides sync changes user's profile with remote profile.
     * On state exit everything is saved on the server.
     */
    thisModule.controller('pipUserSettingsBasicInfoController',
        function ($scope, $rootScope, $mdDialog, $state, $window, $timeout, $mdTheming,
                  pipTranslate, pipTransaction, pipTheme,
                  pipToasts, pipUserSettingsPageData, pipFormErrors) {

            try {
                $scope.originalParty = angular.toJson($rootScope.$party);
            } catch (err) {
                throw err;
            }

            $scope.nameCopy = $rootScope.$party.name;

            $timeout(function () {
                $scope.loc_pos = $rootScope.$party.loc_pos;
            });

            $scope.genders = pipTranslate.translateSet(['male', 'female', 'n/s']);
            $scope.languages = pipTranslate.translateSet(['ru', 'en']);

            $scope.transaction = pipTransaction('settings.basic_info', $scope);

            $scope.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));

            $state.get('settings.basic_info').onExit = saveChanges;

            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            /** @see onChangePassword */
            $scope.onChangePassword = onChangePassword;
            /** @see onVerifyEmail */
            $scope.onVerifyEmail = onVerifyEmail;
            /** @see onPictureCreated */
            $scope.onPictureCreated = onPictureCreated;
            /** @see onPictureChanged */
            $scope.onPictureChanged = onPictureChanged;
            /** @see updateUser */
            $scope.onChangeUser = _.debounce(updateUser, 2000);
            /** @see saveChanges */
            $scope.onChangeBasicInfo = _.debounce(saveChanges, 2000);

            function onPictureChanged() {
                $scope.picture.save(
                    function () {
                        $rootScope.$broadcast('pipPartyAvatarUpdated');
                    },
                    function (error) {
                        return new Error(error);
                    }
                );
            }

            function onPictureCreated($event) {
                $scope.picture = $event.sender;
                $scope.picture.save(
                    function () {
                        $rootScope.$broadcast('pipPartyAvatarUpdated');
                    },
                    function (error) {
                        return new Error(error);
                    }
                );
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeBasicInfo
             *
             * @description
             * Saves changes onto server.
             * This method responses on change of the input information.
             * It is updated user's party profile. Also it updates user's profile in $rootScope.
             */
            function saveChanges() {
                if ($scope.form) {
                    $scope.form.$setSubmitted();
                }

                if ($rootScope.$party) {

                    if ($rootScope.$party.type === 'person' && $scope.form.$invalid) {
                        return;
                    }

                    // Check to avoid unnecessary savings
                    $rootScope.$party.loc_pos = $scope.loc_pos;
                    try {
                        var party = angular.toJson($rootScope.$party);
                    } catch (err) {
                        throw err;
                    }

                    if (party !== $scope.originalParty) {
                        pipUserSettingsPageData.updateParty($scope.transaction, $rootScope.$party,
                            function (data) {
                                $scope.originalParty = party;
                                $scope.nameCopy = data.name;
                            }, function (error) {
                                $scope.message = String() + 'ERROR_' + error.status || error.data.status_code;
                                $rootScope.$party = angular.fromJson($scope.originalParty);
                            }
                        );
                    }
                }

            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeUser
             *
             * @description
             * Saves changes onto server.
             * This method responses on change of the user's profile information.
             * Also it updates user's profile in $rootScope.
             */
            function updateUser() {

                if ($rootScope.$user.id === $rootScope.$party.id) {
                    pipUserSettingsPageData.updateUser($scope.transaction, $rootScope.$user,
                        function (data) {
                            pipTranslate.use(data.language);
                            $rootScope.$user.language = data.language;
                            $rootScope.$user.theme = data.theme;
                            if ($rootScope.$user.theme) {
                                pipTheme.setCurrentTheme($rootScope.$user.theme, true);
                            }

                        }, function (error) {
                            var message;

                            message = String() + 'ERROR_' + error.status || error.data.status_code;
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    );
                }
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangePassword
             *
             * @description
             * It opens a dialog panel to change password.
             *
             * @param {Object} event    Triggered event object
             */
            function onChangePassword(event) {
                var message;

                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_change_password.html',
                    controller: 'pipUserSettingsChangePasswordController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        if (answer) {
                            message = String() + 'RESET_PWD_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    });
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
             * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onVerifyEmail
             *
             * @description
             * It opens a dialog panel to change password.
             *
             * @param {Object} event    Triggered event object
             */
            function onVerifyEmail(event) {
                var message;

                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_verify_email.html',
                    controller: 'pipUserSettingsVerifyEmailController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        $scope.user.email_ver = answer;
                        if (answer) {
                            message = String() + 'VERIFY_EMAIL_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    }
                );
            }
        }
    );

})(window.angular, window._);
