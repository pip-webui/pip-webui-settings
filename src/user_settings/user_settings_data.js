/**
 * @file Settings data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Data', ['pipDataModel']);

    thisModule.provider('pipUserSettingsPageData', function () {

        this.readContactsResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.getOwnContacts().get({
                    party_id: pipRest.partyId($stateParams),
                    session_id: pipRest.sessionId()
                }).$promise;
            };

        this.readBlocksResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.connectionBlocks().query({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            };

        this.readSessionsResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.userSessions().query({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            };

        this.readActivitiesResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.partyActivities().page({
                    party_id: pipRest.partyId($stateParams),
                    paging: 1,
                    skip: 0,
                    take: 25
                }).$promise;
            };

        this.readSettingsResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.partySettings().get({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            };

        this.readSessionIdResolver = /* @ngInject */
            function ($stateParams, pipRest) {
                return pipRest.sessionId();
            };

        // CRUD operations and other business methods

        this.$get = function (pipRest, $stateParams) {
            return {
                partyId: pipRest.partyId,

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
