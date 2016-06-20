(function () {
    'use strict';

    var thisModule = angular.module('pipSettings.Service', []);

    thisModule.provider('pipSettings', function (pipAuthStateProvider) {

        var defaultPage,
            pages = [];

        return {
            addPage: addPage,
            getPages: getPages,
            setDefaultPage: setDefaultPage,
            getDefaultPage: getDefaultPage,

            $get: function () {
                return {
                    getPages: getPages,
                    addPage: addPage,
                    getDefaultPage: getDefaultPage,
                    setDefaultPage: setDefaultPage
                }
            }
        };

        function getFullStateName(state) {
            return 'settings.' + state;
        }

        function getPages() {
            return _.clone(pages, true);
        }

        function getDefaultPage() {
            var defaultPage = _.find(pages, function (p) {
                return p.state == defaultPage;
            });
            return _.clone(defaultPage, true);
        }

        function addPage(pageObj) {
            validatePage(pageObj);

            var existingPage = _.find(pages, function (p) {
                return p.state == getFullStateName(pageObj.state);
            });
            if (existingPage) {
                throw new Error('Page with state name "' + pageObj.state + '" is already registered');
            }

            pages.push({
                state: getFullStateName(pageObj.state),
                title: pageObj.title,
                index: pageObj.index || 100000,
                access: pageObj.access,
                visible: pageObj.visible !== false,
                stateConfig: _.clone(pageObj.stateConfig, true)
            });

            pipAuthStateProvider.state(getFullStateName(pageObj.state), pageObj.stateConfig);

            // if we just added first state and no default state is specified
            if (typeof defaultPage === 'undefined' && pages.length === 1) {
                setDefaultPage(pageObj.state);
            }
        }

        function setDefaultPage(name) {
            if (!_.find(pages, function (page) {
                    return page.state == getFullStateName(name);
                })) {
                throw new Error('Page with state name "' + name + '" is not registered');
            }

            defaultPage = getFullStateName(name);

            pipAuthStateProvider.redirect('settings', getFullStateName(name));
        }

        function validatePage(pageObj) {
            if (!pageObj || !_.isObject(pageObj)) {
                throw new Error('Invalid object');
            }

            if (pageObj.state == null || pageObj.state == '') {
                throw new Error('Page should have valid Angular UI router state name');
            }

            if (pageObj.access && !_.isFunction(pageObj.access)) {
                throw new Error('"access" should be a function');
            }

            if (!pageObj.stateConfig || !_.isObject(pageObj.stateConfig)) {
                throw new Error('Invalid state configuration object');
            }
        }
    });

})();