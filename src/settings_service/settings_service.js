/**
 * @file Service for settings component
 * @copyright Digital Living Software Corp. 2014-2016
 */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSettings.Service', []);

    /**
     * @ngdoc service
     * @name pipSettings.Service:pipSettingsProvider
     *
     * @description
     * Service provides an interface to manage 'Settings' component behaviour.
     * It is available on config and run phases.
     */
    thisModule.provider('pipSettings', function (pipAuthStateProvider) {

        var defaultPage,
            pages = [];

        return {
            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:addPage
             *
             * @description
             * Register new page in 'Settings' component. Before adding a page this method validates passed object.
             *
             * @param {Object} pageObj  Configuration object for new page.
             */
            addPage: addPage,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:getPages
             *
             * @description
             * Method returns collection of registered pages.
             *
             * @returns {Array<Object>} Collection of pages.
             */
            getPages: getPages,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:setDefaultPage
             *
             * @description
             * Establish a page which is available by default (after chose this component in menu).
             *
             * @param {string} name     Name of the default state for this component.
             */
            setDefaultPage: setDefaultPage,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:getDefaultPage
             *
             * @description
             * Method returns an config object for pages established as default (it will be opened when app transeferred to
             * abstract state 'settings').
             *
             * @returns {Array<Object>} Collection of pages.
             */
            getDefaultPage: getDefaultPage,

            $get: function () {
                /**
                 * @ngdoc service
                 * @name pipSettings.Service:pipSettings
                 *
                 * @description
                 * Service provides an interface to manage 'Settings' component behaviour.
                 * It is available on config and run phases.
                 */
                return {
                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:getPages
                     *
                     * @description
                     * Method returns collection of registered pages.
                     *
                     * @returns {Array<Object>} Collection of pages.
                     */
                    getPages: getPages,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:addPage
                     *
                     * @description
                     * Register new page in 'Settings' component. Before adding a page this method validates passed object.
                     *
                     * @param {Object} pageObj  Configuration object for new page.
                     */
                    addPage: addPage,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:getDefaultPage
                     *
                     * @description
                     * Method returns an config object for pages established as default (it will be opened when app transeferred to
                     * abstract state 'settings').
                     *
                     * @returns {Array<Object>} Collection of pages.
                     */
                    getDefaultPage: getDefaultPage,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:setDefaultPage
                     *
                     * @description
                     * Establish a page which is available by default (after chose this component in menu).
                     *
                     * @param {string} name     Name of the default state for this component.
                     */
                    setDefaultPage: setDefaultPage
                };
            }
        };

        /**
         * Appends component abstract state prefix to passed state
         */
        function getFullStateName(state) {
            return 'settings.' + state;
        }

        function getPages() {
            return _.clone(pages, true);
        }

        function getDefaultPage() {
            var defaultPage;

            defaultPage = _.find(pages, function (p) {
                return p.state === defaultPage;
            });

            return _.clone(defaultPage, true);
        }

        function addPage(pageObj) {
            var existingPage;

            validatePage(pageObj);
            existingPage = _.find(pages, function (p) {
                return p.state === getFullStateName(pageObj.state);
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
            // TODO [apidhirnyi] extract expression inside 'if' into variable. It isn't readable now.
            if (!_.find(pages, function (page) {
                return page.state === getFullStateName(name);
            })) {
                throw new Error('Page with state name "' + name + '" is not registered');
            }

            defaultPage = getFullStateName(name);

            pipAuthStateProvider.redirect('settings', getFullStateName(name));
        }

        /**
         * Validates passed page config object
         * If passed page is not valid it will throw an error
         */
        function validatePage(pageObj) {
            if (!pageObj || !_.isObject(pageObj)) {
                throw new Error('Invalid object');
            }

            if (pageObj.state === null || pageObj.state === '') {
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

})(window.angular, window._);
