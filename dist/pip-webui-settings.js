(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).settings = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
require("./service");
require("./page");
angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);
__export(require("./service"));
},{"./page":4,"./service":11}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsPageSelectedTab_1 = require("../service/SettingsPageSelectedTab");
var SettingsPageController = (function () {
    SettingsPageController.$inject = ['$state', '$rootScope', '$scope', '$injector', '$timeout', '$location', 'pipNavService', 'pipSettings', 'pipMedia'];
    function SettingsPageController($state, $rootScope, $scope, $injector, $timeout, $location, pipNavService, pipSettings, pipMedia) {
        var _this = this;
        this.$state = $state;
        this.$rootScope = $rootScope;
        this.$injector = $injector;
        this.$timeout = $timeout;
        this.$location = $location;
        this.pipNavService = pipNavService;
        this.pipSettings = pipSettings;
        this.pipMedia = pipMedia;
        this.translateInit();
        this.mediaSizeGtSm = this.pipMedia('gt-sm');
        this.initTabs();
        if (!this.pipMedia('gt-sm')) {
            this.details = $location.search().details == 'details' ? true : false;
        }
        else {
            this.details = false;
            this.$location.search('details', 'main');
        }
        this.cleanUpSelectFunc = $rootScope.$on('$stateChangeSuccess', function () {
            var state = _this.$state.current.name;
            _this.initSelect(state, false);
        });
        this.cleanUpFunc = $rootScope.$on('pipMainResized', function () {
            if (_this.mediaSizeGtSm !== _this.pipMedia('gt-sm')) {
                _this.mediaSizeGtSm = _this.pipMedia('gt-sm');
                if (_this.pipMedia('gt-sm')) {
                    _this.details = false;
                }
                _this.appHeader();
            }
        });
        this.appHeader();
        $scope.$on('$destroy', function () {
            if (angular.isFunction(_this.cleanUpFunc)) {
                _this.cleanUpFunc();
            }
            if (angular.isFunction(_this.cleanUpSelectFunc)) {
                _this.cleanUpSelectFunc();
            }
        });
    }
    SettingsPageController.prototype.initTabs = function () {
        var _this = this;
        this.tabs = _.filter(this.pipSettings.getTabs(), function (tab) {
            if (tab.visible === true && (tab.access ? tab.access(_this.$rootScope['$user'], tab) : true)) {
                return tab;
            }
        });
        this.tabs = _.sortBy(this.tabs, 'index');
        this.selected = new SettingsPageSelectedTab_1.SettingsPageSelectedTab();
        if (this.$state.current.name !== 'settings') {
            this.initSelect(this.$state.current.name);
        }
        else if (this.$state.current.name === 'settings' && this.pipSettings.getDefaultTab()) {
            this.initSelect(this.pipSettings.getDefaultTab().state);
        }
        else {
            this.$timeout(function () {
                if (_this.pipSettings.getDefaultTab()) {
                    _this.initSelect(_this.pipSettings.getDefaultTab().state);
                }
                if (!_this.pipSettings.getDefaultTab() && _this.tabs.length > 0) {
                    _this.initSelect(_this.tabs[0].state);
                }
            });
        }
    };
    SettingsPageController.prototype.translateInit = function () {
        this._pipTranslate = this.$injector.has('pipTranslate') ? this.$injector.get('pipTranslate') : null;
        if (this._pipTranslate && this._pipTranslate.setTranslations) {
            this._pipTranslate.setTranslations('en', {
                PIP_SETTINGS: 'Settings',
                PIP_SETTINGS_DETAILS: 'Settings details'
            });
            this._pipTranslate.setTranslations('ru', {
                PIP_SETTINGS: 'Настройки',
                PIP_SETTINGS_DETAILS: 'Подробно'
            });
        }
    };
    SettingsPageController.prototype.toMainFromDetails = function () {
        this.$location.search('details', 'main');
        this.details = false;
        this.appHeader();
    };
    SettingsPageController.prototype.appHeader = function () {
        var _this = this;
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';
        if (!this.pipMedia('gt-sm')) {
            var detailsTitle = this.selected && this.selected.tab ? this.selected.tab.title : 'PIP_SETTINGS_DETAILS';
            if (this.details) {
                this.pipNavService.icon.showBack(function () {
                    _this.toMainFromDetails();
                });
                this.pipNavService.breadcrumb.items = [
                    {
                        title: "PIP_SETTINGS", click: function () {
                            _this.toMainFromDetails();
                        }
                    },
                    {
                        title: detailsTitle, click: function () { }, subActions: []
                    }
                ];
            }
            else {
                this.pipNavService.icon.showMenu();
                this.pipNavService.breadcrumb.text = "PIP_SETTINGS";
            }
        }
        else {
            this.pipNavService.icon.showMenu();
            this.pipNavService.breadcrumb.text = "PIP_SETTINGS";
        }
        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
    };
    SettingsPageController.prototype.initSelect = function (state, updateState) {
        if (updateState === void 0) { updateState = true; }
        this.selected.tab = _.find(this.tabs, function (tab) {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
        if (updateState === true)
            this.$state.go(this.selected.tabId);
    };
    SettingsPageController.prototype.onNavigationSelect = function (state) {
        this.initSelect(state);
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
    };
    return SettingsPageController;
}());
angular
    .module('pipSettings.Page')
    .controller('pipSettingsPageController', SettingsPageController);
},{"../service/SettingsPageSelectedTab":7}],3:[function(require,module,exports){
{
    configureSettingsPageRoutes.$inject = ['$stateProvider'];
    function configureSettingsPageRoutes($stateProvider) {
        $stateProvider
            .state('settings', {
            url: '/settings?user_id&details',
            auth: true,
            controllerAs: 'vm',
            controller: 'pipSettingsPageController',
            templateUrl: 'page/SettingsPage.html'
        });
    }
    angular.module('pipSettings.Page')
        .config(configureSettingsPageRoutes);
}
},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Page', [
    'ui.router',
    'pipSettings.Service',
    'pipNav',
    'pipSelected',
    'pipTranslate',
    'pipSettings.Templates'
]);
require("./SettingsPage");
require("./SettingsPageRoutes");
},{"./SettingsPage":2,"./SettingsPageRoutes":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsConfig = (function () {
    function SettingsConfig() {
        this.tabs = [];
        this.titleText = 'SETTINGS_TITLE';
        this.titleLogo = null;
        this.isNavIcon = true;
    }
    return SettingsConfig;
}());
exports.SettingsConfig = SettingsConfig;
},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsPageSelectedTab = (function () {
    function SettingsPageSelectedTab() {
        this.tabIndex = 0;
    }
    return SettingsPageSelectedTab;
}());
exports.SettingsPageSelectedTab = SettingsPageSelectedTab;
},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsConfig_1 = require("./SettingsConfig");
var SettingsService = (function () {
    SettingsService.$inject = ['config'];
    function SettingsService(config) {
        "ngInject";
        this._config = config;
    }
    SettingsService.prototype.getFullStateName = function (state) {
        return 'settings.' + state;
    };
    SettingsService.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'settings.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    SettingsService.prototype.getDefaultTab = function () {
        var _this = this;
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (tab) {
            return tab.state === _this._config.defaultTab;
        });
        return _.cloneDeep(defaultTab);
    };
    SettingsService.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    SettingsService.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    SettingsService.prototype.showNavIcon = function (value) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    SettingsService.prototype.getTabs = function () {
        return _.cloneDeep(this._config.tabs);
    };
    return SettingsService;
}());
var SettingsProvider = (function () {
    SettingsProvider.$inject = ['$stateProvider'];
    function SettingsProvider($stateProvider) {
        this.$stateProvider = $stateProvider;
        this._config = new SettingsConfig_1.SettingsConfig();
    }
    SettingsProvider.prototype.getFullStateName = function (state) {
        return 'settings.' + state;
    };
    SettingsProvider.prototype.getDefaultTab = function () {
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (tab) {
            return tab.state === defaultTab.state;
        });
        return _.cloneDeep(defaultTab);
    };
    SettingsProvider.prototype.addTab = function (tabObj) {
        var existingTab;
        this.validateTab(tabObj);
        existingTab = _.find(this._config.tabs, function (tab) {
            return tab.state === 'settings.' + tabObj.state;
        });
        if (existingTab) {
            throw new Error('Tab with state name "' + tabObj.state + '" is already registered');
        }
        this._config.tabs.push({
            state: this.getFullStateName(tabObj.state),
            title: tabObj.title,
            icon: tabObj.icon,
            iconClass: tabObj.iconClass,
            index: tabObj.index || 100000,
            access: tabObj.access,
            visible: tabObj.visible !== false,
            stateConfig: _.cloneDeep(tabObj.stateConfig)
        });
        this.$stateProvider.state(this.getFullStateName(tabObj.state), tabObj.stateConfig);
        if (typeof this._config.defaultTab === 'undefined' && this._config.tabs.length === 1) {
            this.setDefaultTab(tabObj.state);
        }
    };
    SettingsProvider.prototype.setDefaultTab = function (name) {
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'settings.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }
        this._config.defaultTab = this.getFullStateName(name);
    };
    SettingsProvider.prototype.validateTab = function (tabObj) {
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
    };
    SettingsProvider.prototype.showTitleText = function (newTitleText) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }
        return this._config.titleText;
    };
    SettingsProvider.prototype.showTitleLogo = function (newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }
        return this._config.titleLogo;
    };
    SettingsProvider.prototype.showNavIcon = function (value) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }
        return this._config.isNavIcon;
    };
    SettingsProvider.prototype.$get = function () {
        "ngInject";
        if (_.isNull(this._service) || _.isUndefined(this._service)) {
            this._service = new SettingsService(this._config);
        }
        return this._service;
    };
    return SettingsProvider;
}());
angular
    .module('pipSettings.Service')
    .provider('pipSettings', SettingsProvider);
},{"./SettingsConfig":6}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsStateConfig = (function () {
    function SettingsStateConfig() {
        this.auth = false;
    }
    return SettingsStateConfig;
}());
exports.SettingsStateConfig = SettingsStateConfig;
},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsTab = (function () {
    function SettingsTab() {
    }
    return SettingsTab;
}());
exports.SettingsTab = SettingsTab;
},{}],11:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Service', []);
require("./SettingsConfig");
require("./SettingsPageSelectedTab");
require("./SettingsStateConfig");
require("./SettingsTab");
require("./SettingsService");
__export(require("./SettingsConfig"));
__export(require("./SettingsPageSelectedTab"));
__export(require("./SettingsStateConfig"));
__export(require("./SettingsTab"));
},{"./SettingsConfig":6,"./SettingsPageSelectedTab":7,"./SettingsService":8,"./SettingsStateConfig":9,"./SettingsTab":10}],12:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('page/SettingsPage.html',
    '\n' +
    '<div class="pip-main-menu pip-settings" ng-class="{\'pip-single-content\': vm.details}">\n' +
    '	<div class="pip-menu">\n' +
    '        <div class="pip-list-container pip-scroll divider-top">\n' +
    '\n' +
    '			<md-list class="pip-ref-list tp0 pip-settings-list"                 \n' +
    '                pip-selected="vm.selected.tabIndex"\n' +
    '                pip-selected-watch="vm.selected.navId"\n' +
    '                pip-select="vm.onNavigationSelect($event.id)">\n' +
    '\n' +
    '				<md-list-item  class="pip-ref-list-item pointer divider-bottom pip-selectable" \n' +
    '                        ng-repeat="tab in vm.tabs track by tab.state" \n' +
    '                        pip-id="{{:: tab.state }}" md-ink-ripple>\n' +
    '\n' +
    '					<div ng-click="vm.onNavigationSelect(tab.state)" class="layout-row layout-align-start-center flex">\n' +
    '						<div class="pip-settings-icon layout-row layout-align-start-center {{ tab.iconClass ? tab.iconClass : \'pip-settings-icon-color\'}}" \n' +
    '                            ng-if="tab.icon">\n' +
    '							<md-icon class="" md-svg-icon="{{ tab.icon }}"></md-icon>\n' +
    '						</div>\n' +
    '						<div class="pip-content {{ tab.icon ? \'\' : \'pip-settings-without-icon\' }}">\n' +
    '							<p class="pip-title text-overflow flex">\n' +
    '								{{ ::tab.title | translate }}\n' +
    '							</p>\n' +
    '						</div>\n' +
    '                        <div class="pip-ref-list-item-end-icon">\n' +
    '                            <md-icon class="" md-svg-icon="icons:chevron-right"></md-icon>\n' +
    '                        </div>\n' +
    '					</div>\n' +
    '				</md-list-item>\n' +
    '			</md-list>\n' +
    '\n' +
    '		</div>\n' +
    '	</div>\n' +
    '    <div class="pip-content-container">\n' +
    '        <pip-document>\n' +
    '            <div class="pip-body tp24-flex layout-column flex" ui-view></div>\n' +
    '        </pip-document>\n' +
    '	</div>\n' +
    '</div>        \n' +
    '<!--    \n' +
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '<pip-document width="800" min-height="400"\n' +
    '              class="pip-settings">\n' +
    '\n' +
    '    <div class="pip-menu-container"\n' +
    '         ng-hide="vm.manager === false || !vm.tabs || vm.tabs.length < 1">\n' +
    '        <md-list class="pip-menu pip-simple-list"\n' +
    '                 pip-selected="vm.selected.tabIndex"\n' +
    '                 pip-selected-watch="vm.selected.navId"\n' +
    '                 pip-select="vm.onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable flex"\n' +
    '                          ng-repeat="tab in vm.tabs track by tab.state" ng-if="vm.$party.id == vm.$user.id ||\n' +
    '                          tab.state == \'settings.basic_info\'|| tab.state ==\'settings.contact_info\'\n' +
    '                          || tab.state ==\'settings.blacklist\'"\n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{:: tab.state }}">\n' +
    '                <p>{{::tab.title | translate}}</p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container">\n' +
    '            <pip-dropdown pip-actions="vm.tabs"\n' +
    '                          pip-dropdown-select="vm.onDropdownSelect"\n' +
    '                          pip-active-index="vm.selected.tabIndex"></pip-dropdown>\n' +
    '\n' +
    '            <div class="pip-body tp24-flex layout-column" ui-view></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="layout-column layout-align-center-center flex"\n' +
    '         ng-show="vm.manager === false || !vm.tabs || vm.tabs.length < 1">\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>-->');
}]);
})();



},{}]},{},[12,1,4,2,3,11,5,6,7,8,9,10])(12)
});

//# sourceMappingURL=pip-webui-settings.js.map
