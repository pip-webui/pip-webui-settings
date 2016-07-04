/**
 * @file Settings data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Data', ['pipDataModel']);

    /**
     * @ngdoc service
     * @name pipUserSettings.Data:pipUserSettingsPageDataProvider
     *
     * @description
     * Service reproduces a data layer for settings component.
     * The service provides an interface to interact with server.
     *
     * @requires pipDataModel
     */
    /**
     * @ngdoc service
     * @name pipUserSettings.Data:pipUserSettingsPageData
     *
     * @description
     * Service reproduces a data layer for settings component.
     * The service provides an interface to interact with server.
     *
     * @requires pipDataModel
     */
    thisModule.provider('pipUserSettingsPageData', function () {

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Data:pipUserSettingsPageDataProvider
         * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:readContactsResolver
         *
         * @description
         * Retrieve user's contacts from the server.
         *
         * @returns {promise} Request promise.
         */
        this.readContactsResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.getOwnContacts().get({
                    party_id: pipRest.partyId($stateParams),
                    session_id: pipRest.sessionId()
                }).$promise;
            };

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Data:pipUserSettingsPageDataProvider
         * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:readBlocksResolver
         *
         * @description
         * Retrieves blocks resolver from the server.
         *
         * @returns {promise} Request promise.
         */
        this.readBlocksResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.connectionBlocks().query({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            };

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Data:pipUserSettingsPageDataProvider
         * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:readSessionsResolver
         *
         * @description
         * Retrieves user's active sessions from the server.
         *
         * @returns {promise} Request promise.
         */
        this.readSessionsResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.userSessions().query({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            };

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Data:pipUserSettingsPageDataProvider
         * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:readSessionsResolver
         *
         * @description
         * Retrieves user's activities collection.
         *
         * @returns {promise} Request promise.
         */
        this.readActivitiesResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.partyActivities().page({
                    party_id: pipRest.partyId($stateParams),
                    paging: 1,
                    skip: 0,
                    take: 25
                }).$promise;
            };

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Data:pipUserSettingsPageDataProvider
         * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:readSettingsResolver
         *
         * @description
         * Retrieves user's party settings object from the server.
         *
         * @returns {promise} Request promise.
         */
        this.readSettingsResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.partySettings().get({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            };

        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Data:pipUserSettingsPageDataProvider
         * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:readSessionIdResolver
         *
         * @description
         * Retrieves current user's active session id.
         *
         * @returns {promise} Request promise.
         */
        this.readSessionIdResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.sessionId();
            };

        // CRUD operations and other business methods

        this.$get = function (pipRest, $stateParams) {
            return {
                /**
                 * @ngdoc property
                 * @propertyOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:partyId
                 *
                 * @description
                 * Contains user's party ID.
                 */
                partyId: pipRest.partyId,

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:updateParty
                 *
                 * @description
                 * Updates user's party configuration.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} party        New updating object
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                updateParty: function (transaction, party, successCallback, errorCallback) {
                    var tid = transaction.begin('UPDATING');

                    if (!tid) {
                        return;
                    }

                    pipRest.parties().update(
                        party,
                        function (updatedParty) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();

                            if (successCallback) {
                                successCallback(updatedParty);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:saveContacts
                 *
                 * @description
                 * Saves user's contacts.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Array<Object>} contacts      New updating contacts collection
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                saveContacts: function (transaction, contacts, successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');

                    if (!tid) {
                        return;
                    }

                    pipRest.contacts().save(
                        contacts,
                        function (savedContacts) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();
                            if (successCallback) {
                                successCallback(savedContacts);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:updateContact
                 *
                 * @description
                 * Updates a contact record.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} contact      Updating contant object
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                updateContact: function (transaction, contact, successCallback, errorCallback) {
                    var tid = transaction.begin('UPDATING');

                    if (!tid) {
                        return;
                    }

                    pipRest.contacts().update(
                        contact,
                        function (updatedContact) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();
                            if (successCallback) {
                                successCallback(updatedContact);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:updateUser
                 *
                 * @description
                 * Updates a user's profile.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} user         Updating user's profile
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                updateUser: function (transaction, user, successCallback, errorCallback) {
                    var tid = transaction.begin('UPDATING');

                    if (!tid) {
                        return;
                    }
                    pipRest.users().update(
                        user,
                        function (updatedUser) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();
                            if (successCallback) {
                                successCallback(updatedUser);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:removeBlock
                 *
                 * @description
                 * Removes a block.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} block        Removing block object
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                removeBlock: function (transaction, block, successCallback, errorCallback) {
                    var tid = transaction.begin('REMOVING');

                    if (!tid) {
                        return;
                    }
                    pipRest.connectionBlocks().remove(
                        block,
                        function (removedBlock) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();
                            if (successCallback) {
                                successCallback(removedBlock);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:removeBlock
                 *
                 * @description
                 * Remove an session, passed through parameters.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} session      Removing block object
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                removeSession: function (transaction, session, successCallback, errorCallback) {
                    var tid = transaction.begin('REMOVING');

                    if (!tid) {
                        return;
                    }
                    pipRest.userSessions().remove(
                        {
                            id: session.id,
                            party_id: pipRest.partyId($stateParams)
                        },
                        function (removedSession) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();
                            if (successCallback) {
                                successCallback(removedSession);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:requestEmailVerification
                 *
                 * @description
                 * Cancels process of email verification.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 */
                requestEmailVerification: function (transaction) {
                    var tid = transaction.begin('RequestEmailVerification');

                    if (!tid) {
                        return;
                    }

                    pipRest.requestEmailVerification().get(
                        {
                            party_id: pipRest.partyId($stateParams)
                        },
                        function () {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();
                        }, function (error) {
                            transaction.end(error);
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:verifyEmail
                 *
                 * @description
                 * Verifies passed email.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} verifyData   Verified data
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                verifyEmail: function (transaction, verifyData, successCallback, errorCallback) {
                    var tid = transaction.begin('Verifying');

                    if (!tid) {
                        return;
                    }

                    pipRest.verifyEmail().call(
                        verifyData,
                        function (verifyData) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();

                            if (successCallback) {
                                successCallback(verifyData);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:verifyEmail
                 *
                 * @description
                 * Saves user's settings.
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} settings     Saves user's settings
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                saveSettings: function (transaction, settings, successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');

                    if (!tid) {
                        return;
                    }

                    pipRest.partySettings().save(
                        settings,
                        function (savedSettings) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();

                            if (successCallback) {
                                successCallback(savedSettings);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:getPreviousActivities
                 *
                 * @description
                 * Retrieves previous user's activities
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {number} start        Start position
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                getPreviousActivities: function (transaction, start, successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');

                    if (!tid) {
                        return;
                    }

                    pipRest.partyActivities().page(
                        {
                            party_id: pipRest.partyId($stateParams),
                            paging: 1,
                            skip: start,
                            take: 25
                        },
                        function (pagedActivities) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();
                            if (successCallback) {
                                successCallback(pagedActivities);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                },

                /**
                 * @ngdoc method
                 * @methodOf pipUserSettings.Data:pipUserSettingsPageData
                 * @name pipUserSettings.Data.pipUserSettingsPageDataProvider:getRefPreviousEventsActivities
                 *
                 * @description
                 * Retrieves events for corresponded to pervious activities
                 *
                 * @param {Object} transaction  Service provides API to change application state
                 * @param {Object} start        Start position
                 * @param {string} refType      Name of needed entity
                 * @param {Object} item         Entity object
                 * @param {Function} successCallback    Function invokes when data is updated successfully
                 * @param {Function} errorCallback      Function invokes when data is not updated
                 */
                getRefPreviousEventsActivities: function (transaction, start, refType, item,
                                                          successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');

                    if (!tid) {
                        return;
                    }

                    pipRest.partyActivities().page(
                        {
                            party_id: pipRest.partyId($stateParams),
                            paging: 1,
                            skip: start,
                            ref_type: refType,
                            ref_id: item.id,
                            take: 25
                        },
                        function (pagedActivities) {
                            if (transaction.aborted(tid)) {
                                return;
                            }
                            transaction.end();

                            if (successCallback) {
                                successCallback(pagedActivities);
                            }
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) {
                                errorCallback(error);
                            }
                        }
                    );
                }
            };
        };
    });

})(window.angular);
