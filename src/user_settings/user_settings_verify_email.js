/**
 * @file Settings verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('pipUserSettings.VerifyEmail', []);

    thisModule.controller('pipUserSettingsVerifyEmailController',
        function ($scope, $rootScope, $mdDialog, pipTransaction, pipFormErrors, pipUserSettingsPageData, email) {

            $scope.emailVerified = false;
            $scope.data = {
                email: email,
                code: ''
            };
            $scope.transaction = pipTransaction('settings.verify_email', $scope);

            $scope.onAbort = onAbort;
            $scope.onRequestVerificationClick = onRequestVerificationClick;
            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            $scope.onVerify = onVerify;
            $scope.onCancel = onCancel;

            return;
            //-----------------------------

            function onAbort() {
                $scope.transaction.abort();
            };

            function onCancel() {
                $mdDialog.cancel();
            };

            function onRequestVerificationClick() {
                pipUserSettingsPageData.requestEmailVerification($scope.transaction);
            };

            function onVerify() {
                $scope.form.$setSubmitted();

                if ($scope.form.$invalid) return;

                pipUserSettingsPageData.verifyEmail(
                    $scope.transaction,
                    $scope.data,
                    function (verifyData) {
                        $mdDialog.hide(true);
                    },
                    function (error) {
                        //pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1106: 'email',
                                1103: 'code'
                            }
                        );

                    }
                )
            };
        }
    );

})();
