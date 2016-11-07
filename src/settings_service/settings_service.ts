/**
 * @file Service for settings component
 * @copyright Digital Living Software Corp. 2014-2016
 */
/*
(function () {
    'use strict';

    var thisModule = angular.module('pipSettings.Service', []);

    /**
     * @ngdoc service
     * @name pipSettings.Service:pipSettingsProvider
     *
     * @description
     * Service provides an interface to manage 'Settings' component behaviour.
     * It is available on config and run phases.
     
    thisModule.provider('pipSettings', function ($stateProvider) { // pipAuthStateProvider

        var defaultTab,
            tabs = [],
            titleText = 'SETTINGS_TITLE',
            titleLogo = null,
            isNavIcon = true;

        // Configure global parameters
        this.showTitleText = showTitleText;
        this.showTitleLogo = showTitleLogo;
        this.showNavIcon = showNavIcon;

        return {
            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:addTab
             *
             * @description
             * Register new tab in 'Settings' component. Before adding a tab this method validates passed object.
             *
             * @param {Object} tabObj  Configuration object for new tab.
             
            addTab: addTab,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:getTabs
             *
             * @description
             * Method returns collection of registered tabs.
             *
             * @returns {Array<Object>} Collection of tabs.
             
            getTabs: getTabs,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:setDefaultTab
             *
             * @description
             * Establish a tab which is available by default (after chose this component in menu).
             *
             * @param {string} name     Name of the default state for this component.
             
            setDefaultTab: setDefaultTab,

            /**
             * @ngdoc method
             * @methodOf pipSettings.Service:pipSettingsProvider
             * @name pipSettings.Service.pipSettingsProvider:getDefaultTab
             *
             * @description
             * Method returns an config object for tabs established as default (it will be opened when app transeferred to
             * abstract state 'settings').
             *
             * @returns {Array<Object>} Collection of tabs.
             
            getDefaultTab: getDefaultTab,
                    
            showTitleText: showTitleText,
            showTitleLogo: showTitleLogo,
            showNavIcon: showNavIcon,

            $get: function () {
                /**
                 * @ngdoc service
                 * @name pipSettings.Service:pipSettings
                 *
                 * @description
                 * Service provides an interface to manage 'Settings' component behaviour.
                 * It is available on config and run phases.
                 *
                return {
                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:getTabs
                     *
                     * @description
                     * Method returns collection of registered tabs.
                     *
                     * @returns {Array<Object>} Collection of tabs.
                     
                    getTabs: getTabs,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:addTab
                     *
                     * @description
                     * Register new tab in 'Settings' component. Before adding a tab this method validates passed object.
                     *
                     * @param {Object} tabObj  Configuration object for new tab.
                     *
                    addTab: addTab,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:getDefaultTab
                     *
                     * @description
                     * Method returns an config object for tabs established as default (it will be opened when app transeferred to
                     * abstract state 'settings').
                     *
                     * @returns {Array<Object>} Collection of tabs.
                     *
                    getDefaultTab: getDefaultTab,

                    /**
                     * @ngdoc method
                     * @methodOf pipSettings.Service:pipSettings
                     * @name pipSettings.Service.pipSettings:setDefaultTab
                     *
                     * @description
                     * Establish a tab which is available by default (after chose this component in menu).
                     *
                     * @param {string} name     Name of the default state for this component.
                     *
                    setDefaultTab: setDefaultTab,

                    showTitleText: showTitleText,
                    showTitleLogo: showTitleLogo,
                    showNavIcon: showNavIcon
                };
            }
        };

        /**
         * Appends component abstract state prefix to passed state
         *
        function getFullStateName(state) {
            return 'settings.' + state;
        }

        function getTabs() {
            return _.cloneDeep(tabs);
        }

        function getDefaultTab() {
            var defaultTab;

            defaultTab = _.find(tabs, function (p) {
                return p.state === defaultTab;
            });

            return _.cloneDeep(defaultTab);
        }

        function addTab(tabObj) {
            var existingTab;

            validateTab(tabObj);
            existingTab = _.find(tabs, function (p) {
                return p.state === getFullStateName(tabObj.state);
            });
            if (existingTab) {
                throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
            }

            tabs.push({
                state: getFullStateName(tabObj.state),
                title: tabObj.title,
                index: tabObj.index || 100000,
                access: tabObj.access,
                visible: tabObj.visible !== false,
                stateConfig: _.cloneDeep(tabObj.stateConfig)
            });

            $stateProvider.state(getFullStateName(tabObj.state), tabObj.stateConfig);

            // if we just added first state and no default state is specified
            if (typeof defaultTab === 'undefined' && tabs.length === 1) {
                setDefaultTab(tabObj.state);
            }
        }

        function setDefaultTab(name) {
            // TODO [apidhirnyi] extract expression inside 'if' into variable. It isn't readable now.
            if (!_.find(tabs, function (tab) {
                return tab.state === getFullStateName(name);
            })) {
                throw new Error('Tab with state name "' + name + '" is not registered');
            }

            defaultTab = getFullStateName(name);
            
            //$stateProvider.go(defaultTab);
            //pipAuthStateProvider.redirect('settings', getFullStateName(name));
        }

        /**
         * Validates passed tab config object
         * If passed tab is not valid it will throw an error
         *
        function validateTab(tabObj) {
            if (!tabObj || !_.isObject(tabObj)) {
                throw new Error('Invalid object');
            }

            if (tabObj.state === null || tabObj.state === '') {
                throw new Error('Tab should have valid Angular UI router state name');
            }

            if (tabObj.access && !_.isFunction(tabObj.access)) {
                throw new Error('"access" should be a function');
            }

            if (!tabObj.stateConfig || !_.isObject(tabObj.stateConfig)) {
                throw new Error('Invalid state configuration object');
            }
        }

        function showTitleText (newTitleText) {
            if (newTitleText) {
                titleText = newTitleText;
                titleLogo = null;
            }

            return titleText;
        }

        function showTitleLogo(newTitleLogo) {
            if (newTitleLogo) {
                titleLogo = newTitleLogo;
                titleText = null;
            }

            return titleLogo;
        }

        function showNavIcon(value) {
            if (value !== null && value !== undefined) {
                isNavIcon = !!value;
            }

            return isNavIcon;
        }

    });

})();
*/