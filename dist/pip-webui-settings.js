(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).settings = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("./settings_service/index");
require("./settings_page/index");
angular.module('pipSettings', [
    'pipSettings.Service',
    'pipSettings.Page'
]);
},{"./settings_page/index":5,"./settings_service/index":8}],2:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipSettings', [
        'pipSettings.Service',
        'pipSettings.Page'
    ]);
})();
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsPageSelectedTab = (function () {
    function SettingsPageSelectedTab() {
        this.tabIndex = 0;
    }
    return SettingsPageSelectedTab;
}());
exports.SettingsPageSelectedTab = SettingsPageSelectedTab;
var SettingsPageController = (function () {
    SettingsPageController.$inject = ['$state', 'pipNavService', 'pipSettings', '$rootScope', '$timeout'];
    function SettingsPageController($state, pipNavService, pipSettings, $rootScope, $timeout) {
        var _this = this;
        this.$state = $state;
        this.tabs = _.filter(pipSettings.getTabs(), function (tab) {
            if (tab.visible === true && (tab.access ? tab.access($rootScope['$user'], tab) : true)) {
                return tab;
            }
        });
        this.tabs = _.sortBy(this.tabs, 'index');
        this.selected = new SettingsPageSelectedTab();
        if (this.$state.current.name !== 'settings') {
            this.initSelect(this.$state.current.name);
        }
        else if (this.$state.current.name === 'settings' && pipSettings.getDefaultTab()) {
            this.initSelect(pipSettings.getDefaultTab().state);
        }
        else {
            $timeout(function () {
                if (pipSettings.getDefaultTab()) {
                    _this.initSelect(pipSettings.getDefaultTab().state);
                }
                if (!pipSettings.getDefaultTab() && _this.tabs.length > 0) {
                    _this.initSelect(_this.tabs[0].state);
                }
            });
        }
        pipNavService.icon.showMenu();
        pipNavService.breadcrumb.text = "Settings";
        pipNavService.actions.hide();
        pipNavService.appbar.removeShadow();
        this.onDropdownSelect = function (state) {
            _this.onNavigationSelect(state.state);
        };
    }
    SettingsPageController.prototype.initSelect = function (state) {
        this.selected.tab = _.find(this.tabs, function (tab) {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
    };
    SettingsPageController.prototype.onNavigationSelect = function (state) {
        this.initSelect(state);
        if (this.selected.tab) {
            this.$state.go(state);
        }
    };
    return SettingsPageController;
}());
(function () {
    angular.module('pipSettings.Page')
        .controller('pipSettingsPageController', SettingsPageController);
})();
},{}],4:[function(require,module,exports){
'use strict';
configureSettingsPageRoutes.$inject = ['$stateProvider'];
function configureSettingsPageRoutes($stateProvider) {
    $stateProvider
        .state('settings', {
        url: '/settings?party_id',
        auth: true,
        controllerAs: 'vm',
        controller: 'pipSettingsPageController',
        templateUrl: 'settings_page/SettingsPage.html'
    });
}
angular.module('pipSettings.Page')
    .config(configureSettingsPageRoutes);
},{}],5:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Page', [
    'ui.router',
    'pipSettings.Service',
    'pipNav',
    'pipSelected',
    'pipTranslate',
    'pipSettings.Templates'
]);
require("./SettingsPageController");
require("./SettingsPageRoutes");
},{"./SettingsPageController":3,"./SettingsPageRoutes":4}],6:[function(require,module,exports){

},{}],7:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var SettingsTab = (function () {
    function SettingsTab() {
    }
    return SettingsTab;
}());
exports.SettingsTab = SettingsTab;
var SettingsStateConfig = (function () {
    function SettingsStateConfig() {
        this.auth = false;
    }
    return SettingsStateConfig;
}());
exports.SettingsStateConfig = SettingsStateConfig;
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
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (tab) {
            return tab.state === defaultTab.state;
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
        this._config = new SettingsConfig();
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
        if (_.isNull(this._service) || _.isFunction(this._service)) {
            this._service = new SettingsService(this._config);
        }
        return this._service;
    };
    return SettingsProvider;
}());
angular
    .module('pipSettings.Service')
    .provider('pipSettings', SettingsProvider);
},{}],8:[function(require,module,exports){
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
angular.module('pipSettings.Service', []);
require("./SettingsService");
},{"./SettingsService":7}],9:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipUserSettings', [
        'ngMaterial', 'pipData',
        'pipSettings.Service',
        'pipSettings.Page',
        'pipUserSettings.Strings',
        'pipUserSettings.Sessions',
        'pipUserSettings.BasicInfo',
        'pipSettings.Templates'
    ]);
})();
},{}],10:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.BasicInfo', ['pipUserSettings.ChangePassword', 'pipUserSettings.VerifyEmail',
        'pipSettings.Service', 'pipSettings.Page',]);
    thisModule.config(['pipSettingsProvider', function (pipSettingsProvider) {
        pipSettingsProvider.addTab({
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
        pipSettingsProvider.setDefaultTab('basic_info');
    }]);
    thisModule.controller('pipUserSettingsBasicInfoController', ['$scope', '$rootScope', '$mdDialog', '$state', '$window', '$timeout', '$mdTheming', 'pipTranslate', 'pipTransaction', 'pipTheme', 'pipToasts', 'pipDataUser', 'pipDataParty', 'pipFormErrors', function ($scope, $rootScope, $mdDialog, $state, $window, $timeout, $mdTheming, pipTranslate, pipTransaction, pipTheme, pipToasts, pipDataUser, pipDataParty, pipFormErrors) {
        try {
            $scope.originalParty = angular.toJson($rootScope.$party);
        }
        catch (err) {
            throw err;
        }
        $scope.nameCopy = $rootScope.$party.name;
        $timeout(function () {
            $scope.loc_pos = $rootScope.$party.loc_pos;
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
        function onPictureChanged() {
            $scope.picture.save(function () {
                $rootScope.$broadcast('pipPartyAvatarUpdated');
            }, function (error) {
                return new Error(error);
            });
        }
        function onPictureCreated($event) {
            $scope.picture = $event.sender;
            $scope.picture.save(function () {
                $rootScope.$broadcast('pipPartyAvatarUpdated');
            }, function (error) {
                return new Error(error);
            });
        }
        function saveChanges() {
            if ($scope.form) {
                $scope.form.$setSubmitted();
            }
            if ($rootScope.$party) {
                if ($rootScope.$party.type === 'person' && $scope.form.$invalid) {
                    return;
                }
                $rootScope.$party.loc_pos = $scope.loc_pos;
                try {
                    var party = angular.toJson($rootScope.$party);
                }
                catch (err) {
                    throw err;
                }
                if (party !== $scope.originalParty) {
                    var tid = $scope.transaction.begin('UPDATING');
                    pipDataParty.updateParty($rootScope.$party, function (data) {
                        if ($scope.transaction.aborted(tid)) {
                            return;
                        }
                        $scope.transaction.end();
                        $scope.originalParty = party;
                        $scope.nameCopy = data.name;
                    }, function (error) {
                        $scope.transaction.end(error);
                        $scope.message = String() + 'ERROR_' + error.status || error.data.status_code;
                        $rootScope.$party = angular.fromJson($scope.originalParty);
                    });
                }
            }
        }
        function updateUser() {
            var tid = $scope.transaction.begin('RequestEmailVerification');
            if ($rootScope.$user.id === $rootScope.$party.id) {
                pipDataUser.updateUser({
                    item: $rootScope.$user
                }, function (data) {
                    if ($scope.transaction.aborted(tid)) {
                        return;
                    }
                    $scope.transaction.end();
                    pipTranslate.use(data.language);
                    $rootScope.$user.language = data.language;
                    $rootScope.$user.theme = data.theme;
                    if ($rootScope.$user.theme) {
                        pipTheme.setCurrentTheme($rootScope.$user.theme, true);
                    }
                }, function (error) {
                    var message;
                    $scope.transaction.end(error);
                    message = String() + 'ERROR_' + error.status || error.data.status_code;
                    pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                });
            }
        }
        function onChangePassword(event) {
            var message;
            $mdDialog.show({
                templateUrl: 'user_settings/user_settings_change_password.html',
                controller: 'pipUserSettingsChangePasswordController',
                targetEvent: event,
                locals: { email: $rootScope.$party.email }
            }).then(function (answer) {
                if (answer) {
                    message = String() + 'RESET_PWD_SUCCESS_TEXT';
                    pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                }
            });
        }
        function onVerifyEmail(event) {
            var message;
            $mdDialog.show({
                templateUrl: 'user_settings/user_settings_verify_email.html',
                controller: 'pipUserSettingsVerifyEmailController',
                targetEvent: event,
                locals: { email: $rootScope.$party.email }
            }).then(function (answer) {
                $scope.user.email_ver = answer;
                if (answer) {
                    message = String() + 'VERIFY_EMAIL_SUCCESS_TEXT';
                    pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                }
            });
        }
    }]);
})();
},{}],11:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.ChangePassword', []);
    thisModule.controller('pipUserSettingsChangePasswordController', ['$scope', '$rootScope', '$mdDialog', 'email', 'pipDataUser', 'pipTransaction', 'pipFormErrors', function ($scope, $rootScope, $mdDialog, email, pipDataUser, pipTransaction, pipFormErrors) {
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
                    }
                    else {
                        $scope.showRepeatHint = true;
                    }
                }
                else {
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
            pipDataUser.changePassword($scope.changePasData, function () {
                $scope.transaction.end();
                $mdDialog.hide(true);
            }, function (error) {
                $scope.transaction.end(error);
                pipFormErrors.setFormError($scope.form, error, {
                    1107: 'oldPassword',
                    1105: 'newPassword'
                });
            });
        }
    }]);
})();
},{}],12:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.Sessions', [
        'pipSettings.Service', 'pipSettings.Page',
    ]);
    thisModule.config(['pipSettingsProvider', 'pipDataSessionProvider', function (pipSettingsProvider, pipDataSessionProvider) {
        pipSettingsProvider.addTab({
            state: 'sessions',
            index: 3,
            title: 'SETTINGS_ACTIVE_SESSIONS_TITLE',
            stateConfig: {
                url: '/sessions',
                controller: 'pipUserSettingsSessionsController',
                templateUrl: 'user_settings/user_settings_sessions.html',
                auth: true,
                resolve: {
                    sessions: pipDataSessionProvider.readSessionsResolver,
                    sessionId: pipDataSessionProvider.readSessionIdResolver
                }
            }
        });
    }]);
    thisModule.controller('pipUserSettingsSessionsController', ['$scope', 'pipTransaction', 'pipDataSession', 'sessions', 'sessionId', function ($scope, pipTransaction, pipDataSession, sessions, sessionId) {
        $scope.sessionId = sessionId;
        $scope.transaction = pipTransaction('settings.sessions', $scope);
        $scope.sessions = sessions;
        $scope.onRemoveAll = onRemoveAll;
        $scope.onRemove = onRemove;
        function onRemoveAll() {
            var tid = $scope.transaction.begin('REMOVING');
            async.eachSeries($scope.sessions, function (session, callback) {
                if (session.id == $scope.sessionId) {
                    callback();
                }
                else {
                    pipDataSession.removeSession({
                        session: session
                    }, function () {
                        $scope.sessions = _.without($scope.sessions, session);
                        callback();
                    }, function (error) {
                        callback;
                    });
                }
            }, function (err) {
                if (err) {
                    $scope.transaction.end(err);
                }
                if ($scope.transaction.aborted(tid)) {
                    return;
                }
                $scope.transaction.end();
            });
        }
        function onRemove(session, callback) {
            if (session.id === $scope.sessionId) {
                return;
            }
            var tid = $scope.transaction.begin('REMOVING');
            pipDataSession.removeSession({
                session: session
            }, function () {
                if ($scope.transaction.aborted(tid)) {
                    return;
                }
                $scope.transaction.end();
                $scope.sessions = _.without($scope.sessions, session);
                if (callback) {
                    callback();
                }
            }, function (error) {
                $scope.transaction.end(error);
                $scope.message = 'ERROR_' + error.status || error.data.status_code;
            });
        }
    }]);
})();
},{}],13:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.Strings', ['pipTranslate']);
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
        pipTranslateProvider.translations('en', {
            'SETTINGS_TITLE': 'Settings',
            'SETTINGS_BASIC_INFO_TITLE': 'Basic info',
            'SETTINGS_ACTIVE_SESSIONS_TITLE': 'Active sessions',
            'SETTINGS_BASIC_INFO_FULL_NAME': 'Full name',
            'SETTINGS_BASIC_INFO_VERIFY_HINT': 'Please, verify your email address.',
            'SETTINGS_BASIC_INFO_VERIFY_CODE': 'Verify email address',
            'SETTINGS_BASIC_INFO_DATE_CHANGE_PASSWORD': 'Your password was changed on ',
            'SETTINGS_BASIC_INFO_CHANGE_PASSWORD': 'Change your password',
            'SETTINGS_BASIC_INFO_NAME_HINT': 'Please, use your real name to let other people know who you are.',
            'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME': 'Few words about yourself',
            'SETTINGS_BASIC_INFO_GENDER': 'Gender',
            'SETTINGS_BASIC_INFO_BIRTHDAY': 'Birthday',
            'SETTINGS_BASIC_INFO_LOCATION': 'Current location',
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL': 'Primary email',
            'SETTINGS_BASIC_INFO_FROM': 'User since ',
            'SETTINGS_BASIC_INFO_USER_ID': 'User ID',
            'SETTINGS_CHANGE_PASSWORD_TITLE': 'Change password',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD': 'New password',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD': 'Repeat password',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD': 'Current password',
            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE': ' If you notice any unfamiliar devices or locations, click' +
                '"Close Session" to end the session.',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION': 'Close session',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS': 'Close active sessions',
            'SETTINGS_ACTIVE_SESSION_OS': 'OS: ',
            'SETTINGS_ACTIVE_SESSION_IP': 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE': 'active',
            'SETTINGS_BLACKLIST_TITLE': 'Blacklist',
            'SETTINGS_BLACKLIST_SUBTITLE': 'Parties from blacklist will not be able to send you invitations and ' +
                'private messages.',
            'SETTINGS_BLACKLIST_UNBLOCK': 'Unblock',
            'SETTINGS_BLACKLIST_EMPTY': 'You have no blocked parties',
            'SETTINGS_CONTACT_INFO_TITLE': 'Contact info',
            'SETTINGS_CONTACT_INFO_EMAIL': 'Email',
            'SETTINGS_CONTACT_INFO_ADD_EMAIL': 'Add email',
            'SETTINGS_CONTACT_INFO_ADD_PHONE': 'Add phone',
            'SETTINGS_CONTACT_INFO_ADD_ADDRESS': 'Add address',
            'SETTINGS_CONTACT_INFO_ADD_ACCOUNT': 'Add account',
            'SETTINGS_CONTACT_INFO_ADD_URL': 'Add URL',
            'SETTINGS_CONTACT_INFO_ADDRESS': 'Address',
            'SETTINGS_CONTACT_INFO_PHONE': 'Phone',
            'SETTINGS_CONTACT_INFO_ACCOUNT_NAME': 'Account name',
            'SETTINGS_CONTACT_INFO_URL': 'URL',
            'THEME': 'Theme',
            'HINT_PASSWORD': 'Minimum 6 characters',
            'HINT_REPEAT_PASSWORD': 'Repeat password',
            'ERROR_WRONG_PASSWORD': 'Wrong password',
            'ERROR_IDENTICAL_PASSWORDS': 'Old and new passwords are identical',
            'REPEAT_PASSWORD_INVALID': 'Password does not match',
            'ERROR_EMAIL_INVALID': 'Please, enter a valid email'
        });
        pipTranslateProvider.translations('ru', {
            'SETTINGS_TITLE': 'Настройки',
            'SETTINGS_BASIC_INFO_TITLE': 'Основные данные',
            'SETTINGS_ACTIVE_SESSIONS_TITLE': 'Активные сессии',
            'SETTINGS_BASIC_INFO_FULL_NAME': 'Полное имя',
            'SETTINGS_BASIC_INFO_NAME_HINT': 'Пожалуйста, используйте реальное имя, чтоб люди могли вас узнать',
            'SETTINGS_BASIC_INFO_VERIFY_HINT': 'Пожалуйста, подтвердите адрес своей электронной почты',
            'SETTINGS_BASIC_INFO_VERIFY_CODE': 'Подтвердите адрес эл.почты',
            'SETTINGS_BASIC_INFO_DATE_CHANGE_PASSWORD': 'Ваш пароль был изменен ',
            'SETTINGS_BASIC_INFO_CHANGE_PASSWORD': 'Поменять пароль',
            'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME': 'Несколько слов о себе',
            'SETTINGS_BASIC_INFO_GENDER': 'Пол',
            'SETTINGS_BASIC_INFO_BIRTHDAY': 'Дата рождения',
            'SETTINGS_BASIC_INFO_LOCATION': 'Текущее местонахождение',
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL': 'Основной адрес эл. почты',
            'SETTINGS_BASIC_INFO_FROM': 'Начиная с',
            'SETTINGS_BASIC_INFO_USER_ID': 'Личный код',
            'SETTINGS_CHANGE_PASSWORD_TITLE': 'Изменить пароль',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD': 'Новый пароль',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD': 'Повтор',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD': 'Текущий пароль',
            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE': 'Если вы заметили какие-либо незнакомые устройства или ' +
                'месторасположение, нажмите кнопку "Закончить сеанс", чтобы завершить сеанс.',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION': 'Закрыть сессию',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS': 'Закрыть активные сессии',
            'SETTINGS_ACTIVE_SESSION_OS': 'ОС: ',
            'SETTINGS_ACTIVE_SESSION_IP': 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE': 'Активно',
            'SETTINGS_BLACKLIST_TITLE': 'Блокировки',
            'SETTINGS_BLACKLIST_SUBTITLE': 'Участники из черного списка не смогут' +
                ' посылать вам приглашения и личные сообщения.',
            'SETTINGS_BLACKLIST_UNBLOCK': 'Разблокировать',
            'SETTINGS_BLACKLIST_EMPTY': 'У вас нет заблокированных участников',
            'SETTINGS_CONTACT_INFO_TITLE': 'Контакты',
            'SETTINGS_CONTACT_INFO_EMAIL': 'Адрес электронной почты',
            'SETTINGS_CONTACT_INFO_ADD_EMAIL': 'Добавить адрес эл. почты',
            'SETTINGS_CONTACT_INFO_ADD_PHONE': 'Добавить телефон',
            'SETTINGS_CONTACT_INFO_ADD_ADDRESS': 'Добавить адрес',
            'SETTINGS_CONTACT_INFO_ADD_ACCOUNT': 'Добавить аккаунт',
            'SETTINGS_CONTACT_INFO_ADD_URL': 'Добавить веб-сайт',
            'SETTINGS_CONTACT_INFO_ADDRESS': 'Адрес',
            'SETTINGS_CONTACT_INFO_PHONE': 'Телефон',
            'SETTINGS_CONTACT_INFO_ACCOUNT_NAME': 'Учетка в мессенджере',
            'SETTINGS_CONTACT_INFO_URL': 'Веб сайт',
            'THEME': 'Тема',
            'HINT_PASSWORD': 'Минимум 6 знаков',
            'HINT_REPEAT_PASSWORD': 'Повторите пароль',
            'ERROR_WRONG_PASSWORD': 'Неправильный пароль',
            'ERROR_IDENTICAL_PASSWORDS': 'Старый и новый пароли идентичны',
            'REPEAT_PASSWORD_INVALID': 'Пароль не совпадает',
            'ERROR_EMAIL_INVALID': 'Пожалуйста, введите правильный почт.адрес'
        });
    }]);
})();
},{}],14:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.VerifyEmail', []);
    thisModule.controller('pipUserSettingsVerifyEmailController', ['$scope', '$rootScope', '$mdDialog', 'pipTransaction', 'pipFormErrors', 'pipDataUser', 'email', function ($scope, $rootScope, $mdDialog, pipTransaction, pipFormErrors, pipDataUser, email) {
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
        function onAbort() {
            $scope.transaction.abort();
        }
        function onCancel() {
            $mdDialog.cancel();
        }
        function onRequestVerificationClick() {
            var tid = $scope.transaction.begin('RequestEmailVerification');
            pipDataUser.requestEmailVerification({}, function (result) {
                if ($scope.transaction.aborted(tid)) {
                    return;
                }
                $scope.transaction.end();
            }, function (error) {
                $scope.transaction.end(error);
            });
        }
        function onVerify() {
            $scope.form.$setSubmitted();
            if ($scope.form.$invalid) {
                return;
            }
            var tid = $scope.transaction.begin('Verifying');
            pipDataUser.verifyEmail({
                email: $scope.data.email,
                code: $scope.data.code
            }, function (verifyData) {
                if ($scope.transaction.aborted(tid)) {
                    return;
                }
                $scope.transaction.end();
                $mdDialog.hide(true);
            }, function (error) {
                $scope.transaction.end(error);
                pipFormErrors.setFormError($scope.form, error, {
                    1106: 'email',
                    1103: 'code'
                });
            });
        }
    }]);
})();
},{}],15:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings_page/SettingsPage.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar><pip-document width="800" min-height="400" class="pip-settings"><div class="pip-menu-container" ng-hide="vm.manager === false || !vm.tabs || vm.tabs.length < 1"><md-list class="pip-menu pip-simple-list" pip-selected="vm.selected.tabIndex" pip-selected-watch="vm.selected.navId" pip-select="vm.onNavigationSelect($event.id)"><md-list-item class="pip-simple-list-item pip-selectable flex" ng-repeat="tab in vm.tabs track by tab.state" ng-if="vm.$party.id == vm.$user.id || tab.state == \'settings.basic_info\'|| tab.state ==\'settings.contact_info\' || tab.state ==\'settings.blacklist\'" md-ink-ripple="" pip-id="{{:: tab.state }}"><p>{{::tab.title | translate}}</p></md-list-item></md-list><div class="pip-content-container"><pip-dropdown pip-actions="vm.tabs" pip-dropdown-select="vm.onDropdownSelect" pip-active-index="vm.selected.tabIndex"></pip-dropdown><div class="pip-body tp24-flex layout-column" ui-view=""></div></div></div><div class="layout-column layout-align-center-center flex" ng-show="vm.manager === false || !vm.tabs || vm.tabs.length < 1">{{::\'ERROR_400\' | translate}}</div></pip-document>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_basic_info.html',
    '<form name="form" class="w-stretch" novalidate=""><md-progress-linear class="pip-progress-top" ng-show="transaction.busy()" md-mode="indeterminate"></md-progress-linear><div class="layout-row bm12"><div class="md-tile-left"><pip-avatar-edit pip-party-id="$party.id" pip-created="onPictureCreated($event)" pip-changed="onPictureChanged($control, $event)"></pip-avatar-edit></div><div class="md-tile-content tp0 layout-align-center"><h3 class="tm16 bm8 text-one-line">{{ nameCopy }}</h3><p class="text-primary text-overflow m0">{{::\'SETTINGS_BASIC_INFO_FROM\' | translate}} {{$user.signup | formatLongDate }}</p></div></div><md-input-container class="md-block"><label>{{::\'SETTINGS_BASIC_INFO_FULL_NAME\' | translate}}</label> <input name="fullName" step="any" type="text" tabindex="0" required="" ng-model="$party.name" ng-disabled="transaction.busy()" ng-change="onChangeBasicInfo()"><div class="hint" ng-if="errorsWithHint(form, form.fullName).hint">{{::\'ERROR_FULLNAME_INVALID\' | translate}}</div></md-input-container><md-input-container class="md-block bm0"><label>{{::\'SETTINGS_BASIC_INFO_PRIMARY_EMAIL\' | translate}}</label> <input name="email" type="email" required="" ng-model="$party.email" ng-change="onChangeBasicInfo()" pip-email-unique="{{$party.email}}"><div class="hint" ng-if="errorsWithHint(form, form.email).hint && !$user.email_ver">{{::\'SETTINGS_BASIC_INFO_VERIFY_HINT\' | translate}}</div><div ng-messages="errorsWithHint(form.email)" ng-hide="$party.type ==\'team\'"><div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div><div ng-message="emailUnique">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div></div></md-input-container><md-button class="md-raised bm16 tm8 rm8" ng-click="onVerifyEmail($event)" ng-hide="$user.email_ver || $party.type ==\'team\'">{{::\'SETTINGS_BASIC_INFO_VERIFY_CODE\' | translate}}</md-button><md-button ng-click="onChangePassword($event)" class="md-raised bm16 tm8" ng-hide="$party.type ==\'team\'">{{::\'SETTINGS_BASIC_INFO_CHANGE_PASSWORD\' | translate}}</md-button><md-input-container class="md-block flex"><label>{{::\'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME\' | translate }}</label> <textarea ng-model="$party.about" columns="1" ng-change="onChangeBasicInfo()"></textarea></md-input-container><md-input-container class="md-block" ng-hide="$party.type ==\'team\'"><label>{{::\'GENDER\' | translate}}</label><md-select ng-model="$party.gender" ng-change="onChangeBasicInfo()" placeholder="{{\'GENDER\' | translate}}"><md-option ng-value="gender.id" ng-repeat="gender in genders">{{gender.name}}</md-option></md-select></md-input-container><div ng-hide="$party.type ==\'team\'"><p class="text-caption text-grey tm0 bm0">{{::\'SETTINGS_BASIC_INFO_BIRTHDAY\' | translate}}</p><pip-date ng-model="$party.birthday" ng-change="onChangeBasicInfo()" pip-time-mode="past time-mode=" past"=""></pip-date></div><md-input-container class="md-block" ng-hide="$party.type ==\'team\'"><label>{{::\'LANGUAGE\' | translate}}</label><md-select placeholder="{{\'LANGUAGE\' | translate}}" ng-model="$user.language" ng-change="onChangeUser()"><md-option ng-value="language.id" ng-repeat="language in languages">{{language.name}}</md-option></md-select></md-input-container><md-input-container class="md-block" ng-if="$party.type !=\'team\'"><label>{{::\'THEME\' | translate}}</label><md-select class="w-stretch theme-text-primary" ng-model="$user.theme" ng-change="onChangeUser()" ng-disabled="transaction.busy()"><md-option ng-value="theme" ng-repeat="theme in themes" ng-selected="$theme == theme ? true : false">{{ theme | translate }}</md-option></md-select></md-input-container><pip-location-edit class="map-edit bm24-flex" ng-hide="$party.type ==\'team\'" pip-changed="onChangeBasicInfo()" pip-location-name="$party.loc_name" pip-location-pos="loc_pos"></pip-location-edit></form>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_change_password.html',
    '<md-dialog class="pip-dialog layout-column" width="440"><form name="form" ng-submit="onApply()"><div class="pip-header"><h3 class="m0">{{::\'SETTINGS_CHANGE_PASSWORD_TITLE\' | translate : module}}</h3></div><div class="pip-body"><div class="pip-content"><div class="text-error bm8" ng-messages="form.$serverError"><div ng-message="ERROR_UNKNOWN">{{ form.$serverError.ERROR_UNKNOWN | translate }}</div></div><md-input-container class="md-block"><label>{{::\'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD\' | translate }}</label> <input name="oldPassword" type="password" ng-model="changePasData.old_password" ng-required="change_password.$submitted" pip-clear-errors=""><div ng-messages="errorsWithHint(form, form.oldPassword)"><div ng-message="required">{{::\'ERROR_REQUIRED\' | translate }}</div><div ng-message="ERROR_1107">{{::\'ERROR_WRONG_PASSWORD\' | translate }}</div></div></md-input-container><md-input-container class="md-block"><label>{{\'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD\' | translate }}</label> <input name="newPassword" type="password" ng-model="changePasData.new_password" ng-change="onCheckRepeatPassword()" ng-required="change_password.$submitted" ng-minlength="6" pip-clear-errors=""><div class="hint" ng-if="errorsWithHint(form, form.newPassword).hint">{{ \'HINT_PASSWORD\' | translate }}</div><div ng-messages="errorsWithHint(form, form.newPassword)"><div ng-message="required">{{::\'ERROR_REQUIRED\' | translate}}</div><div ng-message="minlength">{{::\'HINT_PASSWORD\' | translate }}</div><div ng-message="ERROR_1105">{{::\'ERROR_IDENTICAL_PASSWORDS\' | translate }}</div></div></md-input-container><md-input-container class="md-block"><label>{{ \'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD\' | translate }}</label> <input name="repeat" type="password" ng-model="repeat" ng-change="onCheckRepeatPassword()" ng-required="change_password.$submitted" ng-minlength="6"><div class="hint" ng-if="errorsRepeatWithHint(form.repeat).hint">{{::\'HINT_REPEAT_PASSWORD\' | translate }}</div><div ng-messages="errorsRepeatWithHint(form.repeat)"><div ng-message="required">{{::\'ERROR_REQUIRED\' | translate }}</div><div ng-message="minlength">{{::\'HINT_PASSWORD\' | translate }}</div><div ng-message="repeat">{{::\'REPEAT_PASSWORD_INVALID\' | translate }}</div></div></md-input-container></div></div><div class="pip-footer"><div><md-button aria-label="xxx" ng-click="onCancel()">{{::\'CANCEL\' | translate }}</md-button><md-button type="submit" class="md-accent" aria-label="xxx">{{::\'APPLY\' | translate : module}}</md-button></div></div></form></md-dialog>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_sessions.html',
    '<md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top"></md-progress-linear><div class="pip-details-title pip-sessions"><p class="pip-title bm16">{{::\'SETTINGS_ACTIVE_SESSIONS_TITLE\' | translate}}</p><p class="pip-subtitle">{{::\'SETTINGS_ACTIVE_SESSIONS_SUBTITLE\' | translate}}</p></div><md-list class="w-stretch"><div ng-repeat="session in sessions"><div class="layout-row" ng-init="showBlock = session.id != sessionId" ng-click="showBlock = !showBlock"><p class="m0 text-subhead2 text-overflow max-w50-stretch">{{::session.client}}</p><p class="m0 lp4 text-body1 color-secondary-text flex">{{::\'SETTINGS_ACTIVE_SESSION_ACTIVE\' | translate}}</p><p class="m0 text-body1 color-secondary-text">{{::country}}<md-icon ng-if="showBlock" md-svg-icon="icons:triangle-up"></md-icon><md-icon ng-if="!showBlock" md-svg-icon="icons:triangle-down"></md-icon></p></div><div class="layout-row bm8 bp8" ng-class="{\'divider-bottom\':!$last}"><div class="flex-50"><p class="m0 bm4 text-body1 text-overflow color-secondary-text">{{session.last_req | date : \'medium\'}}</p><p class="m0 bm4 text-body1 text-overflow color-secondary-text" ng-show="showBlock">{{::\'SETTINGS_ACTIVE_SESSION_OS\' | translate}}{{::session.platform}}</p><p class="m0 bm4 text-body1 text-overflow color-secondary-text" ng-show="showBlock">{{::\'SETTINGS_ACTIVE_SESSION_IP\' | translate}}{{::session.address}}</p><md-button class="md-raised" ng-show="showBlock && session.id != sessionId" ng-click="onRemove(session)">{{::\'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION\' | translate}}</md-button></div><pip-location-ip class="map-edit flex-50" ng-if="showBlock" pip-ipaddress="session.address" pip-extra-info="country = extraInfo.country"></pip-location-ip></div></div></md-list><div class="layout-row layout-align-end-center"><md-button class="md-raised" ng-show="sessions.length > 1" ng-click="onRemoveAll()">{{::\'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS\' | translate}}</md-button></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('user_settings/user_settings_verify_email.html',
    '<md-dialog class="pip-dialog layout-column" width="440"><div class="pip-body"><div class="pip-content"><md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top"></md-progress-linear><h2>{{::\'VERIFY_EMAIL_TITLE\' | translate}}</h2><p class="title-padding">{{::\'VERIFY_EMAIL_TEXT_1\' | translate}}</p><form name="form" novalidate=""><div ng-messages="form.$serverError" class="text-error bm8"><div ng-message="ERROR_UNKNOWN">{{ form.$serverError.ERROR_UNKNOWN | translate }}</div></div><md-input-container class="display bp4 md-block"><label>{{::\'EMAIL\' | translate}}</label> <input name="email" type="email" ng-model="data.email" required="" step="any" pip-clear-errors="" tabindex="1" ng-disabled="transaction.busy()" pip-test="input-email"><div class="hint" ng-if="errorsWithHint(form, form.email).hint">{{::\'HINT_EMAIL\' | translate}}</div><div ng-messages="errorsWithHint(form, form.email)" xng-if="!form.email.$pristine"><div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div><div ng-message="ERROR_1106">{{::\'ERROR_USER_NOT_FOUND\' | translate}}</div></div></md-input-container><md-input-container class="md-block"><label>{{::\'ENTRY_VERIFICATION_CODE\' | translate}}</label> <input name="code" ng-disabled="transaction.busy()" tabindex="0" ng-model="data.code" required="" pip-clear-errors=""><div ng-messages="errorsWithHint(form, form.code)"><div ng-message="required">{{::\'ERROR_CODE_INVALID\' | translate }}</div><div ng-message="ERROR_1103">{{::\'ERROR_CODE_WRONG\' | translate }}</div></div></md-input-container><p>{{::\'VERIFY_EMAIL_TEXT_21\' | translate}} <a ng-click="onRequestVerificationClick()" class="pointer" tabindex="0">{{::\'VERIFY_EMAIL_RESEND\' | translate}}</a> {{::\'VERIFY_EMAIL_TEXT_22\' | translate}}</p></form></div></div><div class="pip-footer"><md-button ng-click="onCancel()" ng-hide="transaction.busy()" aria-label="xxx">{{::\'CANCEL\' | translate}}</md-button><md-button class="md-accent" ng-click="onVerify()" ng-hide="transaction.busy()" tabindex="0" aria-label="xxx" ng-disabled="data.code.length == 0 || data.email.length == 0 || (!data.email && form.$pristine) || (!data.code)">{{::\'VERIFY\' | translate}}</md-button><md-button class="md-warn" ng-show="transaction.busy()" ng-click="transaction.abort()" tabindex="0" aria-label="xxx">{{::\'CANCEL\' | translate}}</md-button></div></md-dialog>');
}]);
})();



},{}]},{},[15,5,6,3,4,8,7,2,1,10,11,12,13,14,9])(15)
});

//# sourceMappingURL=pip-webui-settings.js.map
