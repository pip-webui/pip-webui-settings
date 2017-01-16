(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).settings = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
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
(function () {
    var SettingsPageController = (function () {
        SettingsPageController.$inject = ['$log', '$q', '$state', 'pipNavService', 'pipSettings', '$rootScope', '$timeout'];
        function SettingsPageController($log, $q, $state, pipNavService, pipSettings, $rootScope, $timeout) {
            var _this = this;
            this._log = $log;
            this._q = $q;
            this._state = $state;
            this.tabs = _.filter(pipSettings.getTabs(), function (tab) {
                if (tab.visible === true && (tab.access ? tab.access($rootScope.$user, tab) : true)) {
                    return tab;
                }
            });
            this.tabs = _.sortBy(this.tabs, 'index');
            this.selected = {};
            if (this._state.current.name !== 'settings') {
                this.initSelect(this._state.current.name);
            }
            else if (this._state.current.name === 'settings' && pipSettings.getDefaultTab()) {
                this.initSelect(pipSettings.getDefaultTab().state);
            }
            else {
                $timeout(function () {
                    if (pipSettings.getDefaultTab()) {
                        this.initSelect(pipSettings.getDefaultTab().state);
                    }
                    if (!pipSettings.getDefaultTab() && this.tabs.length > 0) {
                        this.initSelect(this.tabs[0].state);
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
                this._state.go(state);
            }
        };
        return SettingsPageController;
    }());
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
var SettingsTab = (function () {
    function SettingsTab() {
    }
    return SettingsTab;
}());
exports.SettingsTab = SettingsTab;
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
    SettingsService.$inject = ['$rootScope', 'config'];
    function SettingsService($rootScope, config) {
        "ngInject";
        this._rootScope = $rootScope;
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
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === defaultTab;
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
        this._config = new SettingsConfig();
        this._stateProvider = $stateProvider;
    }
    SettingsProvider.prototype.getFullStateName = function (state) {
        return 'settings.' + state;
    };
    SettingsProvider.prototype.getDefaultTab = function () {
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === defaultTab;
        });
        return _.cloneDeep(defaultTab);
    };
    SettingsProvider.prototype.addTab = function (tabObj) {
        var existingTab;
        this.validateTab(tabObj);
        existingTab = _.find(this._config.tabs, function (p) {
            return p.state === 'settings.' + tabObj.state;
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
        this._stateProvider.state(this.getFullStateName(tabObj.state), tabObj.stateConfig);
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
    SettingsProvider.prototype.$get = ['$rootScope', '$state', function ($rootScope, $state) {
        "ngInject";
        if (this._service == null)
            this._service = new SettingsService($rootScope, this._config);
        return this._service;
    }];
    return SettingsProvider;
}());
angular
    .module('pipSettings.Service')
    .provider('pipSettings', SettingsProvider);
},{}],8:[function(require,module,exports){
'use strict';
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



},{}]},{},[15,5,6,3,4,8,7,2,1,10,11,12,13,14,9])(15)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvU2V0dGluZ3NNb2R1bGUudHMiLCJzcmMvc2V0dGluZ3MudHMiLCJzcmMvc2V0dGluZ3NfcGFnZS9TZXR0aW5nc1BhZ2VDb250cm9sbGVyLnRzIiwic3JjL3NldHRpbmdzX3BhZ2UvU2V0dGluZ3NQYWdlUm91dGVzLnRzIiwic3JjL3NldHRpbmdzX3BhZ2UvaW5kZXgudHMiLCJzcmMvc2V0dGluZ3Nfc2VydmljZS9TZXR0aW5nc1NlcnZpY2UudHMiLCJzcmMvc2V0dGluZ3Nfc2VydmljZS9pbmRleC50cyIsInNyYy91c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3MudHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX2Jhc2ljX2luZm8udHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX2NoYW5nZV9wYXNzd29yZC50cyIsInNyYy91c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3Nfc2Vzc2lvbnMudHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX3N0cmluZ3MudHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX3ZlcmlmeV9lbWFpbC50cyIsInRlbXAvcGlwLXdlYnVpLXNldHRpbmdzLWh0bWwubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDO0FBRWIsb0NBQWtDO0FBQ2xDLGlDQUErQjtBQUUvQixPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtJQUMxQixxQkFBcUI7SUFDckIsa0JBQWtCO0NBQ3JCLENBQUMsQ0FBQzs7QUNISCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7UUFDMUIscUJBQXFCO1FBQ3JCLGtCQUFrQjtLQUNyQixDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ1pMLENB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QVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTlCLGFBQWEsQ0FBQyxZQUFZLENBQ3RCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUNsQjtvQkFDSSxJQUFJLEVBQUUsT0FBTztvQkFDYixJQUFJLEVBQUUsTUFBTTtpQkFDZixDQUNKLENBQUM7WUFFTixDQUFDLENBQ0osQ0FBQztRQUNOLENBQUM7SUFDTCxDQUFDLENBQ0osQ0FBQztBQUVOLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDcElMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICcuL3NldHRpbmdzX3NlcnZpY2UvaW5kZXgnO1xyXG5pbXBvcnQgJy4vc2V0dGluZ3NfcGFnZS9pbmRleCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MnLCBbXHJcbiAgICAncGlwU2V0dGluZ3MuU2VydmljZScsXHJcbiAgICAncGlwU2V0dGluZ3MuUGFnZSdcclxuXSk7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL3NldHRpbmdzX3NlcnZpY2UnO1xyXG5leHBvcnQgKiBmcm9tICcuL3NldHRpbmdzX3BhZ2UnOyIsIu+7vy8qKlxyXG4gKiBAZmlsZSBSZWdpc3RyYXRpb24gb2Ygc2V0dGluZ3MgY29tcG9uZW50c1xyXG4gKiBAY29weXJpZ2h0IERpZ2l0YWwgTGl2aW5nIFNvZnR3YXJlIENvcnAuIDIwMTQtMjAxNlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzJywgW1xyXG4gICAgICAgICdwaXBTZXR0aW5ncy5TZXJ2aWNlJyxcclxuICAgICAgICAncGlwU2V0dGluZ3MuUGFnZSdcclxuICAgIF0pO1xyXG5cclxufSkoKTtcclxuIiwiLy8gUHJldmVudCBqdW5rIGZyb20gZ29pbmcgaW50byB0eXBlc2NyaXB0IGRlZmluaXRpb25zXHJcbigoKSA9PiB7XHJcblxyXG5jbGFzcyBTZXR0aW5nc1BhZ2VDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2xvZzogbmcuSUxvZ1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9xOiBuZy5JUVNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9zdGF0ZTogbmcudWkuSVN0YXRlU2VydmljZTtcclxuXHJcbiAgICBwdWJsaWMgdGFiczogYW55O1xyXG4gICAgcHVibGljIHNlbGVjdGVkOiBhbnk7XHJcbiAgICBwdWJsaWMgb25Ecm9wZG93blNlbGVjdDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRsb2c6IG5nLklMb2dTZXJ2aWNlLFxyXG4gICAgICAgICRxOiBuZy5JUVNlcnZpY2UsXHJcbiAgICAgICAgJHN0YXRlOiBuZy51aS5JU3RhdGVTZXJ2aWNlLFxyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UsXHJcbiAgICAgICAgcGlwU2V0dGluZ3MsXHJcbiAgICAgICAgJHJvb3RTY29wZSwgXHJcbiAgICAgICAgJHRpbWVvdXRcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX2xvZyA9ICRsb2c7XHJcbiAgICAgICAgdGhpcy5fcSA9ICRxO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gJHN0YXRlO1xyXG5cclxuICAgICAgICB0aGlzLnRhYnMgPSBfLmZpbHRlcihwaXBTZXR0aW5ncy5nZXRUYWJzKCksIGZ1bmN0aW9uICh0YWI6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhYi52aXNpYmxlID09PSB0cnVlICYmICh0YWIuYWNjZXNzID8gdGFiLmFjY2Vzcygkcm9vdFNjb3BlLiR1c2VyLCB0YWIpIDogdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50YWJzID0gXy5zb3J0QnkodGhpcy50YWJzLCAnaW5kZXgnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHt9O1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZS5jdXJyZW50Lm5hbWUgIT09ICdzZXR0aW5ncycpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0U2VsZWN0KHRoaXMuX3N0YXRlLmN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZS5jdXJyZW50Lm5hbWUgPT09ICdzZXR0aW5ncycgJiYgcGlwU2V0dGluZ3MuZ2V0RGVmYXVsdFRhYigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFNlbGVjdChwaXBTZXR0aW5ncy5nZXREZWZhdWx0VGFiKCkuc3RhdGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwaXBTZXR0aW5ncy5nZXREZWZhdWx0VGFiKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRTZWxlY3QocGlwU2V0dGluZ3MuZ2V0RGVmYXVsdFRhYigpLnN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghcGlwU2V0dGluZ3MuZ2V0RGVmYXVsdFRhYigpICYmIHRoaXMudGFicy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNlbGVjdCh0aGlzLnRhYnNbMF0uc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuaWNvbi5zaG93TWVudSgpO1xyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuYnJlYWRjcnVtYi50ZXh0ID0gXCJTZXR0aW5nc1wiO1xyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuYWN0aW9ucy5oaWRlKCk7XHJcbiAgICAgICAgcGlwTmF2U2VydmljZS5hcHBiYXIucmVtb3ZlU2hhZG93KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbkRyb3Bkb3duU2VsZWN0ID0gKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25OYXZpZ2F0aW9uU2VsZWN0KHN0YXRlLnN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U2VsZWN0KHN0YXRlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkLnRhYiA9IF8uZmluZCh0aGlzLnRhYnMsIGZ1bmN0aW9uICh0YWI6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWIuc3RhdGUgPT09IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZC50YWJJbmRleCA9IF8uaW5kZXhPZih0aGlzLnRhYnMsIHRoaXMuc2VsZWN0ZWQudGFiKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkLnRhYklkID0gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTmF2aWdhdGlvblNlbGVjdChzdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbml0U2VsZWN0KHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQudGFiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlLmdvKHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5QYWdlJylcclxuICAgIC5jb250cm9sbGVyKCdwaXBTZXR0aW5nc1BhZ2VDb250cm9sbGVyJywgU2V0dGluZ3NQYWdlQ29udHJvbGxlcik7XHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlU2V0dGluZ3NQYWdlUm91dGVzKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnc2V0dGluZ3MnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9zZXR0aW5ncz9wYXJ0eV9pZCcsXHJcbiAgICAgICAgICAgIGF1dGg6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3BpcFNldHRpbmdzUGFnZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NldHRpbmdzX3BhZ2UvU2V0dGluZ3NQYWdlLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICBcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlBhZ2UnKVxyXG4gICAgLmNvbmZpZyhjb25maWd1cmVTZXR0aW5nc1BhZ2VSb3V0ZXMpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuUGFnZScsIFtcclxuICAgICd1aS5yb3V0ZXInLCBcclxuICAgICdwaXBTZXR0aW5ncy5TZXJ2aWNlJyxcclxuICAgICdwaXBOYXYnLCBcclxuICAgICdwaXBTZWxlY3RlZCcsXHJcbiAgICAncGlwVHJhbnNsYXRlJyxcclxuICAgICdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnXHJcbiAgICBdKTtcclxuXHJcblxyXG5pbXBvcnQgJy4vU2V0dGluZ3NQYWdlQ29udHJvbGxlcic7XHJcbmltcG9ydCAnLi9TZXR0aW5nc1BhZ2VSb3V0ZXMnOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1RhYiB7XHJcbiAgICBwdWJsaWMgc3RhdGU6IHN0cmluZztcclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGluZGV4OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWNjZXNzOiBib29sZWFuO1xyXG4gICAgcHVibGljIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgc3RhdGVDb25maWc6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2V0dGluZ3NTZXJ2aWNlIHtcclxuICAgIGdldERlZmF1bHRUYWIoKTtcclxuICAgIHNob3dUaXRsZVRleHQgKG5ld1RpdGxlVGV4dCk7XHJcbiAgICBzaG93VGl0bGVMb2dvKG5ld1RpdGxlTG9nbyk7XHJcbiAgICBzZXREZWZhdWx0VGFiKG5hbWU6IHN0cmluZyk7XHJcbiAgICBzaG93TmF2SWNvbih2YWx1ZSk7XHJcbiAgICBnZXRUYWJzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNldHRpbmdzUHJvdmlkZXIgZXh0ZW5kcyBuZy5JU2VydmljZVByb3ZpZGVyIHtcclxuICAgIGdldERlZmF1bHRUYWIoKTogU2V0dGluZ3NUYWI7XHJcbiAgICBhZGRUYWIodGFiT2JqOiBhbnkpO1xyXG4gICAgc2V0RGVmYXVsdFRhYihuYW1lOiBzdHJpbmcpOiB2b2lkO1xyXG4gICAgZ2V0RnVsbFN0YXRlTmFtZShzdGF0ZTogc3RyaW5nKTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDb25maWcge1xyXG5cclxuICAgIHB1YmxpYyBkZWZhdWx0VGFiOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGFiczogU2V0dGluZ3NUYWJbXSA9IFtdO1xyXG4gICAgcHVibGljIHRpdGxlVGV4dDogc3RyaW5nID0gJ1NFVFRJTkdTX1RJVExFJztcclxuICAgIHB1YmxpYyB0aXRsZUxvZ286IGJvb2xlYW4gPSBudWxsO1xyXG4gICAgcHVibGljIGlzTmF2SWNvbjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG59XHJcblxyXG5jbGFzcyBTZXR0aW5nc1NlcnZpY2UgaW1wbGVtZW50cyBJU2V0dGluZ3NTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogU2V0dGluZ3NDb25maWc7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBTZXR0aW5nc0NvbmZpZykge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEZ1bGxTdGF0ZU5hbWUoc3RhdGU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuICdzZXR0aW5ncy4nICsgc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldERlZmF1bHRUYWIobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFfLmZpbmQodGhpcy5fY29uZmlnLnRhYnMsIGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhYi5zdGF0ZSA9PT0gJ3NldHRpbmdzLicgKyBuYW1lO1xyXG4gICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGFiIHdpdGggc3RhdGUgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGlzIG5vdCByZWdpc3RlcmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdFRhYiA9IHRoaXMuZ2V0RnVsbFN0YXRlTmFtZShuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGVmYXVsdFRhYigpIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFRhYjtcclxuICAgICAgICBkZWZhdWx0VGFiID0gXy5maW5kKHRoaXMuX2NvbmZpZy50YWJzLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcC5zdGF0ZSA9PT0gZGVmYXVsdFRhYjtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gXy5jbG9uZURlZXAoZGVmYXVsdFRhYik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dUaXRsZVRleHQgKG5ld1RpdGxlVGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKG5ld1RpdGxlVGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVUZXh0ID0gbmV3VGl0bGVUZXh0O1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVMb2dvID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcudGl0bGVUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93VGl0bGVMb2dvKG5ld1RpdGxlTG9nbykge1xyXG4gICAgICAgIGlmIChuZXdUaXRsZUxvZ28pIHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlTG9nbyA9IG5ld1RpdGxlTG9nbztcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlVGV4dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnRpdGxlTG9nbztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd05hdkljb24odmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuaXNOYXZJY29uID0gISF2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuaXNOYXZJY29uO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFRhYnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uY2xvbmVEZWVwKHRoaXMuX2NvbmZpZy50YWJzKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFNldHRpbmdzUHJvdmlkZXIgaW1wbGVtZW50cyBJU2V0dGluZ3NQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9zZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9jb25maWc6IFNldHRpbmdzQ29uZmlnID0gbmV3IFNldHRpbmdzQ29uZmlnKCk7XHJcbiAgICBwcml2YXRlIF9zdGF0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigkc3RhdGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICB0aGlzLl9zdGF0ZVByb3ZpZGVyID0gJHN0YXRlUHJvdmlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEZ1bGxTdGF0ZU5hbWUoc3RhdGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnc2V0dGluZ3MuJyArIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREZWZhdWx0VGFiKCk6IFNldHRpbmdzVGFiIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFRhYjtcclxuXHJcbiAgICAgICAgZGVmYXVsdFRhYiA9IF8uZmluZCh0aGlzLl9jb25maWcudGFicywgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHAuc3RhdGUgPT09IGRlZmF1bHRUYWI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBfLmNsb25lRGVlcChkZWZhdWx0VGFiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkVGFiKHRhYk9iajogYW55KSB7XHJcbiAgICAgICAgdmFyIGV4aXN0aW5nVGFiOiBTZXR0aW5nc1RhYjtcclxuXHJcbiAgICAgICAgdGhpcy52YWxpZGF0ZVRhYih0YWJPYmopO1xyXG4gICAgICAgIGV4aXN0aW5nVGFiID0gXy5maW5kKHRoaXMuX2NvbmZpZy50YWJzLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcC5zdGF0ZSA9PT0gJ3NldHRpbmdzLicgKyB0YWJPYmouc3RhdGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKGV4aXN0aW5nVGFiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGFiIHdpdGggc3RhdGUgbmFtZSBcIicgKyB0YWJPYmouc3RhdGUgKyAnXCIgaXMgYWxyZWFkeSByZWdpc3RlcmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jb25maWcudGFicy5wdXNoKHtcclxuICAgICAgICAgICAgc3RhdGU6IHRoaXMuZ2V0RnVsbFN0YXRlTmFtZSh0YWJPYmouc3RhdGUpLFxyXG4gICAgICAgICAgICB0aXRsZTogdGFiT2JqLnRpdGxlLFxyXG4gICAgICAgICAgICBpbmRleDogdGFiT2JqLmluZGV4IHx8IDEwMDAwMCxcclxuICAgICAgICAgICAgYWNjZXNzOiB0YWJPYmouYWNjZXNzLFxyXG4gICAgICAgICAgICB2aXNpYmxlOiB0YWJPYmoudmlzaWJsZSAhPT0gZmFsc2UsXHJcbiAgICAgICAgICAgIHN0YXRlQ29uZmlnOiBfLmNsb25lRGVlcCh0YWJPYmouc3RhdGVDb25maWcpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fc3RhdGVQcm92aWRlci5zdGF0ZSh0aGlzLmdldEZ1bGxTdGF0ZU5hbWUodGFiT2JqLnN0YXRlKSwgdGFiT2JqLnN0YXRlQ29uZmlnKTtcclxuXHJcbiAgICAgICAgLy8gaWYgd2UganVzdCBhZGRlZCBmaXJzdCBzdGF0ZSBhbmQgbm8gZGVmYXVsdCBzdGF0ZSBpcyBzcGVjaWZpZWRcclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMuX2NvbmZpZy5kZWZhdWx0VGFiID09PSAndW5kZWZpbmVkJyAmJiB0aGlzLl9jb25maWcudGFicy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREZWZhdWx0VGFiKHRhYk9iai5zdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXREZWZhdWx0VGFiKG5hbWU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIC8vIFRPRE8gW2FwaWRoaXJueWldIGV4dHJhY3QgZXhwcmVzc2lvbiBpbnNpZGUgJ2lmJyBpbnRvIHZhcmlhYmxlLiBJdCBpc24ndCByZWFkYWJsZSBub3cuXHJcbiAgICAgICAgaWYgKCFfLmZpbmQodGhpcy5fY29uZmlnLnRhYnMsIGZ1bmN0aW9uICh0YWIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRhYi5zdGF0ZSA9PT0gJ3NldHRpbmdzLicgKyBuYW1lO1xyXG4gICAgICAgIH0pKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGFiIHdpdGggc3RhdGUgbmFtZSBcIicgKyBuYW1lICsgJ1wiIGlzIG5vdCByZWdpc3RlcmVkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jb25maWcuZGVmYXVsdFRhYiA9IHRoaXMuZ2V0RnVsbFN0YXRlTmFtZShuYW1lKTtcclxuICAgICAgICAvL3RoaXMuX3N0YXRlUHJvdmlkZXIuZ28odGhpcy5fY29uZmlnLmRlZmF1bHRUYWIpO1xyXG4gICAgICAgICAgICAvL3BpcEF1dGhTdGF0ZVByb3ZpZGVyLnJlZGlyZWN0KCdzZXR0aW5ncycsIGdldEZ1bGxTdGF0ZU5hbWUobmFtZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVmFsaWRhdGVzIHBhc3NlZCB0YWIgY29uZmlnIG9iamVjdFxyXG4gICAgICogSWYgcGFzc2VkIHRhYiBpcyBub3QgdmFsaWQgaXQgd2lsbCB0aHJvdyBhbiBlcnJvclxyXG4gICAgICovXHJcblxyXG4gICAgcHJpdmF0ZSB2YWxpZGF0ZVRhYih0YWJPYmo6IFNldHRpbmdzVGFiKSB7XHJcbiAgICAgICAgaWYgKCF0YWJPYmogfHwgIV8uaXNPYmplY3QodGFiT2JqKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGFiT2JqLnN0YXRlID09PSBudWxsIHx8IHRhYk9iai5zdGF0ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUYWIgc2hvdWxkIGhhdmUgdmFsaWQgQW5ndWxhciBVSSByb3V0ZXIgc3RhdGUgbmFtZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhYk9iai5hY2Nlc3MgJiYgIV8uaXNGdW5jdGlvbih0YWJPYmouYWNjZXNzKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiYWNjZXNzXCIgc2hvdWxkIGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGFiT2JqLnN0YXRlQ29uZmlnIHx8ICFfLmlzT2JqZWN0KHRhYk9iai5zdGF0ZUNvbmZpZykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0YXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93VGl0bGVUZXh0IChuZXdUaXRsZVRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKG5ld1RpdGxlVGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVUZXh0ID0gbmV3VGl0bGVUZXh0O1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVMb2dvID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcudGl0bGVUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93VGl0bGVMb2dvKG5ld1RpdGxlTG9nbykge1xyXG4gICAgICAgIGlmIChuZXdUaXRsZUxvZ28pIHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlTG9nbyA9IG5ld1RpdGxlTG9nbztcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlVGV4dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnRpdGxlTG9nbztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd05hdkljb24odmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuaXNOYXZJY29uID0gISF2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuaXNOYXZJY29uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkZ2V0KCRyb290U2NvcGUsICRzdGF0ZSkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NlcnZpY2UgPT0gbnVsbClcclxuICAgICAgICAgICAgdGhpcy5fc2VydmljZSA9IG5ldyBTZXR0aW5nc1NlcnZpY2UoJHJvb3RTY29wZSwgdGhpcy5fY29uZmlnKTtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VydmljZTtcclxuICAgIH1cclxufVxyXG5cclxuYW5ndWxhclxyXG4gICAgLm1vZHVsZSgncGlwU2V0dGluZ3MuU2VydmljZScpXHJcbiAgICAucHJvdmlkZXIoJ3BpcFNldHRpbmdzJywgU2V0dGluZ3NQcm92aWRlcik7XHJcblxyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuU2VydmljZScsIFtdKTtcclxuXHJcbmltcG9ydCAnLi9TZXR0aW5nc1NlcnZpY2UnOyIsIi8qKlxyXG4gKiBAZmlsZSBTZXR0aW5ncyB0YWIgbG9naWNcclxuICogQGNvcHlyaWdodCBEaWdpdGFsIExpdmluZyBTb2Z0d2FyZSBDb3JwLiAyMDE0LTIwMTZcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBVc2VyU2V0dGluZ3MnLCBbXHJcbiAgICAgICAgJ25nTWF0ZXJpYWwnLCAncGlwRGF0YScsXHJcbiAgICAgICAgJ3BpcFNldHRpbmdzLlNlcnZpY2UnLFxyXG4gICAgICAgICdwaXBTZXR0aW5ncy5QYWdlJyxcclxuXHJcbiAgICAgICAgJ3BpcFVzZXJTZXR0aW5ncy5TdHJpbmdzJyxcclxuICAgICAgICAncGlwVXNlclNldHRpbmdzLlNlc3Npb25zJyxcclxuICAgICAgICAncGlwVXNlclNldHRpbmdzLkJhc2ljSW5mbycsXHJcbiAgICAgICAgJ3BpcFNldHRpbmdzLlRlbXBsYXRlcydcclxuICAgIF0pO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIEBmaWxlIFNldHRpbmdzIGJhc2ljIGluZm8gY29udHJvbGxlclxyXG4gKiBAY29weXJpZ2h0IERpZ2l0YWwgTGl2aW5nIFNvZnR3YXJlIENvcnAuIDIwMTQtMjAxNlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVXNlclNldHRpbmdzLkJhc2ljSW5mbycsXHJcbiAgICAgICAgWydwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQnLCAncGlwVXNlclNldHRpbmdzLlZlcmlmeUVtYWlsJywgXHJcbiAgICAgICAgICAgICdwaXBTZXR0aW5ncy5TZXJ2aWNlJywgJ3BpcFNldHRpbmdzLlBhZ2UnLF0pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuY29uZmlnKGZ1bmN0aW9uIChwaXBTZXR0aW5nc1Byb3ZpZGVyKSB7XHJcbiAgICAgICAgcGlwU2V0dGluZ3NQcm92aWRlci5hZGRUYWIoe1xyXG4gICAgICAgICAgICBzdGF0ZTogJ2Jhc2ljX2luZm8nLFxyXG4gICAgICAgICAgICBpbmRleDogMSxcclxuICAgICAgICAgICAgdGl0bGU6ICdTRVRUSU5HU19CQVNJQ19JTkZPX1RJVExFJyxcclxuICAgICAgICAgICAgc3RhdGVDb25maWc6IHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9iYXNpY19pbmZvJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwaXBVc2VyU2V0dGluZ3NCYXNpY0luZm9Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX2Jhc2ljX2luZm8uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBhdXRoOiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGlwU2V0dGluZ3NQcm92aWRlci5zZXREZWZhdWx0VGFiKCdiYXNpY19pbmZvJyk7XHJcbiAgICB9KTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBjb250cm9sbGVyXHJcbiAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQmFzaWNJbmZvOnBpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXJcclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIENvbnRyb2xsZXIgZm9yIHRoZSBwcmVkZWZpbmVkICdiYXNpY19pbmZvJyBzdGF0ZS5cclxuICAgICAqIFByb3ZpZGVzIHN5bmMgY2hhbmdlcyB1c2VyJ3MgcHJvZmlsZSB3aXRoIHJlbW90ZSBwcm9maWxlLlxyXG4gICAgICogT24gc3RhdGUgZXhpdCBldmVyeXRoaW5nIGlzIHNhdmVkIG9uIHRoZSBzZXJ2ZXIuXHJcbiAgICAgKi9cclxuICAgIHRoaXNNb2R1bGUuY29udHJvbGxlcigncGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJG1kRGlhbG9nLCAkc3RhdGUsICR3aW5kb3csICR0aW1lb3V0LCAkbWRUaGVtaW5nLFxyXG4gICAgICAgICAgICAgICAgICBwaXBUcmFuc2xhdGUsIHBpcFRyYW5zYWN0aW9uLCBwaXBUaGVtZSxcclxuICAgICAgICAgICAgICAgICAgcGlwVG9hc3RzLCBwaXBEYXRhVXNlciwgcGlwRGF0YVBhcnR5LCBwaXBGb3JtRXJyb3JzKSB7XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm9yaWdpbmFsUGFydHkgPSBhbmd1bGFyLnRvSnNvbigkcm9vdFNjb3BlLiRwYXJ0eSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubmFtZUNvcHkgPSAkcm9vdFNjb3BlLiRwYXJ0eS5uYW1lO1xyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvY19wb3MgPSAkcm9vdFNjb3BlLiRwYXJ0eS5sb2NfcG9zO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5nZW5kZXJzID0gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZVNldChbJ21hbGUnLCAnZmVtYWxlJywgJ24vcyddKTtcclxuICAgICAgICAgICAgJHNjb3BlLmxhbmd1YWdlcyA9IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGVTZXQoWydydScsICdlbiddKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbiA9IHBpcFRyYW5zYWN0aW9uKCdzZXR0aW5ncy5iYXNpY19pbmZvJywgJHNjb3BlKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS50aGVtZXMgPSBfLmtleXMoXy5vbWl0KCRtZFRoZW1pbmcuVEhFTUVTLCAnZGVmYXVsdCcpKTtcclxuXHJcbiAgICAgICAgICAgICRzdGF0ZS5nZXQoJ3NldHRpbmdzLmJhc2ljX2luZm8nKS5vbkV4aXQgPSBzYXZlQ2hhbmdlcztcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvcnNXaXRoSGludCA9IHBpcEZvcm1FcnJvcnMuZXJyb3JzV2l0aEhpbnQ7XHJcbiAgICAgICAgICAgIC8qKiBAc2VlIG9uQ2hhbmdlUGFzc3dvcmQgKi9cclxuICAgICAgICAgICAgJHNjb3BlLm9uQ2hhbmdlUGFzc3dvcmQgPSBvbkNoYW5nZVBhc3N3b3JkO1xyXG4gICAgICAgICAgICAvKiogQHNlZSBvblZlcmlmeUVtYWlsICovXHJcbiAgICAgICAgICAgICRzY29wZS5vblZlcmlmeUVtYWlsID0gb25WZXJpZnlFbWFpbDtcclxuICAgICAgICAgICAgLyoqIEBzZWUgb25QaWN0dXJlQ3JlYXRlZCAqL1xyXG4gICAgICAgICAgICAkc2NvcGUub25QaWN0dXJlQ3JlYXRlZCA9IG9uUGljdHVyZUNyZWF0ZWQ7XHJcbiAgICAgICAgICAgIC8qKiBAc2VlIG9uUGljdHVyZUNoYW5nZWQgKi9cclxuICAgICAgICAgICAgJHNjb3BlLm9uUGljdHVyZUNoYW5nZWQgPSBvblBpY3R1cmVDaGFuZ2VkO1xyXG4gICAgICAgICAgICAvKiogQHNlZSB1cGRhdGVVc2VyICovXHJcbiAgICAgICAgICAgICRzY29wZS5vbkNoYW5nZVVzZXIgPSBfLmRlYm91bmNlKHVwZGF0ZVVzZXIsIDIwMDApO1xyXG4gICAgICAgICAgICAvKiogQHNlZSBzYXZlQ2hhbmdlcyAqL1xyXG4gICAgICAgICAgICAkc2NvcGUub25DaGFuZ2VCYXNpY0luZm8gPSBfLmRlYm91bmNlKHNhdmVDaGFuZ2VzLCAyMDAwKTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uUGljdHVyZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucGljdHVyZS5zYXZlKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdwaXBQYXJ0eUF2YXRhclVwZGF0ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBvblBpY3R1cmVDcmVhdGVkKCRldmVudCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnBpY3R1cmUgPSAkZXZlbnQuc2VuZGVyO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnBpY3R1cmUuc2F2ZShcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGlwUGFydHlBdmF0YXJVcGRhdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm86cGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQmFzaWNJbmZvLnBpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXI6b25DaGFuZ2VCYXNpY0luZm9cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIFNhdmVzIGNoYW5nZXMgb250byBzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAqIFRoaXMgbWV0aG9kIHJlc3BvbnNlcyBvbiBjaGFuZ2Ugb2YgdGhlIGlucHV0IGluZm9ybWF0aW9uLlxyXG4gICAgICAgICAgICAgKiBJdCBpcyB1cGRhdGVkIHVzZXIncyBwYXJ0eSBwcm9maWxlLiBBbHNvIGl0IHVwZGF0ZXMgdXNlcidzIHByb2ZpbGUgaW4gJHJvb3RTY29wZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNhdmVDaGFuZ2VzKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5mb3JtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uJHNldFN1Ym1pdHRlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLiRwYXJ0eSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS4kcGFydHkudHlwZSA9PT0gJ3BlcnNvbicgJiYgJHNjb3BlLmZvcm0uJGludmFsaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgdG8gYXZvaWQgdW5uZWNlc3Nhcnkgc2F2aW5nc1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJHBhcnR5LmxvY19wb3MgPSAkc2NvcGUubG9jX3BvcztcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFydHkgPSBhbmd1bGFyLnRvSnNvbigkcm9vdFNjb3BlLiRwYXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0eSAhPT0gJHNjb3BlLm9yaWdpbmFsUGFydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpZCA9ICRzY29wZS50cmFuc2FjdGlvbi5iZWdpbignVVBEQVRJTkcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcERhdGFQYXJ0eS51cGRhdGVQYXJ0eSgkcm9vdFNjb3BlLiRwYXJ0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS50cmFuc2FjdGlvbi5hYm9ydGVkKHRpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5vcmlnaW5hbFBhcnR5ID0gcGFydHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5hbWVDb3B5ID0gZGF0YS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmVuZChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSBTdHJpbmcoKSArICdFUlJPUl8nICsgZXJyb3Iuc3RhdHVzIHx8IGVycm9yLmRhdGEuc3RhdHVzX2NvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kcGFydHkgPSBhbmd1bGFyLmZyb21Kc29uKCRzY29wZS5vcmlnaW5hbFBhcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICAgICAgICAgKiBAbWV0aG9kT2YgcGlwVXNlclNldHRpbmdzLkJhc2ljSW5mbzpwaXBVc2VyU2V0dGluZ3NCYXNpY0luZm9Db250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm8ucGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlcjpvbkNoYW5nZVVzZXJcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIFNhdmVzIGNoYW5nZXMgb250byBzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAqIFRoaXMgbWV0aG9kIHJlc3BvbnNlcyBvbiBjaGFuZ2Ugb2YgdGhlIHVzZXIncyBwcm9maWxlIGluZm9ybWF0aW9uLlxyXG4gICAgICAgICAgICAgKiBBbHNvIGl0IHVwZGF0ZXMgdXNlcidzIHByb2ZpbGUgaW4gJHJvb3RTY29wZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVVzZXIoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGlkID0gJHNjb3BlLnRyYW5zYWN0aW9uLmJlZ2luKCdSZXF1ZXN0RW1haWxWZXJpZmljYXRpb24nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS4kdXNlci5pZCA9PT0gJHJvb3RTY29wZS4kcGFydHkuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBwaXBEYXRhVXNlci51cGRhdGVVc2VyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtOiAkcm9vdFNjb3BlLiR1c2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnRyYW5zYWN0aW9uLmFib3J0ZWQodGlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBUcmFuc2xhdGUudXNlKGRhdGEubGFuZ3VhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kdXNlci5sYW5ndWFnZSA9IGRhdGEubGFuZ3VhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiR1c2VyLnRoZW1lID0gZGF0YS50aGVtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkcm9vdFNjb3BlLiR1c2VyLnRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwVGhlbWUuc2V0Q3VycmVudFRoZW1lKCRyb290U2NvcGUuJHVzZXIudGhlbWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmVuZChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlID0gU3RyaW5nKCkgKyAnRVJST1JfJyArIGVycm9yLnN0YXR1cyB8fCBlcnJvci5kYXRhLnN0YXR1c19jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwVG9hc3RzLnNob3dOb3RpZmljYXRpb24ocGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShtZXNzYWdlKSwgbnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICAgICAgICAgKiBAbWV0aG9kT2YgcGlwVXNlclNldHRpbmdzLkJhc2ljSW5mbzpwaXBVc2VyU2V0dGluZ3NCYXNpY0luZm9Db250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm8ucGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlcjpvbkNoYW5nZVBhc3N3b3JkXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBJdCBvcGVucyBhIGRpYWxvZyBwYW5lbCB0byBjaGFuZ2UgcGFzc3dvcmQuXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCAgICBUcmlnZ2VyZWQgZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkNoYW5nZVBhc3N3b3JkKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWVzc2FnZTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd1c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3NfY2hhbmdlX3Bhc3N3b3JkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwaXBVc2VyU2V0dGluZ3NDaGFuZ2VQYXNzd29yZENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldmVudCxcclxuICAgICAgICAgICAgICAgICAgICBsb2NhbHM6IHtlbWFpbDogJHJvb3RTY29wZS4kcGFydHkuZW1haWx9XHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChhbnN3ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFN0cmluZygpICsgJ1JFU0VUX1BXRF9TVUNDRVNTX1RFWFQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwVG9hc3RzLnNob3dOb3RpZmljYXRpb24ocGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShtZXNzYWdlKSwgbnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm86cGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQmFzaWNJbmZvLnBpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXI6b25WZXJpZnlFbWFpbFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogSXQgb3BlbnMgYSBkaWFsb2cgcGFuZWwgdG8gY2hhbmdlIHBhc3N3b3JkLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgICAgVHJpZ2dlcmVkIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25WZXJpZnlFbWFpbChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX3ZlcmlmeV9lbWFpbC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGlwVXNlclNldHRpbmdzVmVyaWZ5RW1haWxDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXZlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzOiB7ZW1haWw6ICRyb290U2NvcGUuJHBhcnR5LmVtYWlsfVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYW5zd2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51c2VyLmVtYWlsX3ZlciA9IGFuc3dlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFuc3dlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFN0cmluZygpICsgJ1ZFUklGWV9FTUFJTF9TVUNDRVNTX1RFWFQnO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwVG9hc3RzLnNob3dOb3RpZmljYXRpb24ocGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShtZXNzYWdlKSwgbnVsbCwgbnVsbCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSBTZXR0aW5ncyBjaGFuZ2UgcGFzc3dvcmQgY29udHJvbGxlclxyXG4gKiBAY29weXJpZ2h0IERpZ2l0YWwgTGl2aW5nIFNvZnR3YXJlIENvcnAuIDIwMTQtMjAxNlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVXNlclNldHRpbmdzLkNoYW5nZVBhc3N3b3JkJywgW10pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIGNvbnRyb2xsZXJcclxuICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5DaGFuZ2VQYXNzd29yZDpwaXBVc2VyU2V0dGluZ3NDaGFuZ2VQYXNzd29yZENvbnRyb2xsZXJcclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIENvbnRyb2xsZXIgZm9yIGRpYWxvZyBwYW5lbCBvZiBwYXNzd29yZCBjaGFuZ2UuXHJcbiAgICAgKi9cclxuICAgIHRoaXNNb2R1bGUuY29udHJvbGxlcigncGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkbWREaWFsb2csIGVtYWlsLCBwaXBEYXRhVXNlciwgcGlwVHJhbnNhY3Rpb24sIHBpcEZvcm1FcnJvcnMpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbiA9IHBpcFRyYW5zYWN0aW9uKCdzZXR0aW5ncy5jaGFuZ2VfcGFzc3dvcmQnLCAkc2NvcGUpO1xyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3JzUmVwZWF0V2l0aEhpbnQgPSBmdW5jdGlvbiAoZm9ybSwgZm9ybVBhcnQpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuc2hvd1JlcGVhdEhpbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGlwRm9ybUVycm9ycy5lcnJvcnNXaXRoSGludChmb3JtLCBmb3JtUGFydCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd1JlcGVhdEhpbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAkc2NvcGUuY2hhbmdlUGFzRGF0YSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yc1dpdGhIaW50ID0gcGlwRm9ybUVycm9ycy5lcnJvcnNXaXRoSGludDtcclxuICAgICAgICAgICAgJHNjb3BlLm9uQ2FuY2VsID0gb25DYW5jZWw7XHJcbiAgICAgICAgICAgICRzY29wZS5vbkNoZWNrUmVwZWF0UGFzc3dvcmQgPSBvbkNoZWNrUmVwZWF0UGFzc3dvcmQ7XHJcbiAgICAgICAgICAgICRzY29wZS5vbkFwcGx5ID0gb25BcHBseTtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQ6cGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5DaGFuZ2VQYXNzd29yZC5waXBVc2VyU2V0dGluZ3NDaGFuZ2VQYXNzd29yZENvbnRyb2xsZXI6b25DYW5jZWxcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIENsb3NlcyBvcGVuZWQgZGlhbG9nIHBhbmVsLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25DYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQ6cGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5DaGFuZ2VQYXNzd29yZC5waXBVc2VyU2V0dGluZ3NDaGFuZ2VQYXNzd29yZENvbnRyb2xsZXI6b25DaGVja1JlcGVhdFBhc3N3b3JkXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBWYWxpZGF0ZXMgYSBwYXNzd29yZCB0eXBlZCBpbnRvIHBhc3N3b3JkIGZpZWxkcy5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uQ2hlY2tSZXBlYXRQYXNzd29yZCgpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuY2hhbmdlUGFzRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucmVwZWF0ID09PSAkc2NvcGUuY2hhbmdlUGFzRGF0YS5uZXdfcGFzc3dvcmQgfHwgJHNjb3BlLnJlcGVhdCA9PT0gJycgfHwgISRzY29wZS5yZXBlYXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0ucmVwZWF0LiRzZXRWYWxpZGl0eSgncmVwZWF0JywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUucmVwZWF0ID09PSAkc2NvcGUuY2hhbmdlUGFzRGF0YS5uZXdfcGFzc3dvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UmVwZWF0SGludCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNob3dSZXBlYXRIaW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UmVwZWF0SGludCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLnJlcGVhdC4kc2V0VmFsaWRpdHkoJ3JlcGVhdCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQ6cGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5DaGFuZ2VQYXNzd29yZC5waXBVc2VyU2V0dGluZ3NDaGFuZ2VQYXNzd29yZENvbnRyb2xsZXI6b25BcHBseVxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogQXBwcm92ZXMgcGFzc3dvcmQgY2hhbmdlIGFuZCBzZW5kcyByZXF1ZXN0IHRvIHRoZSBzZXJ2ZXIgb24gcGFzc3dvcmQgY2hhbmdlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25BcHBseSgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5vbkNoZWNrUmVwZWF0UGFzc3dvcmQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmZvcm0uJGludmFsaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUudHJhbnNhY3Rpb24uYmVnaW4oJ0NIQU5HRV9QQVNTV09SRCcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS5jaGFuZ2VQYXNEYXRhLmVtYWlsID0gZW1haWw7XHJcblxyXG4gICAgICAgICAgICAgICAgcGlwRGF0YVVzZXIuY2hhbmdlUGFzc3dvcmQoXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNoYW5nZVBhc0RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaXBGb3JtRXJyb3JzLnNldEZvcm1FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLCBlcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxMTA3OiAnb2xkUGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDExMDU6ICduZXdQYXNzd29yZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSBTZXR0aW5ncyBzZXNzaW9ucyBjb250cm9sbGVyXHJcbiAqIEBjb3B5cmlnaHQgRGlnaXRhbCBMaXZpbmcgU29mdHdhcmUgQ29ycC4gMjAxNC0yMDE2XHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBVc2VyU2V0dGluZ3MuU2Vzc2lvbnMnLCBbXHJcbiAgICAgICAgJ3BpcFNldHRpbmdzLlNlcnZpY2UnLCAncGlwU2V0dGluZ3MuUGFnZScsXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5jb25maWcoZnVuY3Rpb24gKHBpcFNldHRpbmdzUHJvdmlkZXIsIHBpcERhdGFTZXNzaW9uUHJvdmlkZXIpIHtcclxuICAgICAgICBwaXBTZXR0aW5nc1Byb3ZpZGVyLmFkZFRhYih7XHJcbiAgICAgICAgICAgIHN0YXRlOiAnc2Vzc2lvbnMnLFxyXG4gICAgICAgICAgICBpbmRleDogMyxcclxuICAgICAgICAgICAgdGl0bGU6ICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfVElUTEUnLFxyXG4gICAgICAgICAgICBzdGF0ZUNvbmZpZzoge1xyXG4gICAgICAgICAgICAgICAgdXJsOiAnL3Nlc3Npb25zJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdwaXBVc2VyU2V0dGluZ3NTZXNzaW9uc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd1c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3Nfc2Vzc2lvbnMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBhdXRoOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25zOiBwaXBEYXRhU2Vzc2lvblByb3ZpZGVyLnJlYWRTZXNzaW9uc1Jlc29sdmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlc3Npb25JZDogcGlwRGF0YVNlc3Npb25Qcm92aWRlci5yZWFkU2Vzc2lvbklkUmVzb2x2ZXJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgY29udHJvbGxlclxyXG4gICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLlNlc3Npb25zOnBpcFVzZXJTZXR0aW5nc1Nlc3Npb25zQ29udHJvbGxlclxyXG4gICAgICpcclxuICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICogQ29udHJvbGxlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIG1hbmFnaW5nIGFjdGl2ZSBzZXNzaW9ucy5cclxuICAgICAqL1xyXG4gICAgdGhpc01vZHVsZS5jb250cm9sbGVyKCdwaXBVc2VyU2V0dGluZ3NTZXNzaW9uc0NvbnRyb2xsZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsIHBpcFRyYW5zYWN0aW9uLCBwaXBEYXRhU2Vzc2lvbiwgc2Vzc2lvbnMsIHNlc3Npb25JZCkge1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNlc3Npb25JZCA9IHNlc3Npb25JZDtcclxuICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0gcGlwVHJhbnNhY3Rpb24oJ3NldHRpbmdzLnNlc3Npb25zJywgJHNjb3BlKTtcclxuICAgICAgICAgICAgJHNjb3BlLnNlc3Npb25zID0gc2Vzc2lvbnM7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub25SZW1vdmVBbGwgPSBvblJlbW92ZUFsbDtcclxuICAgICAgICAgICAgJHNjb3BlLm9uUmVtb3ZlID0gb25SZW1vdmU7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICAgICAgICAgKiBAbWV0aG9kT2YgcGlwVXNlclNldHRpbmdzLlNlc3Npb25zOnBpcFVzZXJTZXR0aW5nc1Nlc3Npb25zQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuU2Vzc2lvbnMucGlwVXNlclNldHRpbmdzU2Vzc2lvbnNDb250cm9sbGVyOm9uUmVtb3ZlQWxsXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBDbG9zZXMgYWxsIGFjdGl2ZSBzZXNzaW9uLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25SZW1vdmVBbGwoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGlkID0gJHNjb3BlLnRyYW5zYWN0aW9uLmJlZ2luKCdSRU1PVklORycpO1xyXG5cclxuICAgICAgICAgICAgICAgIGFzeW5jLmVhY2hTZXJpZXMoXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlc3Npb25zLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChzZXNzaW9uOiBhbnksIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXNzaW9uLmlkID09ICRzY29wZS5zZXNzaW9uSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwaXBEYXRhU2Vzc2lvbi5yZW1vdmVTZXNzaW9uKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbjogc2Vzc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2Vzc2lvbnMgPSBfLndpdGhvdXQoJHNjb3BlLnNlc3Npb25zLCBzZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoZXJyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnRyYW5zYWN0aW9uLmFib3J0ZWQodGlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTsgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuU2Vzc2lvbnM6cGlwVXNlclNldHRpbmdzU2Vzc2lvbnNDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5TZXNzaW9ucy5waXBVc2VyU2V0dGluZ3NTZXNzaW9uc0NvbnRyb2xsZXI6b25SZW1vdmVcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIENsb3NlcyBwYXNzZWQgc2Vzc2lvbi5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHNlc3Npb24gIFNlc3Npb24gY29uZmlndXJhdGlvbiBvYmplY3RcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVtb3ZlKHNlc3Npb24sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2Vzc2lvbi5pZCA9PT0gJHNjb3BlLnNlc3Npb25JZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciB0aWQgPSAkc2NvcGUudHJhbnNhY3Rpb24uYmVnaW4oJ1JFTU9WSU5HJyk7XHJcbiAgICAgICAgICAgICAgICBwaXBEYXRhU2Vzc2lvbi5yZW1vdmVTZXNzaW9uKFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Vzc2lvbjogc2Vzc2lvblxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnRyYW5zYWN0aW9uLmFib3J0ZWQodGlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zZXNzaW9ucyA9IF8ud2l0aG91dCgkc2NvcGUuc2Vzc2lvbnMsIHNlc3Npb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm1lc3NhZ2UgPSAnRVJST1JfJyArIGVycm9yLnN0YXR1cyB8fCBlcnJvci5kYXRhLnN0YXR1c19jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuIiwiLyoqXHJcbiAqIEBmaWxlIFNldHRpbmdzIHN0cmluZyByZXNvdXJjZXNcclxuICogQGNvcHlyaWdodCBEaWdpdGFsIExpdmluZyBTb2Z0d2FyZSBDb3JwLiAyMDE0LTIwMTZcclxuICovXHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBVc2VyU2V0dGluZ3MuU3RyaW5ncycsIFsncGlwVHJhbnNsYXRlJ10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuY29uZmlnKGZ1bmN0aW9uIChwaXBUcmFuc2xhdGVQcm92aWRlcikge1xyXG5cclxuICAgICAgICAvLyBTZXQgdHJhbnNsYXRpb24gc3RyaW5ncyBmb3IgdGhlIG1vZHVsZVxyXG4gICAgICAgIHBpcFRyYW5zbGF0ZVByb3ZpZGVyLnRyYW5zbGF0aW9ucygnZW4nLCB7XHJcbiAgICAgICAgICAgICdTRVRUSU5HU19USVRMRSc6ICdTZXR0aW5ncycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1RJVExFJzogJ0Jhc2ljIGluZm8nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX1RJVExFJzogJ0FjdGl2ZSBzZXNzaW9ucycsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19GVUxMX05BTUUnOiAnRnVsbCBuYW1lJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fVkVSSUZZX0hJTlQnOiAnUGxlYXNlLCB2ZXJpZnkgeW91ciBlbWFpbCBhZGRyZXNzLicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1ZFUklGWV9DT0RFJzogJ1ZlcmlmeSBlbWFpbCBhZGRyZXNzJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fREFURV9DSEFOR0VfUEFTU1dPUkQnOiAnWW91ciBwYXNzd29yZCB3YXMgY2hhbmdlZCBvbiAnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19DSEFOR0VfUEFTU1dPUkQnOiAnQ2hhbmdlIHlvdXIgcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19OQU1FX0hJTlQnOiAnUGxlYXNlLCB1c2UgeW91ciByZWFsIG5hbWUgdG8gbGV0IG90aGVyIHBlb3BsZSBrbm93IHdobyB5b3UgYXJlLicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1dPUkRTX0FCT1VUX01FJzogJ0ZldyB3b3JkcyBhYm91dCB5b3Vyc2VsZicsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19HRU5ERVInOiAnR2VuZGVyJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fQklSVEhEQVknOiAnQmlydGhkYXknLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19MT0NBVElPTic6ICdDdXJyZW50IGxvY2F0aW9uJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fUFJJTUFSWV9FTUFJTCc6ICdQcmltYXJ5IGVtYWlsJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fRlJPTSc6ICdVc2VyIHNpbmNlICcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1VTRVJfSUQnOiAnVXNlciBJRCcsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX1RJVExFJzogJ0NoYW5nZSBwYXNzd29yZCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfTkVXX1BBU1NXT1JEJzogJ05ldyBwYXNzd29yZCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfUkVQRUFUX1JBU1NXT1JEJzogJ1JlcGVhdCBwYXNzd29yZCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfQ1VSUkVOVF9QQVNTV09SRCc6ICdDdXJyZW50IHBhc3N3b3JkJyxcclxuXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfU1VCVElUTEUnOiAnIElmIHlvdSBub3RpY2UgYW55IHVuZmFtaWxpYXIgZGV2aWNlcyBvciBsb2NhdGlvbnMsIGNsaWNrJyArXHJcbiAgICAgICAgICAgICdcIkNsb3NlIFNlc3Npb25cIiB0byBlbmQgdGhlIHNlc3Npb24uJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OU19DTE9TRV9TRVNTSU9OJzogJ0Nsb3NlIHNlc3Npb24nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX0NMT1NFX0FDVElWRV9TRVNTSU9OUyc6ICdDbG9zZSBhY3RpdmUgc2Vzc2lvbnMnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05fT1MnOiAnT1M6ICcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTl9JUCc6ICdJUDogJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OX0FDVElWRSc6ICdhY3RpdmUnLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JMQUNLTElTVF9USVRMRSc6ICdCbGFja2xpc3QnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkxBQ0tMSVNUX1NVQlRJVExFJzogJ1BhcnRpZXMgZnJvbSBibGFja2xpc3Qgd2lsbCBub3QgYmUgYWJsZSB0byBzZW5kIHlvdSBpbnZpdGF0aW9ucyBhbmQgJyArXHJcbiAgICAgICAgICAgICdwcml2YXRlIG1lc3NhZ2VzLicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CTEFDS0xJU1RfVU5CTE9DSyc6ICdVbmJsb2NrJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JMQUNLTElTVF9FTVBUWSc6ICdZb3UgaGF2ZSBubyBibG9ja2VkIHBhcnRpZXMnLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19USVRMRSc6ICdDb250YWN0IGluZm8nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0VNQUlMJzogJ0VtYWlsJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfRU1BSUwnOiAnQWRkIGVtYWlsJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfUEhPTkUnOiAnQWRkIHBob25lJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfQUREUkVTUyc6ICdBZGQgYWRkcmVzcycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUREX0FDQ09VTlQnOiAnQWRkIGFjY291bnQnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FERF9VUkwnOiAnQWRkIFVSTCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUREUkVTUyc6ICdBZGRyZXNzJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19QSE9ORSc6ICdQaG9uZScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUNDT1VOVF9OQU1FJzogJ0FjY291bnQgbmFtZScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fVVJMJzogJ1VSTCcsXHJcblxyXG4gICAgICAgICAgICAnVEhFTUUnOiAnVGhlbWUnLFxyXG5cclxuICAgICAgICAgICAgJ0hJTlRfUEFTU1dPUkQnOiAnTWluaW11bSA2IGNoYXJhY3RlcnMnLFxyXG4gICAgICAgICAgICAnSElOVF9SRVBFQVRfUEFTU1dPUkQnOiAnUmVwZWF0IHBhc3N3b3JkJyxcclxuXHJcbiAgICAgICAgICAgICdFUlJPUl9XUk9OR19QQVNTV09SRCc6ICdXcm9uZyBwYXNzd29yZCcsXHJcbiAgICAgICAgICAgICdFUlJPUl9JREVOVElDQUxfUEFTU1dPUkRTJzogJ09sZCBhbmQgbmV3IHBhc3N3b3JkcyBhcmUgaWRlbnRpY2FsJyxcclxuICAgICAgICAgICAgJ1JFUEVBVF9QQVNTV09SRF9JTlZBTElEJzogJ1Bhc3N3b3JkIGRvZXMgbm90IG1hdGNoJyxcclxuICAgICAgICAgICAgJ0VSUk9SX0VNQUlMX0lOVkFMSUQnOiAnUGxlYXNlLCBlbnRlciBhIHZhbGlkIGVtYWlsJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBwaXBUcmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ3J1Jywge1xyXG4gICAgICAgICAgICAnU0VUVElOR1NfVElUTEUnOiAn0J3QsNGB0YLRgNC+0LnQutC4JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fVElUTEUnOiAn0J7RgdC90L7QstC90YvQtSDQtNCw0L3QvdGL0LUnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX1RJVExFJzogJ9CQ0LrRgtC40LLQvdGL0LUg0YHQtdGB0YHQuNC4JyxcclxuXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0ZVTExfTkFNRSc6ICfQn9C+0LvQvdC+0LUg0LjQvNGPJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fTkFNRV9ISU5UJzogJ9Cf0L7QttCw0LvRg9C50YHRgtCwLCDQuNGB0L/QvtC70YzQt9GD0LnRgtC1INGA0LXQsNC70YzQvdC+0LUg0LjQvNGPLCDRh9GC0L7QsSDQu9GO0LTQuCDQvNC+0LPQu9C4INCy0LDRgSDRg9C30L3QsNGC0YwnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19WRVJJRllfSElOVCc6ICfQn9C+0LbQsNC70YPQudGB0YLQsCwg0L/QvtC00YLQstC10YDQtNC40YLQtSDQsNC00YDQtdGBINGB0LLQvtC10Lkg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fVkVSSUZZX0NPREUnOiAn0J/QvtC00YLQstC10YDQtNC40YLQtSDQsNC00YDQtdGBINGN0Lsu0L/QvtGH0YLRiycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0RBVEVfQ0hBTkdFX1BBU1NXT1JEJzogJ9CS0LDRiCDQv9Cw0YDQvtC70Ywg0LHRi9C7INC40LfQvNC10L3QtdC9ICcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0NIQU5HRV9QQVNTV09SRCc6ICfQn9C+0LzQtdC90Y/RgtGMINC/0LDRgNC+0LvRjCcsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19XT1JEU19BQk9VVF9NRSc6ICfQndC10YHQutC+0LvRjNC60L4g0YHQu9C+0LIg0L4g0YHQtdCx0LUnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19HRU5ERVInOiAn0J/QvtC7JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fQklSVEhEQVknOiAn0JTQsNGC0LAg0YDQvtC20LTQtdC90LjRjycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0xPQ0FUSU9OJzogJ9Ci0LXQutGD0YnQtdC1INC80LXRgdGC0L7QvdCw0YXQvtC20LTQtdC90LjQtScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1BSSU1BUllfRU1BSUwnOiAn0J7RgdC90L7QstC90L7QuSDQsNC00YDQtdGBINGN0LsuINC/0L7Rh9GC0YsnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19GUk9NJzogJ9Cd0LDRh9C40L3QsNGPINGBJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fVVNFUl9JRCc6ICfQm9C40YfQvdGL0Lkg0LrQvtC0JyxcclxuXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfVElUTEUnOiAn0JjQt9C80LXQvdC40YLRjCDQv9Cw0YDQvtC70YwnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX05FV19QQVNTV09SRCc6ICfQndC+0LLRi9C5INC/0LDRgNC+0LvRjCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfUkVQRUFUX1JBU1NXT1JEJzogJ9Cf0L7QstGC0L7RgCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfQ1VSUkVOVF9QQVNTV09SRCc6ICfQotC10LrRg9GJ0LjQuSDQv9Cw0YDQvtC70YwnLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OU19TVUJUSVRMRSc6ICfQldGB0LvQuCDQstGLINC30LDQvNC10YLQuNC70Lgg0LrQsNC60LjQtS3Qu9C40LHQviDQvdC10LfQvdCw0LrQvtC80YvQtSDRg9GB0YLRgNC+0LnRgdGC0LLQsCDQuNC70LggJyArXHJcbiAgICAgICAgICAgICfQvNC10YHRgtC+0YDQsNGB0L/QvtC70L7QttC10L3QuNC1LCDQvdCw0LbQvNC40YLQtSDQutC90L7Qv9C60YMgXCLQl9Cw0LrQvtC90YfQuNGC0Ywg0YHQtdCw0L3RgVwiLCDRh9GC0L7QsdGLINC30LDQstC10YDRiNC40YLRjCDRgdC10LDQvdGBLicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfQ0xPU0VfU0VTU0lPTic6ICfQl9Cw0LrRgNGL0YLRjCDRgdC10YHRgdC40Y4nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX0NMT1NFX0FDVElWRV9TRVNTSU9OUyc6ICfQl9Cw0LrRgNGL0YLRjCDQsNC60YLQuNCy0L3Ri9C1INGB0LXRgdGB0LjQuCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTl9PUyc6ICfQntChOiAnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05fSVAnOiAnSVA6ICcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTl9BQ1RJVkUnOiAn0JDQutGC0LjQstC90L4nLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JMQUNLTElTVF9USVRMRSc6ICfQkdC70L7QutC40YDQvtCy0LrQuCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CTEFDS0xJU1RfU1VCVElUTEUnOiAn0KPRh9Cw0YHRgtC90LjQutC4INC40Lcg0YfQtdGA0L3QvtCz0L4g0YHQv9C40YHQutCwINC90LUg0YHQvNC+0LPRg9GCJyArXHJcbiAgICAgICAgICAgICcg0L/QvtGB0YvQu9Cw0YLRjCDQstCw0Lwg0L/RgNC40LPQu9Cw0YjQtdC90LjRjyDQuCDQu9C40YfQvdGL0LUg0YHQvtC+0LHRidC10L3QuNGPLicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CTEFDS0xJU1RfVU5CTE9DSyc6ICfQoNCw0LfQsdC70L7QutC40YDQvtCy0LDRgtGMJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JMQUNLTElTVF9FTVBUWSc6ICfQoyDQstCw0YEg0L3QtdGCINC30LDQsdC70L7QutC40YDQvtCy0LDQvdC90YvRhSDRg9GH0LDRgdGC0L3QuNC60L7QsicsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX1RJVExFJzogJ9Ca0L7QvdGC0LDQutGC0YsnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0VNQUlMJzogJ9CQ0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfRU1BSUwnOiAn0JTQvtCx0LDQstC40YLRjCDQsNC00YDQtdGBINGN0LsuINC/0L7Rh9GC0YsnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FERF9QSE9ORSc6ICfQlNC+0LHQsNCy0LjRgtGMINGC0LXQu9C10YTQvtC9JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfQUREUkVTUyc6ICfQlNC+0LHQsNCy0LjRgtGMINCw0LTRgNC10YEnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FERF9BQ0NPVU5UJzogJ9CU0L7QsdCw0LLQuNGC0Ywg0LDQutC60LDRg9C90YInLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FERF9VUkwnOiAn0JTQvtCx0LDQstC40YLRjCDQstC10LEt0YHQsNC50YInLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FERFJFU1MnOiAn0JDQtNGA0LXRgScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fUEhPTkUnOiAn0KLQtdC70LXRhNC+0L0nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FDQ09VTlRfTkFNRSc6ICfQo9GH0LXRgtC60LAg0LIg0LzQtdGB0YHQtdC90LTQttC10YDQtScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fVVJMJzogJ9CS0LXQsSDRgdCw0LnRgicsXHJcblxyXG4gICAgICAgICAgICAnVEhFTUUnOiAn0KLQtdC80LAnLFxyXG5cclxuICAgICAgICAgICAgJ0hJTlRfUEFTU1dPUkQnOiAn0JzQuNC90LjQvNGD0LwgNiDQt9C90LDQutC+0LInLFxyXG4gICAgICAgICAgICAnSElOVF9SRVBFQVRfUEFTU1dPUkQnOiAn0J/QvtCy0YLQvtGA0LjRgtC1INC/0LDRgNC+0LvRjCcsXHJcblxyXG4gICAgICAgICAgICAnRVJST1JfV1JPTkdfUEFTU1dPUkQnOiAn0J3QtdC/0YDQsNCy0LjQu9GM0L3Ri9C5INC/0LDRgNC+0LvRjCcsXHJcbiAgICAgICAgICAgICdFUlJPUl9JREVOVElDQUxfUEFTU1dPUkRTJzogJ9Ch0YLQsNGA0YvQuSDQuCDQvdC+0LLRi9C5INC/0LDRgNC+0LvQuCDQuNC00LXQvdGC0LjRh9C90YsnLFxyXG4gICAgICAgICAgICAnUkVQRUFUX1BBU1NXT1JEX0lOVkFMSUQnOiAn0J/QsNGA0L7Qu9GMINC90LUg0YHQvtCy0L/QsNC00LDQtdGCJyxcclxuICAgICAgICAgICAgJ0VSUk9SX0VNQUlMX0lOVkFMSUQnOiAn0J/QvtC20LDQu9GD0LnRgdGC0LAsINCy0LLQtdC00LjRgtC1INC/0YDQsNCy0LjQu9GM0L3Ri9C5INC/0L7Rh9GCLtCw0LTRgNC10YEnXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSBTZXR0aW5ncyB2ZXJpZnkgZW1haWwgY29udHJvbGxlclxyXG4gKiBAY29weXJpZ2h0IERpZ2l0YWwgTGl2aW5nIFNvZnR3YXJlIENvcnAuIDIwMTQtMjAxNlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVXNlclNldHRpbmdzLlZlcmlmeUVtYWlsJywgW10pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIGNvbnRyb2xsZXJcclxuICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbDpwaXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXJcclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIENvbnRyb2xsZXIgZm9yIHZlcmlmeSBlbWFpbCBkaWFsb2cgcGFuZWwuXHJcbiAgICAgKi9cclxuICAgIHRoaXNNb2R1bGUuY29udHJvbGxlcigncGlwVXNlclNldHRpbmdzVmVyaWZ5RW1haWxDb250cm9sbGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkbWREaWFsb2csIHBpcFRyYW5zYWN0aW9uLCBwaXBGb3JtRXJyb3JzLCBwaXBEYXRhVXNlciwgZW1haWwpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5lbWFpbFZlcmlmaWVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS5kYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgZW1haWw6IGVtYWlsLFxyXG4gICAgICAgICAgICAgICAgY29kZTogJydcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uID0gcGlwVHJhbnNhY3Rpb24oJ3NldHRpbmdzLnZlcmlmeV9lbWFpbCcsICRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAvKiogQHNlZSBvbkFib3J0ICovXHJcbiAgICAgICAgICAgICRzY29wZS5vbkFib3J0ID0gb25BYm9ydDtcclxuICAgICAgICAgICAgLyoqIEBzZWUgb25SZXF1ZXN0VmVyaWZpY2F0aW9uQ2xpY2sqL1xyXG4gICAgICAgICAgICAkc2NvcGUub25SZXF1ZXN0VmVyaWZpY2F0aW9uQ2xpY2sgPSBvblJlcXVlc3RWZXJpZmljYXRpb25DbGljaztcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yc1dpdGhIaW50ID0gcGlwRm9ybUVycm9ycy5lcnJvcnNXaXRoSGludDtcclxuICAgICAgICAgICAgLyoqIEBzZWUgb25WZXJpZnkgKi9cclxuICAgICAgICAgICAgJHNjb3BlLm9uVmVyaWZ5ID0gb25WZXJpZnk7XHJcbiAgICAgICAgICAgIC8qKiBAc2VlIG9uQ2FuY2VsICovXHJcbiAgICAgICAgICAgICRzY29wZS5vbkNhbmNlbCA9IG9uQ2FuY2VsO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbDpwaXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXJcclxuICAgICAgICAgICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLlZlcmlmeUVtYWlsLnBpcFVzZXJTZXR0aW5nc1ZlcmlmeUVtYWlsQ29udHJvbGxlcjpvbkFib3J0XHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBBYm9ydHMgYSB2ZXJpZnkgcmVxdWVzdC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uQWJvcnQoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uYWJvcnQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbDpwaXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXJcclxuICAgICAgICAgICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLlZlcmlmeUVtYWlsLnBpcFVzZXJTZXR0aW5nc1ZlcmlmeUVtYWlsQ29udHJvbGxlcjpvbkNhbmNlbFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogQ2xvc2VzIG9wZW5lZCBkaWFsb2cgcGFuZWwuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkNhbmNlbCgpIHtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5jYW5jZWwoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbDpwaXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXJcclxuICAgICAgICAgICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLlZlcmlmeUVtYWlsLnBpcFVzZXJTZXR0aW5nc1ZlcmlmeUVtYWlsQ29udHJvbGxlcjpvblJlcXVlc3RWZXJpZmljYXRpb25DbGlja1xyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogU2VuZHMgcmVxdWVzdCB0byB2ZXJpZnkgZW50ZXJlZCBlbWFpbC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVxdWVzdFZlcmlmaWNhdGlvbkNsaWNrKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0aWQgPSAkc2NvcGUudHJhbnNhY3Rpb24uYmVnaW4oJ1JlcXVlc3RFbWFpbFZlcmlmaWNhdGlvbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIHBpcERhdGFVc2VyLnJlcXVlc3RFbWFpbFZlcmlmaWNhdGlvbihcclxuICAgICAgICAgICAgICAgICAgICB7fSwgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS50cmFuc2FjdGlvbi5hYm9ydGVkKHRpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbDpwaXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXJcclxuICAgICAgICAgICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLlZlcmlmeUVtYWlsLnBpcFVzZXJTZXR0aW5nc1ZlcmlmeUVtYWlsQ29udHJvbGxlcjpvblZlcmlmeVxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogSW5pdGlhdGVzIHJlcXVlc3Qgb24gdmVyaWZ5IGVtYWlsIG9uIHRoZSBzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvblZlcmlmeSgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLiRzZXRTdWJtaXR0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmZvcm0uJGludmFsaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdGlkID0gJHNjb3BlLnRyYW5zYWN0aW9uLmJlZ2luKCdWZXJpZnlpbmcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwaXBEYXRhVXNlci52ZXJpZnlFbWFpbChcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtYWlsOiAkc2NvcGUuZGF0YS5lbWFpbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogJHNjb3BlLmRhdGEuY29kZVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2ZXJpZnlEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnRyYW5zYWN0aW9uLmFib3J0ZWQodGlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoZXJyb3IpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlwRm9ybUVycm9ycy5zZXRGb3JtRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybSwgZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTEwNjogJ2VtYWlsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxMTAzOiAnY29kZSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3VzZXJfc2V0dGluZ3MvdXNlcl9zZXR0aW5nc19iYXNpY19pbmZvLmh0bWwnLFxuICAgICc8Zm9ybSBuYW1lPVwiZm9ybVwiIGNsYXNzPVwidy1zdHJldGNoXCIgbm92YWxpZGF0ZT1cIlwiPjxtZC1wcm9ncmVzcy1saW5lYXIgY2xhc3M9XCJwaXAtcHJvZ3Jlc3MtdG9wXCIgbmctc2hvdz1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIG1kLW1vZGU9XCJpbmRldGVybWluYXRlXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+PGRpdiBjbGFzcz1cImxheW91dC1yb3cgYm0xMlwiPjxkaXYgY2xhc3M9XCJtZC10aWxlLWxlZnRcIj48cGlwLWF2YXRhci1lZGl0IHBpcC1wYXJ0eS1pZD1cIiRwYXJ0eS5pZFwiIHBpcC1jcmVhdGVkPVwib25QaWN0dXJlQ3JlYXRlZCgkZXZlbnQpXCIgcGlwLWNoYW5nZWQ9XCJvblBpY3R1cmVDaGFuZ2VkKCRjb250cm9sLCAkZXZlbnQpXCI+PC9waXAtYXZhdGFyLWVkaXQ+PC9kaXY+PGRpdiBjbGFzcz1cIm1kLXRpbGUtY29udGVudCB0cDAgbGF5b3V0LWFsaWduLWNlbnRlclwiPjxoMyBjbGFzcz1cInRtMTYgYm04IHRleHQtb25lLWxpbmVcIj57eyBuYW1lQ29weSB9fTwvaDM+PHAgY2xhc3M9XCJ0ZXh0LXByaW1hcnkgdGV4dC1vdmVyZmxvdyBtMFwiPnt7OjpcXCdTRVRUSU5HU19CQVNJQ19JTkZPX0ZST01cXCcgfCB0cmFuc2xhdGV9fSB7eyR1c2VyLnNpZ251cCB8IGZvcm1hdExvbmdEYXRlIH19PC9wPjwvZGl2PjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPjxsYWJlbD57ezo6XFwnU0VUVElOR1NfQkFTSUNfSU5GT19GVUxMX05BTUVcXCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+IDxpbnB1dCBuYW1lPVwiZnVsbE5hbWVcIiBzdGVwPVwiYW55XCIgdHlwZT1cInRleHRcIiB0YWJpbmRleD1cIjBcIiByZXF1aXJlZD1cIlwiIG5nLW1vZGVsPVwiJHBhcnR5Lm5hbWVcIiBuZy1kaXNhYmxlZD1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIG5nLWNoYW5nZT1cIm9uQ2hhbmdlQmFzaWNJbmZvKClcIj48ZGl2IGNsYXNzPVwiaGludFwiIG5nLWlmPVwiZXJyb3JzV2l0aEhpbnQoZm9ybSwgZm9ybS5mdWxsTmFtZSkuaGludFwiPnt7OjpcXCdFUlJPUl9GVUxMTkFNRV9JTlZBTElEXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48L21kLWlucHV0LWNvbnRhaW5lcj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2sgYm0wXCI+PGxhYmVsPnt7OjpcXCdTRVRUSU5HU19CQVNJQ19JTkZPX1BSSU1BUllfRU1BSUxcXCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+IDxpbnB1dCBuYW1lPVwiZW1haWxcIiB0eXBlPVwiZW1haWxcIiByZXF1aXJlZD1cIlwiIG5nLW1vZGVsPVwiJHBhcnR5LmVtYWlsXCIgbmctY2hhbmdlPVwib25DaGFuZ2VCYXNpY0luZm8oKVwiIHBpcC1lbWFpbC11bmlxdWU9XCJ7eyRwYXJ0eS5lbWFpbH19XCI+PGRpdiBjbGFzcz1cImhpbnRcIiBuZy1pZj1cImVycm9yc1dpdGhIaW50KGZvcm0sIGZvcm0uZW1haWwpLmhpbnQgJiYgISR1c2VyLmVtYWlsX3ZlclwiPnt7OjpcXCdTRVRUSU5HU19CQVNJQ19JTkZPX1ZFUklGWV9ISU5UXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2VzPVwiZXJyb3JzV2l0aEhpbnQoZm9ybS5lbWFpbClcIiBuZy1oaWRlPVwiJHBhcnR5LnR5cGUgPT1cXCd0ZWFtXFwnXCI+PGRpdiBuZy1tZXNzYWdlPVwiZW1haWxcIj57ezo6XFwnRVJST1JfRU1BSUxfSU5WQUxJRFxcJyB8IHRyYW5zbGF0ZX19PC9kaXY+PGRpdiBuZy1tZXNzYWdlPVwiZW1haWxVbmlxdWVcIj57ezo6XFwnRVJST1JfRU1BSUxfSU5WQUxJRFxcJyB8IHRyYW5zbGF0ZX19PC9kaXY+PC9kaXY+PC9tZC1pbnB1dC1jb250YWluZXI+PG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXJhaXNlZCBibTE2IHRtOCBybThcIiBuZy1jbGljaz1cIm9uVmVyaWZ5RW1haWwoJGV2ZW50KVwiIG5nLWhpZGU9XCIkdXNlci5lbWFpbF92ZXIgfHwgJHBhcnR5LnR5cGUgPT1cXCd0ZWFtXFwnXCI+e3s6OlxcJ1NFVFRJTkdTX0JBU0lDX0lORk9fVkVSSUZZX0NPREVcXCcgfCB0cmFuc2xhdGV9fTwvbWQtYnV0dG9uPjxtZC1idXR0b24gbmctY2xpY2s9XCJvbkNoYW5nZVBhc3N3b3JkKCRldmVudClcIiBjbGFzcz1cIm1kLXJhaXNlZCBibTE2IHRtOFwiIG5nLWhpZGU9XCIkcGFydHkudHlwZSA9PVxcJ3RlYW1cXCdcIj57ezo6XFwnU0VUVElOR1NfQkFTSUNfSU5GT19DSEFOR0VfUEFTU1dPUkRcXCcgfCB0cmFuc2xhdGV9fTwvbWQtYnV0dG9uPjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9jayBmbGV4XCI+PGxhYmVsPnt7OjpcXCdTRVRUSU5HU19CQVNJQ19JTkZPX1dPUkRTX0FCT1VUX01FXFwnIHwgdHJhbnNsYXRlIH19PC9sYWJlbD4gPHRleHRhcmVhIG5nLW1vZGVsPVwiJHBhcnR5LmFib3V0XCIgY29sdW1ucz1cIjFcIiBuZy1jaGFuZ2U9XCJvbkNoYW5nZUJhc2ljSW5mbygpXCI+PC90ZXh0YXJlYT48L21kLWlucHV0LWNvbnRhaW5lcj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1oaWRlPVwiJHBhcnR5LnR5cGUgPT1cXCd0ZWFtXFwnXCI+PGxhYmVsPnt7OjpcXCdHRU5ERVJcXCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+PG1kLXNlbGVjdCBuZy1tb2RlbD1cIiRwYXJ0eS5nZW5kZXJcIiBuZy1jaGFuZ2U9XCJvbkNoYW5nZUJhc2ljSW5mbygpXCIgcGxhY2Vob2xkZXI9XCJ7e1xcJ0dFTkRFUlxcJyB8IHRyYW5zbGF0ZX19XCI+PG1kLW9wdGlvbiBuZy12YWx1ZT1cImdlbmRlci5pZFwiIG5nLXJlcGVhdD1cImdlbmRlciBpbiBnZW5kZXJzXCI+e3tnZW5kZXIubmFtZX19PC9tZC1vcHRpb24+PC9tZC1zZWxlY3Q+PC9tZC1pbnB1dC1jb250YWluZXI+PGRpdiBuZy1oaWRlPVwiJHBhcnR5LnR5cGUgPT1cXCd0ZWFtXFwnXCI+PHAgY2xhc3M9XCJ0ZXh0LWNhcHRpb24gdGV4dC1ncmV5IHRtMCBibTBcIj57ezo6XFwnU0VUVElOR1NfQkFTSUNfSU5GT19CSVJUSERBWVxcJyB8IHRyYW5zbGF0ZX19PC9wPjxwaXAtZGF0ZSBuZy1tb2RlbD1cIiRwYXJ0eS5iaXJ0aGRheVwiIG5nLWNoYW5nZT1cIm9uQ2hhbmdlQmFzaWNJbmZvKClcIiBwaXAtdGltZS1tb2RlPVwicGFzdCB0aW1lLW1vZGU9XCIgcGFzdFwiPVwiXCI+PC9waXAtZGF0ZT48L2Rpdj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1oaWRlPVwiJHBhcnR5LnR5cGUgPT1cXCd0ZWFtXFwnXCI+PGxhYmVsPnt7OjpcXCdMQU5HVUFHRVxcJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD48bWQtc2VsZWN0IHBsYWNlaG9sZGVyPVwie3tcXCdMQU5HVUFHRVxcJyB8IHRyYW5zbGF0ZX19XCIgbmctbW9kZWw9XCIkdXNlci5sYW5ndWFnZVwiIG5nLWNoYW5nZT1cIm9uQ2hhbmdlVXNlcigpXCI+PG1kLW9wdGlvbiBuZy12YWx1ZT1cImxhbmd1YWdlLmlkXCIgbmctcmVwZWF0PVwibGFuZ3VhZ2UgaW4gbGFuZ3VhZ2VzXCI+e3tsYW5ndWFnZS5uYW1lfX08L21kLW9wdGlvbj48L21kLXNlbGVjdD48L21kLWlucHV0LWNvbnRhaW5lcj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1pZj1cIiRwYXJ0eS50eXBlICE9XFwndGVhbVxcJ1wiPjxsYWJlbD57ezo6XFwnVEhFTUVcXCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+PG1kLXNlbGVjdCBjbGFzcz1cInctc3RyZXRjaCB0aGVtZS10ZXh0LXByaW1hcnlcIiBuZy1tb2RlbD1cIiR1c2VyLnRoZW1lXCIgbmctY2hhbmdlPVwib25DaGFuZ2VVc2VyKClcIiBuZy1kaXNhYmxlZD1cInRyYW5zYWN0aW9uLmJ1c3koKVwiPjxtZC1vcHRpb24gbmctdmFsdWU9XCJ0aGVtZVwiIG5nLXJlcGVhdD1cInRoZW1lIGluIHRoZW1lc1wiIG5nLXNlbGVjdGVkPVwiJHRoZW1lID09IHRoZW1lID8gdHJ1ZSA6IGZhbHNlXCI+e3sgdGhlbWUgfCB0cmFuc2xhdGUgfX08L21kLW9wdGlvbj48L21kLXNlbGVjdD48L21kLWlucHV0LWNvbnRhaW5lcj48cGlwLWxvY2F0aW9uLWVkaXQgY2xhc3M9XCJtYXAtZWRpdCBibTI0LWZsZXhcIiBuZy1oaWRlPVwiJHBhcnR5LnR5cGUgPT1cXCd0ZWFtXFwnXCIgcGlwLWNoYW5nZWQ9XCJvbkNoYW5nZUJhc2ljSW5mbygpXCIgcGlwLWxvY2F0aW9uLW5hbWU9XCIkcGFydHkubG9jX25hbWVcIiBwaXAtbG9jYXRpb24tcG9zPVwibG9jX3Bvc1wiPjwvcGlwLWxvY2F0aW9uLWVkaXQ+PC9mb3JtPicpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd1c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3NfY2hhbmdlX3Bhc3N3b3JkLmh0bWwnLFxuICAgICc8bWQtZGlhbG9nIGNsYXNzPVwicGlwLWRpYWxvZyBsYXlvdXQtY29sdW1uXCIgd2lkdGg9XCI0NDBcIj48Zm9ybSBuYW1lPVwiZm9ybVwiIG5nLXN1Ym1pdD1cIm9uQXBwbHkoKVwiPjxkaXYgY2xhc3M9XCJwaXAtaGVhZGVyXCI+PGgzIGNsYXNzPVwibTBcIj57ezo6XFwnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX1RJVExFXFwnIHwgdHJhbnNsYXRlIDogbW9kdWxlfX08L2gzPjwvZGl2PjxkaXYgY2xhc3M9XCJwaXAtYm9keVwiPjxkaXYgY2xhc3M9XCJwaXAtY29udGVudFwiPjxkaXYgY2xhc3M9XCJ0ZXh0LWVycm9yIGJtOFwiIG5nLW1lc3NhZ2VzPVwiZm9ybS4kc2VydmVyRXJyb3JcIj48ZGl2IG5nLW1lc3NhZ2U9XCJFUlJPUl9VTktOT1dOXCI+e3sgZm9ybS4kc2VydmVyRXJyb3IuRVJST1JfVU5LTk9XTiB8IHRyYW5zbGF0ZSB9fTwvZGl2PjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPjxsYWJlbD57ezo6XFwnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX0NVUlJFTlRfUEFTU1dPUkRcXCcgfCB0cmFuc2xhdGUgfX08L2xhYmVsPiA8aW5wdXQgbmFtZT1cIm9sZFBhc3N3b3JkXCIgdHlwZT1cInBhc3N3b3JkXCIgbmctbW9kZWw9XCJjaGFuZ2VQYXNEYXRhLm9sZF9wYXNzd29yZFwiIG5nLXJlcXVpcmVkPVwiY2hhbmdlX3Bhc3N3b3JkLiRzdWJtaXR0ZWRcIiBwaXAtY2xlYXItZXJyb3JzPVwiXCI+PGRpdiBuZy1tZXNzYWdlcz1cImVycm9yc1dpdGhIaW50KGZvcm0sIGZvcm0ub2xkUGFzc3dvcmQpXCI+PGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj57ezo6XFwnRVJST1JfUkVRVUlSRURcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJFUlJPUl8xMTA3XCI+e3s6OlxcJ0VSUk9SX1dST05HX1BBU1NXT1JEXFwnIHwgdHJhbnNsYXRlIH19PC9kaXY+PC9kaXY+PC9tZC1pbnB1dC1jb250YWluZXI+PG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+PGxhYmVsPnt7XFwnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX05FV19QQVNTV09SRFxcJyB8IHRyYW5zbGF0ZSB9fTwvbGFiZWw+IDxpbnB1dCBuYW1lPVwibmV3UGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiBuZy1tb2RlbD1cImNoYW5nZVBhc0RhdGEubmV3X3Bhc3N3b3JkXCIgbmctY2hhbmdlPVwib25DaGVja1JlcGVhdFBhc3N3b3JkKClcIiBuZy1yZXF1aXJlZD1cImNoYW5nZV9wYXNzd29yZC4kc3VibWl0dGVkXCIgbmctbWlubGVuZ3RoPVwiNlwiIHBpcC1jbGVhci1lcnJvcnM9XCJcIj48ZGl2IGNsYXNzPVwiaGludFwiIG5nLWlmPVwiZXJyb3JzV2l0aEhpbnQoZm9ybSwgZm9ybS5uZXdQYXNzd29yZCkuaGludFwiPnt7IFxcJ0hJTlRfUEFTU1dPUkRcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2VzPVwiZXJyb3JzV2l0aEhpbnQoZm9ybSwgZm9ybS5uZXdQYXNzd29yZClcIj48ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPnt7OjpcXCdFUlJPUl9SRVFVSVJFRFxcJyB8IHRyYW5zbGF0ZX19PC9kaXY+PGRpdiBuZy1tZXNzYWdlPVwibWlubGVuZ3RoXCI+e3s6OlxcJ0hJTlRfUEFTU1dPUkRcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJFUlJPUl8xMTA1XCI+e3s6OlxcJ0VSUk9SX0lERU5USUNBTF9QQVNTV09SRFNcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48L2Rpdj48L21kLWlucHV0LWNvbnRhaW5lcj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj48bGFiZWw+e3sgXFwnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX1JFUEVBVF9SQVNTV09SRFxcJyB8IHRyYW5zbGF0ZSB9fTwvbGFiZWw+IDxpbnB1dCBuYW1lPVwicmVwZWF0XCIgdHlwZT1cInBhc3N3b3JkXCIgbmctbW9kZWw9XCJyZXBlYXRcIiBuZy1jaGFuZ2U9XCJvbkNoZWNrUmVwZWF0UGFzc3dvcmQoKVwiIG5nLXJlcXVpcmVkPVwiY2hhbmdlX3Bhc3N3b3JkLiRzdWJtaXR0ZWRcIiBuZy1taW5sZW5ndGg9XCI2XCI+PGRpdiBjbGFzcz1cImhpbnRcIiBuZy1pZj1cImVycm9yc1JlcGVhdFdpdGhIaW50KGZvcm0ucmVwZWF0KS5oaW50XCI+e3s6OlxcJ0hJTlRfUkVQRUFUX1BBU1NXT1JEXFwnIHwgdHJhbnNsYXRlIH19PC9kaXY+PGRpdiBuZy1tZXNzYWdlcz1cImVycm9yc1JlcGVhdFdpdGhIaW50KGZvcm0ucmVwZWF0KVwiPjxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+e3s6OlxcJ0VSUk9SX1JFUVVJUkVEXFwnIHwgdHJhbnNsYXRlIH19PC9kaXY+PGRpdiBuZy1tZXNzYWdlPVwibWlubGVuZ3RoXCI+e3s6OlxcJ0hJTlRfUEFTU1dPUkRcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJyZXBlYXRcIj57ezo6XFwnUkVQRUFUX1BBU1NXT1JEX0lOVkFMSURcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48L2Rpdj48L21kLWlucHV0LWNvbnRhaW5lcj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwicGlwLWZvb3RlclwiPjxkaXY+PG1kLWJ1dHRvbiBhcmlhLWxhYmVsPVwieHh4XCIgbmctY2xpY2s9XCJvbkNhbmNlbCgpXCI+e3s6OlxcJ0NBTkNFTFxcJyB8IHRyYW5zbGF0ZSB9fTwvbWQtYnV0dG9uPjxtZC1idXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwibWQtYWNjZW50XCIgYXJpYS1sYWJlbD1cInh4eFwiPnt7OjpcXCdBUFBMWVxcJyB8IHRyYW5zbGF0ZSA6IG1vZHVsZX19PC9tZC1idXR0b24+PC9kaXY+PC9kaXY+PC9mb3JtPjwvbWQtZGlhbG9nPicpO1xufV0pO1xufSkoKTtcblxuKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd1c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3Nfc2Vzc2lvbnMuaHRtbCcsXG4gICAgJzxtZC1wcm9ncmVzcy1saW5lYXIgbmctc2hvdz1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIG1kLW1vZGU9XCJpbmRldGVybWluYXRlXCIgY2xhc3M9XCJwaXAtcHJvZ3Jlc3MtdG9wXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+PGRpdiBjbGFzcz1cInBpcC1kZXRhaWxzLXRpdGxlIHBpcC1zZXNzaW9uc1wiPjxwIGNsYXNzPVwicGlwLXRpdGxlIGJtMTZcIj57ezo6XFwnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX1RJVExFXFwnIHwgdHJhbnNsYXRlfX08L3A+PHAgY2xhc3M9XCJwaXAtc3VidGl0bGVcIj57ezo6XFwnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX1NVQlRJVExFXFwnIHwgdHJhbnNsYXRlfX08L3A+PC9kaXY+PG1kLWxpc3QgY2xhc3M9XCJ3LXN0cmV0Y2hcIj48ZGl2IG5nLXJlcGVhdD1cInNlc3Npb24gaW4gc2Vzc2lvbnNcIj48ZGl2IGNsYXNzPVwibGF5b3V0LXJvd1wiIG5nLWluaXQ9XCJzaG93QmxvY2sgPSBzZXNzaW9uLmlkICE9IHNlc3Npb25JZFwiIG5nLWNsaWNrPVwic2hvd0Jsb2NrID0gIXNob3dCbG9ja1wiPjxwIGNsYXNzPVwibTAgdGV4dC1zdWJoZWFkMiB0ZXh0LW92ZXJmbG93IG1heC13NTAtc3RyZXRjaFwiPnt7OjpzZXNzaW9uLmNsaWVudH19PC9wPjxwIGNsYXNzPVwibTAgbHA0IHRleHQtYm9keTEgY29sb3Itc2Vjb25kYXJ5LXRleHQgZmxleFwiPnt7OjpcXCdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTl9BQ1RJVkVcXCcgfCB0cmFuc2xhdGV9fTwvcD48cCBjbGFzcz1cIm0wIHRleHQtYm9keTEgY29sb3Itc2Vjb25kYXJ5LXRleHRcIj57ezo6Y291bnRyeX19PG1kLWljb24gbmctaWY9XCJzaG93QmxvY2tcIiBtZC1zdmctaWNvbj1cImljb25zOnRyaWFuZ2xlLXVwXCI+PC9tZC1pY29uPjxtZC1pY29uIG5nLWlmPVwiIXNob3dCbG9ja1wiIG1kLXN2Zy1pY29uPVwiaWNvbnM6dHJpYW5nbGUtZG93blwiPjwvbWQtaWNvbj48L3A+PC9kaXY+PGRpdiBjbGFzcz1cImxheW91dC1yb3cgYm04IGJwOFwiIG5nLWNsYXNzPVwie1xcJ2RpdmlkZXItYm90dG9tXFwnOiEkbGFzdH1cIj48ZGl2IGNsYXNzPVwiZmxleC01MFwiPjxwIGNsYXNzPVwibTAgYm00IHRleHQtYm9keTEgdGV4dC1vdmVyZmxvdyBjb2xvci1zZWNvbmRhcnktdGV4dFwiPnt7c2Vzc2lvbi5sYXN0X3JlcSB8IGRhdGUgOiBcXCdtZWRpdW1cXCd9fTwvcD48cCBjbGFzcz1cIm0wIGJtNCB0ZXh0LWJvZHkxIHRleHQtb3ZlcmZsb3cgY29sb3Itc2Vjb25kYXJ5LXRleHRcIiBuZy1zaG93PVwic2hvd0Jsb2NrXCI+e3s6OlxcJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OX09TXFwnIHwgdHJhbnNsYXRlfX17ezo6c2Vzc2lvbi5wbGF0Zm9ybX19PC9wPjxwIGNsYXNzPVwibTAgYm00IHRleHQtYm9keTEgdGV4dC1vdmVyZmxvdyBjb2xvci1zZWNvbmRhcnktdGV4dFwiIG5nLXNob3c9XCJzaG93QmxvY2tcIj57ezo6XFwnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05fSVBcXCcgfCB0cmFuc2xhdGV9fXt7OjpzZXNzaW9uLmFkZHJlc3N9fTwvcD48bWQtYnV0dG9uIGNsYXNzPVwibWQtcmFpc2VkXCIgbmctc2hvdz1cInNob3dCbG9jayAmJiBzZXNzaW9uLmlkICE9IHNlc3Npb25JZFwiIG5nLWNsaWNrPVwib25SZW1vdmUoc2Vzc2lvbilcIj57ezo6XFwnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX0NMT1NFX1NFU1NJT05cXCcgfCB0cmFuc2xhdGV9fTwvbWQtYnV0dG9uPjwvZGl2PjxwaXAtbG9jYXRpb24taXAgY2xhc3M9XCJtYXAtZWRpdCBmbGV4LTUwXCIgbmctaWY9XCJzaG93QmxvY2tcIiBwaXAtaXBhZGRyZXNzPVwic2Vzc2lvbi5hZGRyZXNzXCIgcGlwLWV4dHJhLWluZm89XCJjb3VudHJ5ID0gZXh0cmFJbmZvLmNvdW50cnlcIj48L3BpcC1sb2NhdGlvbi1pcD48L2Rpdj48L2Rpdj48L21kLWxpc3Q+PGRpdiBjbGFzcz1cImxheW91dC1yb3cgbGF5b3V0LWFsaWduLWVuZC1jZW50ZXJcIj48bWQtYnV0dG9uIGNsYXNzPVwibWQtcmFpc2VkXCIgbmctc2hvdz1cInNlc3Npb25zLmxlbmd0aCA+IDFcIiBuZy1jbGljaz1cIm9uUmVtb3ZlQWxsKClcIj57ezo6XFwnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX0NMT1NFX0FDVElWRV9TRVNTSU9OU1xcJyB8IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PC9kaXY+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3VzZXJfc2V0dGluZ3MvdXNlcl9zZXR0aW5nc192ZXJpZnlfZW1haWwuaHRtbCcsXG4gICAgJzxtZC1kaWFsb2cgY2xhc3M9XCJwaXAtZGlhbG9nIGxheW91dC1jb2x1bW5cIiB3aWR0aD1cIjQ0MFwiPjxkaXYgY2xhc3M9XCJwaXAtYm9keVwiPjxkaXYgY2xhc3M9XCJwaXAtY29udGVudFwiPjxtZC1wcm9ncmVzcy1saW5lYXIgbmctc2hvdz1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIG1kLW1vZGU9XCJpbmRldGVybWluYXRlXCIgY2xhc3M9XCJwaXAtcHJvZ3Jlc3MtdG9wXCI+PC9tZC1wcm9ncmVzcy1saW5lYXI+PGgyPnt7OjpcXCdWRVJJRllfRU1BSUxfVElUTEVcXCcgfCB0cmFuc2xhdGV9fTwvaDI+PHAgY2xhc3M9XCJ0aXRsZS1wYWRkaW5nXCI+e3s6OlxcJ1ZFUklGWV9FTUFJTF9URVhUXzFcXCcgfCB0cmFuc2xhdGV9fTwvcD48Zm9ybSBuYW1lPVwiZm9ybVwiIG5vdmFsaWRhdGU9XCJcIj48ZGl2IG5nLW1lc3NhZ2VzPVwiZm9ybS4kc2VydmVyRXJyb3JcIiBjbGFzcz1cInRleHQtZXJyb3IgYm04XCI+PGRpdiBuZy1tZXNzYWdlPVwiRVJST1JfVU5LTk9XTlwiPnt7IGZvcm0uJHNlcnZlckVycm9yLkVSUk9SX1VOS05PV04gfCB0cmFuc2xhdGUgfX08L2Rpdj48L2Rpdj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwiZGlzcGxheSBicDQgbWQtYmxvY2tcIj48bGFiZWw+e3s6OlxcJ0VNQUlMXFwnIHwgdHJhbnNsYXRlfX08L2xhYmVsPiA8aW5wdXQgbmFtZT1cImVtYWlsXCIgdHlwZT1cImVtYWlsXCIgbmctbW9kZWw9XCJkYXRhLmVtYWlsXCIgcmVxdWlyZWQ9XCJcIiBzdGVwPVwiYW55XCIgcGlwLWNsZWFyLWVycm9ycz1cIlwiIHRhYmluZGV4PVwiMVwiIG5nLWRpc2FibGVkPVwidHJhbnNhY3Rpb24uYnVzeSgpXCIgcGlwLXRlc3Q9XCJpbnB1dC1lbWFpbFwiPjxkaXYgY2xhc3M9XCJoaW50XCIgbmctaWY9XCJlcnJvcnNXaXRoSGludChmb3JtLCBmb3JtLmVtYWlsKS5oaW50XCI+e3s6OlxcJ0hJTlRfRU1BSUxcXCcgfCB0cmFuc2xhdGV9fTwvZGl2PjxkaXYgbmctbWVzc2FnZXM9XCJlcnJvcnNXaXRoSGludChmb3JtLCBmb3JtLmVtYWlsKVwiIHhuZy1pZj1cIiFmb3JtLmVtYWlsLiRwcmlzdGluZVwiPjxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+e3s6OlxcJ0VSUk9SX0VNQUlMX0lOVkFMSURcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJFUlJPUl8xMTA2XCI+e3s6OlxcJ0VSUk9SX1VTRVJfTk9UX0ZPVU5EXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48L2Rpdj48L21kLWlucHV0LWNvbnRhaW5lcj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj48bGFiZWw+e3s6OlxcJ0VOVFJZX1ZFUklGSUNBVElPTl9DT0RFXFwnIHwgdHJhbnNsYXRlfX08L2xhYmVsPiA8aW5wdXQgbmFtZT1cImNvZGVcIiBuZy1kaXNhYmxlZD1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIHRhYmluZGV4PVwiMFwiIG5nLW1vZGVsPVwiZGF0YS5jb2RlXCIgcmVxdWlyZWQ9XCJcIiBwaXAtY2xlYXItZXJyb3JzPVwiXCI+PGRpdiBuZy1tZXNzYWdlcz1cImVycm9yc1dpdGhIaW50KGZvcm0sIGZvcm0uY29kZSlcIj48ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPnt7OjpcXCdFUlJPUl9DT0RFX0lOVkFMSURcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJFUlJPUl8xMTAzXCI+e3s6OlxcJ0VSUk9SX0NPREVfV1JPTkdcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48L2Rpdj48L21kLWlucHV0LWNvbnRhaW5lcj48cD57ezo6XFwnVkVSSUZZX0VNQUlMX1RFWFRfMjFcXCcgfCB0cmFuc2xhdGV9fSA8YSBuZy1jbGljaz1cIm9uUmVxdWVzdFZlcmlmaWNhdGlvbkNsaWNrKClcIiBjbGFzcz1cInBvaW50ZXJcIiB0YWJpbmRleD1cIjBcIj57ezo6XFwnVkVSSUZZX0VNQUlMX1JFU0VORFxcJyB8IHRyYW5zbGF0ZX19PC9hPiB7ezo6XFwnVkVSSUZZX0VNQUlMX1RFWFRfMjJcXCcgfCB0cmFuc2xhdGV9fTwvcD48L2Zvcm0+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cInBpcC1mb290ZXJcIj48bWQtYnV0dG9uIG5nLWNsaWNrPVwib25DYW5jZWwoKVwiIG5nLWhpZGU9XCJ0cmFuc2FjdGlvbi5idXN5KClcIiBhcmlhLWxhYmVsPVwieHh4XCI+e3s6OlxcJ0NBTkNFTFxcJyB8IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PG1kLWJ1dHRvbiBjbGFzcz1cIm1kLWFjY2VudFwiIG5nLWNsaWNrPVwib25WZXJpZnkoKVwiIG5nLWhpZGU9XCJ0cmFuc2FjdGlvbi5idXN5KClcIiB0YWJpbmRleD1cIjBcIiBhcmlhLWxhYmVsPVwieHh4XCIgbmctZGlzYWJsZWQ9XCJkYXRhLmNvZGUubGVuZ3RoID09IDAgfHwgZGF0YS5lbWFpbC5sZW5ndGggPT0gMCB8fCAoIWRhdGEuZW1haWwgJiYgZm9ybS4kcHJpc3RpbmUpIHx8ICghZGF0YS5jb2RlKVwiPnt7OjpcXCdWRVJJRllcXCcgfCB0cmFuc2xhdGV9fTwvbWQtYnV0dG9uPjxtZC1idXR0b24gY2xhc3M9XCJtZC13YXJuXCIgbmctc2hvdz1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIG5nLWNsaWNrPVwidHJhbnNhY3Rpb24uYWJvcnQoKVwiIHRhYmluZGV4PVwiMFwiIGFyaWEtbGFiZWw9XCJ4eHhcIj57ezo6XFwnQ0FOQ0VMXFwnIHwgdHJhbnNsYXRlfX08L21kLWJ1dHRvbj48L2Rpdj48L21kLWRpYWxvZz4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgnc2V0dGluZ3NfcGFnZS9TZXR0aW5nc1BhZ2UuaHRtbCcsXG4gICAgJzxtZC10b29sYmFyIGNsYXNzPVwicGlwLWFwcGJhci1leHRcIj48L21kLXRvb2xiYXI+PHBpcC1kb2N1bWVudCB3aWR0aD1cIjgwMFwiIG1pbi1oZWlnaHQ9XCI0MDBcIiBjbGFzcz1cInBpcC1zZXR0aW5nc1wiPjxkaXYgY2xhc3M9XCJwaXAtbWVudS1jb250YWluZXJcIiBuZy1oaWRlPVwidm0ubWFuYWdlciA9PT0gZmFsc2UgfHwgIXZtLnRhYnMgfHwgdm0udGFicy5sZW5ndGggPCAxXCI+PG1kLWxpc3QgY2xhc3M9XCJwaXAtbWVudSBwaXAtc2ltcGxlLWxpc3RcIiBwaXAtc2VsZWN0ZWQ9XCJ2bS5zZWxlY3RlZC50YWJJbmRleFwiIHBpcC1zZWxlY3RlZC13YXRjaD1cInZtLnNlbGVjdGVkLm5hdklkXCIgcGlwLXNlbGVjdD1cInZtLm9uTmF2aWdhdGlvblNlbGVjdCgkZXZlbnQuaWQpXCI+PG1kLWxpc3QtaXRlbSBjbGFzcz1cInBpcC1zaW1wbGUtbGlzdC1pdGVtIHBpcC1zZWxlY3RhYmxlIGZsZXhcIiBuZy1yZXBlYXQ9XCJ0YWIgaW4gdm0udGFicyB0cmFjayBieSB0YWIuc3RhdGVcIiBuZy1pZj1cInZtLiRwYXJ0eS5pZCA9PSB2bS4kdXNlci5pZCB8fCB0YWIuc3RhdGUgPT0gXFwnc2V0dGluZ3MuYmFzaWNfaW5mb1xcJ3x8IHRhYi5zdGF0ZSA9PVxcJ3NldHRpbmdzLmNvbnRhY3RfaW5mb1xcJyB8fCB0YWIuc3RhdGUgPT1cXCdzZXR0aW5ncy5ibGFja2xpc3RcXCdcIiBtZC1pbmstcmlwcGxlPVwiXCIgcGlwLWlkPVwie3s6OiB0YWIuc3RhdGUgfX1cIj48cD57ezo6dGFiLnRpdGxlIHwgdHJhbnNsYXRlfX08L3A+PC9tZC1saXN0LWl0ZW0+PC9tZC1saXN0PjxkaXYgY2xhc3M9XCJwaXAtY29udGVudC1jb250YWluZXJcIj48cGlwLWRyb3Bkb3duIHBpcC1hY3Rpb25zPVwidm0udGFic1wiIHBpcC1kcm9wZG93bi1zZWxlY3Q9XCJ2bS5vbkRyb3Bkb3duU2VsZWN0XCIgcGlwLWFjdGl2ZS1pbmRleD1cInZtLnNlbGVjdGVkLnRhYkluZGV4XCI+PC9waXAtZHJvcGRvd24+PGRpdiBjbGFzcz1cInBpcC1ib2R5IHRwMjQtZmxleCBsYXlvdXQtY29sdW1uXCIgdWktdmlldz1cIlwiPjwvZGl2PjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJsYXlvdXQtY29sdW1uIGxheW91dC1hbGlnbi1jZW50ZXItY2VudGVyIGZsZXhcIiBuZy1zaG93PVwidm0ubWFuYWdlciA9PT0gZmFsc2UgfHwgIXZtLnRhYnMgfHwgdm0udGFicy5sZW5ndGggPCAxXCI+e3s6OlxcJ0VSUk9SXzQwMFxcJyB8IHRyYW5zbGF0ZX19PC9kaXY+PC9waXAtZG9jdW1lbnQ+Jyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktc2V0dGluZ3MtaHRtbC5taW4uanMubWFwXG4iXX0=