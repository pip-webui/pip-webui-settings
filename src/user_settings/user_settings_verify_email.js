/**
 * @file Settings verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.VerifyEmail', []);

    /**
     * @ngdoc controller
     * @name pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
     *
     * @description
     * Controller for verify email dialog panel.
     */
    thisModule.controller('pipUserSettingsVerifyEmailController',
        function ($scope, $rootScope, $mdDialog, pipTransaction, pipFormErrors, pipUserSettingsPageData, email) {

            $scope.emailVerified = false;
            $scope.data = {
                email: email,
                code: ''
            };
            $scope.transaction = pipTransaction('settings.verify_email', $scope);

            /** @see onAbort */
            $scope.onAbort = onAbort;
            /** @see onRequestVerificationClick*/
            $scope.onRequestVerificationClick = onRequestVerificationClick;
            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            /** @see onVerify */
            $scope.onVerify = onVerify;
            /** @see onCancel */
            $scope.onCancel = onCancel;

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onAbort
             *
             * @description
             * Aborts a verify request.
             */
            function onAbort() {
                $scope.transaction.abort();
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onCancel
             *
             * @description
             * Closes opened dialog panel.
             */
            function onCancel() {
                $mdDialog.cancel();
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onRequestVerificationClick
             *
             * @description
             * Sends request to verify entered email.
             */
            function onRequestVerificationClick() {
                pipUserSettingsPageData.requestEmailVerification($scope.transaction);
            }

            /**
             * @ngdoc method
             * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
             * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onVerify
             *
             * @description
             * Initiates request on verify email on the server.
             */
            function onVerify() {
                $scope.form.$setSubmitted();

                if ($scope.form.$invalid) {
                    return;
                }

                pipUserSettingsPageData.verifyEmail(
                    $scope.transaction,
                    $scope.data,
                    function () {
                        $mdDialog.hide(true);
                    },
                    function (error) {
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1106: 'email',
                                1103: 'code'
                            }
                        );

                    }
                );
            }
        }
    );

})(window.angular);
