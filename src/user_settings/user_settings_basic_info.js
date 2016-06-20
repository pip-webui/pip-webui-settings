/**
 * @file Settings basic info controller
 * @copyright Digital Living Software Corp. 2014-2016
 */


(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.BasicInfo', ['pipUserSettings.ChangePassword', 'pipUserSettings.VerifyEmail']);

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

    thisModule.controller('pipUserSettingsBasicInfoController',
        function ($scope, $rootScope, $mdDialog, $state, $window, pipTranslate, pipTransaction, pipTheme, $mdTheming,
                  pipToasts, pipUserSettingsPageData, pipFormErrors) {

            $scope.originalParty = angular.toJson($rootScope.$party);

            $scope.nameCopy = $rootScope.$party.name;
            setTimeout(function () {
                $scope.loc_pos = $rootScope.$party.loc_pos;
                $scope.$apply();
            });

            $scope.genders = pipTranslate.translateSet(['male', 'female', 'n/s']);
            $scope.languages = pipTranslate.translateSet(['ru', 'en']);

            $scope.transaction = pipTransaction('settings.basic_info', $scope);

            $scope.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));

            $state.get('settings.basic_info').onExit = saveChanges;

            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            $scope.onChangePassword = onChangePassword;
            $scope.onVerifyEmail = onVerifyEmail;
            $scope.onPictureCreated = onPictureCreated;
            $scope.onPictureChanged = onPictureChanged;
            $scope.onChangeUser = _.debounce(updateUser, 2000);
            $scope.onChangeBasicInfo = _.debounce(saveChanges, 2000);

            return;

            //-----------------------------

            function onPictureChanged($control) {
                $scope.picture.save(
                    function () {
                        $rootScope.$broadcast('pipPartyAvatarUpdated');

                    },
                    function (error) {
                        console.error(error);
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
                        console.error(error);
                    }
                );
            }

            function saveChanges() {
                if ($scope.form)
                    $scope.form.$setSubmitted();

                if ($rootScope.$party) {

                    if ($rootScope.$party.type == 'person' && $scope.form.$invalid) return;

                    // Check to avoid unnecessary savings
                    $rootScope.$party.loc_pos = $scope.loc_pos;
                    var party = angular.toJson($rootScope.$party);

                    if (party != $scope.originalParty) {
                        pipUserSettingsPageData.updateParty($scope.transaction, $rootScope.$party,
                            function (data) {
                                $scope.originalParty = party;
                                $scope.nameCopy = data.name;
                            }, function (error) {
                                $scope.message = String() + 'ERROR_' + error.status || error.data.status_code;
                                //pipToasts.showNotification(pipTranslate.translate($scope.message), null, null, null);
                                $rootScope.$party = angular.fromJson($scope.originalParty);
                            }
                        );
                    }
                }

            }

            function updateUser() {

                //if ($rootScope.$user.theme)
                //pipTheme.setCurrentTheme($rootScope.$user.theme);

                if ($rootScope.$user.id == $rootScope.$party.id) {
                    pipUserSettingsPageData.updateUser($scope.transaction, $rootScope.$user,
                        function (data) {
                            pipTranslate.use(data.language);
                            $rootScope.$user.language = data.language;
                            $rootScope.$user.theme = data.theme;
                            if ($rootScope.$user.theme)
                                pipTheme.setCurrentTheme($rootScope.$user.theme, true);


                            // $window.location.reload();

                        }, function (error) {
                            var message = String() + 'ERROR_' + error.status || error.data.status_code;
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                            //$scope.user.language =  angular.fromJson($scope.originalParty).language;
                            //$scope.user.theme = angular.fromJson($scope.originalParty).theme;
                        }
                    );
                }


            }

            function onChangePassword(event) {
                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_change_password.html',
                    controller: 'pipUserSettingsChangePasswordController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        if (answer) {
                            var message = String() + 'RESET_PWD_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    });
            }

            function onVerifyEmail(event) {
                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_verify_email.html',
                    controller: 'pipUserSettingsVerifyEmailController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        $scope.user.email_ver = answer;
                        if (answer) {
                            var message = String() + 'VERIFY_EMAIL_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);

                        }
                    }
                );
            }
        }
    );

})(window.angular, window._);
