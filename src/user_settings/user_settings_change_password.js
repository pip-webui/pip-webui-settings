/**
 * @file Settings change password controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.ChangePassword', []);

    thisModule.controller('pipUserSettingsChangePasswordController',
        function ($scope, $rootScope, $mdDialog, email, pipRest, pipTransaction, pipFormErrors) {

            $scope.transaction = pipTransaction('settings.change_password', $scope);
            $scope.errorsRepeatWithHint = function (form, formPart) {
                if ($scope.showRepeatHint) {
                    return pipFormErrors.errorsWithHint(form, formPart);
                }

                return {};
            };
            $scope.showRepeatHint = true;
            $scope.changePasData = {};

            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            $scope.onCancel = onCancel;
            $scope.onCheckRepeatPassword = onCheckRepeatPassword;
            $scope.onApply = onApply;

            function onCancel() {
                $mdDialog.cancel();
            }

            function onCheckRepeatPassword() {
                if ($scope.changePasData) {
                    if ($scope.repeat === $scope.changePasData.new_password || $scope.repeat === '' || !$scope.repeat) {
                        $scope.form.repeat.$setValidity('repeat', true);
                        if ($scope.repeat === $scope.changePasData.new_password) {
                            $scope.showRepeatHint = false;
                        } else {
                            $scope.showRepeatHint = true;
                        }
                    } else {
                        $scope.showRepeatHint = true;
                        $scope.form.repeat.$setValidity('repeat', false);
                    }
                }
            }

            function onApply() {
                $scope.onCheckRepeatPassword();

                if ($scope.form.$invalid) {
                    return;
                }

                if (!$scope.transaction.begin('CHANGE_PASSWORD')) {
                    return;
                }

                $scope.changePasData.email = email;

                pipRest.changePassword().call(
                    $scope.changePasData,
                    function () {
                        $scope.transaction.end();
                        $mdDialog.hide(true);
                    },
                    function (error) {
                        $scope.transaction.end(error);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1107: 'oldPassword',
                                1105: 'newPassword'
                            }
                        );
                    }
                );
            }
        }
    );

})(window.angular);
