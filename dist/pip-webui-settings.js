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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvU2V0dGluZ3NNb2R1bGUudHMiLCJzcmMvc2V0dGluZ3MudHMiLCJzcmMvc2V0dGluZ3NfcGFnZS9TZXR0aW5nc1BhZ2VDb250cm9sbGVyLnRzIiwic3JjL3NldHRpbmdzX3BhZ2UvU2V0dGluZ3NQYWdlUm91dGVzLnRzIiwic3JjL3NldHRpbmdzX3BhZ2UvaW5kZXgudHMiLCJzcmMvc2V0dGluZ3Nfc2VydmljZS9TZXR0aW5nc1NlcnZpY2UudHMiLCJzcmMvc2V0dGluZ3Nfc2VydmljZS9pbmRleC50cyIsInNyYy91c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3MudHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX2Jhc2ljX2luZm8udHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX2NoYW5nZV9wYXNzd29yZC50cyIsInNyYy91c2VyX3NldHRpbmdzL3VzZXJfc2V0dGluZ3Nfc2Vzc2lvbnMudHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX3N0cmluZ3MudHMiLCJzcmMvdXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX3ZlcmlmeV9lbWFpbC50cyIsInRlbXAvcGlwLXdlYnVpLXNldHRpbmdzLWh0bWwubWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsWUFBWSxDQUFDO0FBRWIsb0NBQWtDO0FBQ2xDLGlDQUErQjtBQUUvQixPQUFPLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRTtJQUMxQixxQkFBcUI7SUFDckIsa0JBQWtCO0NBQ3JCLENBQUMsQ0FBQzs7QUNISCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUU7UUFDMUIscUJBQXFCO1FBQ3JCLGtCQUFrQjtLQUNyQixDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ1pMLENB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0ICcuL3NldHRpbmdzX3NlcnZpY2UvaW5kZXgnO1xyXG5pbXBvcnQgJy4vc2V0dGluZ3NfcGFnZS9pbmRleCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MnLCBbXHJcbiAgICAncGlwU2V0dGluZ3MuU2VydmljZScsXHJcbiAgICAncGlwU2V0dGluZ3MuUGFnZSdcclxuXSk7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL3NldHRpbmdzX3NlcnZpY2UnO1xyXG5leHBvcnQgKiBmcm9tICcuL3NldHRpbmdzX3BhZ2UnOyIsIu+7vy8qKlxyXG4gKiBAZmlsZSBSZWdpc3RyYXRpb24gb2Ygc2V0dGluZ3MgY29tcG9uZW50c1xyXG4gKiBAY29weXJpZ2h0IERpZ2l0YWwgTGl2aW5nIFNvZnR3YXJlIENvcnAuIDIwMTQtMjAxNlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzJywgW1xyXG4gICAgICAgICdwaXBTZXR0aW5ncy5TZXJ2aWNlJyxcclxuICAgICAgICAncGlwU2V0dGluZ3MuUGFnZSdcclxuICAgIF0pO1xyXG5cclxufSkoKTtcclxuIiwiLy8gUHJldmVudCBqdW5rIGZyb20gZ29pbmcgaW50byB0eXBlc2NyaXB0IGRlZmluaXRpb25zXHJcbigoKSA9PiB7XHJcblxyXG5jbGFzcyBTZXR0aW5nc1BhZ2VDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2xvZzogbmcuSUxvZ1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9xOiBuZy5JUVNlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9zdGF0ZTogbmcudWkuSVN0YXRlU2VydmljZTtcclxuXHJcbiAgICBwdWJsaWMgdGFiczogYW55O1xyXG4gICAgcHVibGljIHNlbGVjdGVkOiBhbnk7XHJcbiAgICBwdWJsaWMgb25Ecm9wZG93blNlbGVjdDogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRsb2c6IG5nLklMb2dTZXJ2aWNlLFxyXG4gICAgICAgICRxOiBuZy5JUVNlcnZpY2UsXHJcbiAgICAgICAgJHN0YXRlOiBuZy51aS5JU3RhdGVTZXJ2aWNlLFxyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UsXHJcbiAgICAgICAgcGlwU2V0dGluZ3MsXHJcbiAgICAgICAgJHJvb3RTY29wZSwgXHJcbiAgICAgICAgJHRpbWVvdXRcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuX2xvZyA9ICRsb2c7XHJcbiAgICAgICAgdGhpcy5fcSA9ICRxO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlID0gJHN0YXRlO1xyXG5cclxuICAgICAgICB0aGlzLnRhYnMgPSBfLmZpbHRlcihwaXBTZXR0aW5ncy5nZXRUYWJzKCksIGZ1bmN0aW9uICh0YWI6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhYi52aXNpYmxlID09PSB0cnVlICYmICh0YWIuYWNjZXNzID8gdGFiLmFjY2Vzcygkcm9vdFNjb3BlLiR1c2VyLCB0YWIpIDogdHJ1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy50YWJzID0gXy5zb3J0QnkodGhpcy50YWJzLCAnaW5kZXgnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHt9O1xyXG4gICAgICAgIGlmICh0aGlzLl9zdGF0ZS5jdXJyZW50Lm5hbWUgIT09ICdzZXR0aW5ncycpIHtcclxuICAgICAgICAgICAgdGhpcy5pbml0U2VsZWN0KHRoaXMuX3N0YXRlLmN1cnJlbnQubmFtZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zdGF0ZS5jdXJyZW50Lm5hbWUgPT09ICdzZXR0aW5ncycgJiYgcGlwU2V0dGluZ3MuZ2V0RGVmYXVsdFRhYigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFNlbGVjdChwaXBTZXR0aW5ncy5nZXREZWZhdWx0VGFiKCkuc3RhdGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwaXBTZXR0aW5ncy5nZXREZWZhdWx0VGFiKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluaXRTZWxlY3QocGlwU2V0dGluZ3MuZ2V0RGVmYXVsdFRhYigpLnN0YXRlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghcGlwU2V0dGluZ3MuZ2V0RGVmYXVsdFRhYigpICYmIHRoaXMudGFicy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5pdFNlbGVjdCh0aGlzLnRhYnNbMF0uc3RhdGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuaWNvbi5zaG93TWVudSgpO1xyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuYnJlYWRjcnVtYi50ZXh0ID0gXCJTZXR0aW5nc1wiO1xyXG4gICAgICAgIHBpcE5hdlNlcnZpY2UuYWN0aW9ucy5oaWRlKCk7XHJcbiAgICAgICAgcGlwTmF2U2VydmljZS5hcHBiYXIucmVtb3ZlU2hhZG93KCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5vbkRyb3Bkb3duU2VsZWN0ID0gKHN0YXRlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25OYXZpZ2F0aW9uU2VsZWN0KHN0YXRlLnN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U2VsZWN0KHN0YXRlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkLnRhYiA9IF8uZmluZCh0aGlzLnRhYnMsIGZ1bmN0aW9uICh0YWI6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YWIuc3RhdGUgPT09IHN0YXRlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZC50YWJJbmRleCA9IF8uaW5kZXhPZih0aGlzLnRhYnMsIHRoaXMuc2VsZWN0ZWQudGFiKTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkLnRhYklkID0gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTmF2aWdhdGlvblNlbGVjdChzdGF0ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5pbml0U2VsZWN0KHN0YXRlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQudGFiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXRlLmdvKHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5QYWdlJylcclxuICAgIC5jb250cm9sbGVyKCdwaXBTZXR0aW5nc1BhZ2VDb250cm9sbGVyJywgU2V0dGluZ3NQYWdlQ29udHJvbGxlcik7XHJcbn0pKCk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gY29uZmlndXJlU2V0dGluZ3NQYWdlUm91dGVzKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnc2V0dGluZ3MnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9zZXR0aW5ncz9wYXJ0eV9pZCcsXHJcbiAgICAgICAgICAgIGF1dGg6IHRydWUsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ3BpcFNldHRpbmdzUGFnZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NldHRpbmdzX3BhZ2UvU2V0dGluZ3NQYWdlLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICBcclxufVxyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlBhZ2UnKVxyXG4gICAgLmNvbmZpZyhjb25maWd1cmVTZXR0aW5nc1BhZ2VSb3V0ZXMpO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuUGFnZScsIFtcclxuICAgICd1aS5yb3V0ZXInLCBcclxuICAgICdwaXBTZXR0aW5ncy5TZXJ2aWNlJyxcclxuICAgICdwaXBOYXYnLCBcclxuICAgICdwaXBTZWxlY3RlZCcsXHJcbiAgICAncGlwVHJhbnNsYXRlJyxcclxuICAgICdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnXHJcbiAgICBdKTtcclxuXHJcblxyXG5pbXBvcnQgJy4vU2V0dGluZ3NQYWdlQ29udHJvbGxlcic7XHJcbmltcG9ydCAnLi9TZXR0aW5nc1BhZ2VSb3V0ZXMnOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR0aW5nc1RhYiB7XHJcbiAgICBwdWJsaWMgc3RhdGU6IHN0cmluZztcclxuICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nO1xyXG4gICAgcHVibGljIGluZGV4OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgYWNjZXNzOiBib29sZWFuO1xyXG4gICAgcHVibGljIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgc3RhdGVDb25maWc6IGFueTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJU2V0dGluZ3NTZXJ2aWNlIHtcclxuICAgIGdldERlZmF1bHRUYWIoKTtcclxuICAgIHNob3dUaXRsZVRleHQgKG5ld1RpdGxlVGV4dCk7XHJcbiAgICBzaG93VGl0bGVMb2dvKG5ld1RpdGxlTG9nbyk7XHJcbiAgICBzaG93TmF2SWNvbih2YWx1ZSk7XHJcbiAgICBnZXRUYWJzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNldHRpbmdzUHJvdmlkZXIgZXh0ZW5kcyBuZy5JU2VydmljZVByb3ZpZGVyIHtcclxuICAgIGdldERlZmF1bHRUYWIoKTtcclxuICAgIGFkZFRhYih0YWJPYmopO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgU2V0dGluZ3NDb25maWcge1xyXG5cclxuICAgIHB1YmxpYyBkZWZhdWx0VGFiOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdGFiczogU2V0dGluZ3NUYWJbXSA9IFtdO1xyXG4gICAgcHVibGljIHRpdGxlVGV4dDogc3RyaW5nID0gJ1NFVFRJTkdTX1RJVExFJztcclxuICAgIHB1YmxpYyB0aXRsZUxvZ286IGJvb2xlYW4gPSBudWxsO1xyXG4gICAgcHVibGljIGlzTmF2SWNvbjogYm9vbGVhbiA9IHRydWU7XHJcblxyXG59XHJcblxyXG5jbGFzcyBTZXR0aW5nc1NlcnZpY2UgaW1wbGVtZW50cyBJU2V0dGluZ3NTZXJ2aWNlIHtcclxuICAgIHByaXZhdGUgX2NvbmZpZzogU2V0dGluZ3NDb25maWc7XHJcbiAgICBwcml2YXRlIF9yb290U2NvcGU6IG5nLklSb290U2NvcGVTZXJ2aWNlO1xyXG5cclxuICAgIHB1YmxpYyBjb25zdHJ1Y3Rvcigkcm9vdFNjb3BlOiBuZy5JUm9vdFNjb3BlU2VydmljZSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnOiBTZXR0aW5nc0NvbmZpZykge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICB0aGlzLl9yb290U2NvcGUgPSAkcm9vdFNjb3BlO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGVmYXVsdFRhYigpIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFRhYjtcclxuICAgICAgICBkZWZhdWx0VGFiID0gXy5maW5kKHRoaXMuX2NvbmZpZy50YWJzLCBmdW5jdGlvbiAocCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcC5zdGF0ZSA9PT0gZGVmYXVsdFRhYjtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gXy5jbG9uZURlZXAoZGVmYXVsdFRhYik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dUaXRsZVRleHQgKG5ld1RpdGxlVGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKG5ld1RpdGxlVGV4dCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVUZXh0ID0gbmV3VGl0bGVUZXh0O1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcudGl0bGVMb2dvID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcudGl0bGVUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzaG93VGl0bGVMb2dvKG5ld1RpdGxlTG9nbykge1xyXG4gICAgICAgIGlmIChuZXdUaXRsZUxvZ28pIHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlTG9nbyA9IG5ld1RpdGxlTG9nbztcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlVGV4dCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnRpdGxlTG9nbztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd05hdkljb24odmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodmFsdWUgIT09IG51bGwgJiYgdmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb25maWcuaXNOYXZJY29uID0gISF2YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb25maWcuaXNOYXZJY29uO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGdldFRhYnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uY2xvbmVEZWVwKHRoaXMuX2NvbmZpZy50YWJzKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFNldHRpbmdzUHJvdmlkZXIgaW1wbGVtZW50cyBJU2V0dGluZ3NQcm92aWRlciB7XHJcbiAgICBwcml2YXRlIF9zZXJ2aWNlOiBTZXR0aW5nc1NlcnZpY2U7XHJcbiAgICBwcml2YXRlIF9jb25maWc6IFNldHRpbmdzQ29uZmlnID0gbmV3IFNldHRpbmdzQ29uZmlnKCk7XHJcbiAgICBwcml2YXRlIF9zdGF0ZVByb3ZpZGVyOiBuZy51aS5JU3RhdGVQcm92aWRlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigkc3RhdGVQcm92aWRlcjogbmcudWkuSVN0YXRlUHJvdmlkZXIpIHtcclxuICAgICAgICB0aGlzLl9zdGF0ZVByb3ZpZGVyID0gJHN0YXRlUHJvdmlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEZ1bGxTdGF0ZU5hbWUoc3RhdGUpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiAnc2V0dGluZ3MuJyArIHN0YXRlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXREZWZhdWx0VGFiKCk6IFNldHRpbmdzVGFiIHtcclxuICAgICAgICB2YXIgZGVmYXVsdFRhYjtcclxuXHJcbiAgICAgICAgZGVmYXVsdFRhYiA9IF8uZmluZCh0aGlzLl9jb25maWcudGFicywgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHAuc3RhdGUgPT09IGRlZmF1bHRUYWI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBfLmNsb25lRGVlcChkZWZhdWx0VGFiKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkVGFiKHRhYk9iaikge1xyXG4gICAgICAgIHZhciBleGlzdGluZ1RhYjogU2V0dGluZ3NUYWI7XHJcblxyXG4gICAgICAgIHRoaXMudmFsaWRhdGVUYWIodGFiT2JqKTtcclxuICAgICAgICBleGlzdGluZ1RhYiA9IF8uZmluZCh0aGlzLl9jb25maWcudGFicywgZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHAuc3RhdGUgPT09ICdzZXR0aW5ncy4nICsgdGFiT2JqLnN0YXRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChleGlzdGluZ1RhYikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYiB3aXRoIHN0YXRlIG5hbWUgXCInICsgdGFiT2JqLnN0YXRlICsgJ1wiIGlzIGFscmVhZHkgcmVnaXN0ZXJlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29uZmlnLnRhYnMucHVzaCh7XHJcbiAgICAgICAgICAgIHN0YXRlOiB0aGlzLmdldEZ1bGxTdGF0ZU5hbWUodGFiT2JqLnN0YXRlKSxcclxuICAgICAgICAgICAgdGl0bGU6IHRhYk9iai50aXRsZSxcclxuICAgICAgICAgICAgaW5kZXg6IHRhYk9iai5pbmRleCB8fCAxMDAwMDAsXHJcbiAgICAgICAgICAgIGFjY2VzczogdGFiT2JqLmFjY2VzcyxcclxuICAgICAgICAgICAgdmlzaWJsZTogdGFiT2JqLnZpc2libGUgIT09IGZhbHNlLFxyXG4gICAgICAgICAgICBzdGF0ZUNvbmZpZzogXy5jbG9uZURlZXAodGFiT2JqLnN0YXRlQ29uZmlnKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3N0YXRlUHJvdmlkZXIuc3RhdGUodGhpcy5nZXRGdWxsU3RhdGVOYW1lKHRhYk9iai5zdGF0ZSksIHRhYk9iai5zdGF0ZUNvbmZpZyk7XHJcblxyXG4gICAgICAgIC8vIGlmIHdlIGp1c3QgYWRkZWQgZmlyc3Qgc3RhdGUgYW5kIG5vIGRlZmF1bHQgc3RhdGUgaXMgc3BlY2lmaWVkXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLl9jb25maWcuZGVmYXVsdFRhYiA9PT0gJ3VuZGVmaW5lZCcgJiYgdGhpcy5fY29uZmlnLnRhYnMubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGVmYXVsdFRhYih0YWJPYmouc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0RGVmYXVsdFRhYihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAvLyBUT0RPIFthcGlkaGlybnlpXSBleHRyYWN0IGV4cHJlc3Npb24gaW5zaWRlICdpZicgaW50byB2YXJpYWJsZS4gSXQgaXNuJ3QgcmVhZGFibGUgbm93LlxyXG4gICAgICAgIGlmICghXy5maW5kKHRoaXMuX2NvbmZpZy50YWJzLCBmdW5jdGlvbiAodGFiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0YWIuc3RhdGUgPT09ICdzZXR0aW5ncy4nICsgbmFtZTtcclxuICAgICAgICB9KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RhYiB3aXRoIHN0YXRlIG5hbWUgXCInICsgbmFtZSArICdcIiBpcyBub3QgcmVnaXN0ZXJlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29uZmlnLmRlZmF1bHRUYWIgPSB0aGlzLmdldEZ1bGxTdGF0ZU5hbWUobmFtZSk7XHJcbiAgICAgICAgLy90aGlzLl9zdGF0ZVByb3ZpZGVyLmdvKHRoaXMuX2NvbmZpZy5kZWZhdWx0VGFiKTtcclxuICAgICAgICAgICAgLy9waXBBdXRoU3RhdGVQcm92aWRlci5yZWRpcmVjdCgnc2V0dGluZ3MnLCBnZXRGdWxsU3RhdGVOYW1lKG5hbWUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZhbGlkYXRlcyBwYXNzZWQgdGFiIGNvbmZpZyBvYmplY3RcclxuICAgICAqIElmIHBhc3NlZCB0YWIgaXMgbm90IHZhbGlkIGl0IHdpbGwgdGhyb3cgYW4gZXJyb3JcclxuICAgICAqL1xyXG5cclxuICAgIHByaXZhdGUgdmFsaWRhdGVUYWIodGFiT2JqOiBTZXR0aW5nc1RhYikge1xyXG4gICAgICAgIGlmICghdGFiT2JqIHx8ICFfLmlzT2JqZWN0KHRhYk9iaikpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRhYk9iai5zdGF0ZSA9PT0gbnVsbCB8fCB0YWJPYmouc3RhdGUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGFiIHNob3VsZCBoYXZlIHZhbGlkIEFuZ3VsYXIgVUkgcm91dGVyIHN0YXRlIG5hbWUnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0YWJPYmouYWNjZXNzICYmICFfLmlzRnVuY3Rpb24odGFiT2JqLmFjY2VzcykpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcImFjY2Vzc1wiIHNob3VsZCBiZSBhIGZ1bmN0aW9uJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRhYk9iai5zdGF0ZUNvbmZpZyB8fCAhXy5pc09iamVjdCh0YWJPYmouc3RhdGVDb25maWcpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdGF0ZSBjb25maWd1cmF0aW9uIG9iamVjdCcpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd1RpdGxlVGV4dCAobmV3VGl0bGVUZXh0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChuZXdUaXRsZVRleHQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlVGV4dCA9IG5ld1RpdGxlVGV4dDtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLnRpdGxlTG9nbyA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLnRpdGxlVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2hvd1RpdGxlTG9nbyhuZXdUaXRsZUxvZ28pIHtcclxuICAgICAgICBpZiAobmV3VGl0bGVMb2dvKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy50aXRsZUxvZ28gPSBuZXdUaXRsZUxvZ287XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbmZpZy50aXRsZVRleHQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZy50aXRsZUxvZ287XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNob3dOYXZJY29uKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29uZmlnLmlzTmF2SWNvbiA9ICEhdmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fY29uZmlnLmlzTmF2SWNvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJGdldCgkcm9vdFNjb3BlLCAkc3RhdGUpIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9zZXJ2aWNlID09IG51bGwpXHJcbiAgICAgICAgICAgIHRoaXMuX3NlcnZpY2UgPSBuZXcgU2V0dGluZ3NTZXJ2aWNlKCRyb290U2NvcGUsIHRoaXMuX2NvbmZpZyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NlcnZpY2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcFNldHRpbmdzLlNlcnZpY2UnKVxyXG4gICAgLnByb3ZpZGVyKCdwaXBTZXR0aW5ncycsIFNldHRpbmdzUHJvdmlkZXIpO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlNlcnZpY2UnLCBbXSk7XHJcblxyXG5pbXBvcnQgJy4vU2V0dGluZ3NTZXJ2aWNlJzsiLCIvKipcclxuICogQGZpbGUgU2V0dGluZ3MgdGFiIGxvZ2ljXHJcbiAqIEBjb3B5cmlnaHQgRGlnaXRhbCBMaXZpbmcgU29mdHdhcmUgQ29ycC4gMjAxNC0yMDE2XHJcbiAqL1xyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwVXNlclNldHRpbmdzJywgW1xyXG4gICAgICAgICduZ01hdGVyaWFsJywgJ3BpcERhdGEnLFxyXG4gICAgICAgICdwaXBTZXR0aW5ncy5TZXJ2aWNlJyxcclxuICAgICAgICAncGlwU2V0dGluZ3MuUGFnZScsXHJcblxyXG4gICAgICAgICdwaXBVc2VyU2V0dGluZ3MuU3RyaW5ncycsXHJcbiAgICAgICAgJ3BpcFVzZXJTZXR0aW5ncy5TZXNzaW9ucycsXHJcbiAgICAgICAgJ3BpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm8nLFxyXG4gICAgICAgICdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnXHJcbiAgICBdKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSBTZXR0aW5ncyBiYXNpYyBpbmZvIGNvbnRyb2xsZXJcclxuICogQGNvcHlyaWdodCBEaWdpdGFsIExpdmluZyBTb2Z0d2FyZSBDb3JwLiAyMDE0LTIwMTZcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm8nLFxyXG4gICAgICAgIFsncGlwVXNlclNldHRpbmdzLkNoYW5nZVBhc3N3b3JkJywgJ3BpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbCcsIFxyXG4gICAgICAgICAgICAncGlwU2V0dGluZ3MuU2VydmljZScsICdwaXBTZXR0aW5ncy5QYWdlJyxdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmNvbmZpZyhmdW5jdGlvbiAocGlwU2V0dGluZ3NQcm92aWRlcikge1xyXG4gICAgICAgIHBpcFNldHRpbmdzUHJvdmlkZXIuYWRkVGFiKHtcclxuICAgICAgICAgICAgc3RhdGU6ICdiYXNpY19pbmZvJyxcclxuICAgICAgICAgICAgaW5kZXg6IDEsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnU0VUVElOR1NfQkFTSUNfSU5GT19USVRMRScsXHJcbiAgICAgICAgICAgIHN0YXRlQ29uZmlnOiB7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICcvYmFzaWNfaW5mbycsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3VzZXJfc2V0dGluZ3MvdXNlcl9zZXR0aW5nc19iYXNpY19pbmZvLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHBpcFNldHRpbmdzUHJvdmlkZXIuc2V0RGVmYXVsdFRhYignYmFzaWNfaW5mbycpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbmdkb2MgY29udHJvbGxlclxyXG4gICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLkJhc2ljSW5mbzpwaXBVc2VyU2V0dGluZ3NCYXNpY0luZm9Db250cm9sbGVyXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBDb250cm9sbGVyIGZvciB0aGUgcHJlZGVmaW5lZCAnYmFzaWNfaW5mbycgc3RhdGUuXHJcbiAgICAgKiBQcm92aWRlcyBzeW5jIGNoYW5nZXMgdXNlcidzIHByb2ZpbGUgd2l0aCByZW1vdGUgcHJvZmlsZS5cclxuICAgICAqIE9uIHN0YXRlIGV4aXQgZXZlcnl0aGluZyBpcyBzYXZlZCBvbiB0aGUgc2VydmVyLlxyXG4gICAgICovXHJcbiAgICB0aGlzTW9kdWxlLmNvbnRyb2xsZXIoJ3BpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRtZERpYWxvZywgJHN0YXRlLCAkd2luZG93LCAkdGltZW91dCwgJG1kVGhlbWluZyxcclxuICAgICAgICAgICAgICAgICAgcGlwVHJhbnNsYXRlLCBwaXBUcmFuc2FjdGlvbiwgcGlwVGhlbWUsXHJcbiAgICAgICAgICAgICAgICAgIHBpcFRvYXN0cywgcGlwRGF0YVVzZXIsIHBpcERhdGFQYXJ0eSwgcGlwRm9ybUVycm9ycykge1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5vcmlnaW5hbFBhcnR5ID0gYW5ndWxhci50b0pzb24oJHJvb3RTY29wZS4kcGFydHkpO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm5hbWVDb3B5ID0gJHJvb3RTY29wZS4kcGFydHkubmFtZTtcclxuXHJcbiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5sb2NfcG9zID0gJHJvb3RTY29wZS4kcGFydHkubG9jX3BvcztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZ2VuZGVycyA9IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGVTZXQoWydtYWxlJywgJ2ZlbWFsZScsICduL3MnXSk7XHJcbiAgICAgICAgICAgICRzY29wZS5sYW5ndWFnZXMgPSBwaXBUcmFuc2xhdGUudHJhbnNsYXRlU2V0KFsncnUnLCAnZW4nXSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24gPSBwaXBUcmFuc2FjdGlvbignc2V0dGluZ3MuYmFzaWNfaW5mbycsICRzY29wZSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudGhlbWVzID0gXy5rZXlzKF8ub21pdCgkbWRUaGVtaW5nLlRIRU1FUywgJ2RlZmF1bHQnKSk7XHJcblxyXG4gICAgICAgICAgICAkc3RhdGUuZ2V0KCdzZXR0aW5ncy5iYXNpY19pbmZvJykub25FeGl0ID0gc2F2ZUNoYW5nZXM7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZXJyb3JzV2l0aEhpbnQgPSBwaXBGb3JtRXJyb3JzLmVycm9yc1dpdGhIaW50O1xyXG4gICAgICAgICAgICAvKiogQHNlZSBvbkNoYW5nZVBhc3N3b3JkICovXHJcbiAgICAgICAgICAgICRzY29wZS5vbkNoYW5nZVBhc3N3b3JkID0gb25DaGFuZ2VQYXNzd29yZDtcclxuICAgICAgICAgICAgLyoqIEBzZWUgb25WZXJpZnlFbWFpbCAqL1xyXG4gICAgICAgICAgICAkc2NvcGUub25WZXJpZnlFbWFpbCA9IG9uVmVyaWZ5RW1haWw7XHJcbiAgICAgICAgICAgIC8qKiBAc2VlIG9uUGljdHVyZUNyZWF0ZWQgKi9cclxuICAgICAgICAgICAgJHNjb3BlLm9uUGljdHVyZUNyZWF0ZWQgPSBvblBpY3R1cmVDcmVhdGVkO1xyXG4gICAgICAgICAgICAvKiogQHNlZSBvblBpY3R1cmVDaGFuZ2VkICovXHJcbiAgICAgICAgICAgICRzY29wZS5vblBpY3R1cmVDaGFuZ2VkID0gb25QaWN0dXJlQ2hhbmdlZDtcclxuICAgICAgICAgICAgLyoqIEBzZWUgdXBkYXRlVXNlciAqL1xyXG4gICAgICAgICAgICAkc2NvcGUub25DaGFuZ2VVc2VyID0gXy5kZWJvdW5jZSh1cGRhdGVVc2VyLCAyMDAwKTtcclxuICAgICAgICAgICAgLyoqIEBzZWUgc2F2ZUNoYW5nZXMgKi9cclxuICAgICAgICAgICAgJHNjb3BlLm9uQ2hhbmdlQmFzaWNJbmZvID0gXy5kZWJvdW5jZShzYXZlQ2hhbmdlcywgMjAwMCk7XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBvblBpY3R1cmVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnBpY3R1cmUuc2F2ZShcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGlwUGFydHlBdmF0YXJVcGRhdGVkJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcihlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25QaWN0dXJlQ3JlYXRlZCgkZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5waWN0dXJlID0gJGV2ZW50LnNlbmRlcjtcclxuICAgICAgICAgICAgICAgICRzY29wZS5waWN0dXJlLnNhdmUoXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3BpcFBhcnR5QXZhdGFyVXBkYXRlZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuQmFzaWNJbmZvOnBpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXJcclxuICAgICAgICAgICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLkJhc2ljSW5mby5waXBVc2VyU2V0dGluZ3NCYXNpY0luZm9Db250cm9sbGVyOm9uQ2hhbmdlQmFzaWNJbmZvXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBTYXZlcyBjaGFuZ2VzIG9udG8gc2VydmVyLlxyXG4gICAgICAgICAgICAgKiBUaGlzIG1ldGhvZCByZXNwb25zZXMgb24gY2hhbmdlIG9mIHRoZSBpbnB1dCBpbmZvcm1hdGlvbi5cclxuICAgICAgICAgICAgICogSXQgaXMgdXBkYXRlZCB1c2VyJ3MgcGFydHkgcHJvZmlsZS4gQWxzbyBpdCB1cGRhdGVzIHVzZXIncyBwcm9maWxlIGluICRyb290U2NvcGUuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBzYXZlQ2hhbmdlcygpIHtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLiRzZXRTdWJtaXR0ZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS4kcGFydHkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRyb290U2NvcGUuJHBhcnR5LnR5cGUgPT09ICdwZXJzb24nICYmICRzY29wZS5mb3JtLiRpbnZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIHRvIGF2b2lkIHVubmVjZXNzYXJ5IHNhdmluZ3NcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRwYXJ0eS5sb2NfcG9zID0gJHNjb3BlLmxvY19wb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnR5ID0gYW5ndWxhci50b0pzb24oJHJvb3RTY29wZS4kcGFydHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFydHkgIT09ICRzY29wZS5vcmlnaW5hbFBhcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0aWQgPSAkc2NvcGUudHJhbnNhY3Rpb24uYmVnaW4oJ1VQREFUSU5HJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaXBEYXRhUGFydHkudXBkYXRlUGFydHkoJHJvb3RTY29wZS4kcGFydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUudHJhbnNhY3Rpb24uYWJvcnRlZCh0aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmVuZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUub3JpZ2luYWxQYXJ0eSA9IHBhcnR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5uYW1lQ29weSA9IGRhdGEubmFtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gU3RyaW5nKCkgKyAnRVJST1JfJyArIGVycm9yLnN0YXR1cyB8fCBlcnJvci5kYXRhLnN0YXR1c19jb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJHBhcnR5ID0gYW5ndWxhci5mcm9tSnNvbigkc2NvcGUub3JpZ2luYWxQYXJ0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm86cGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQmFzaWNJbmZvLnBpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXI6b25DaGFuZ2VVc2VyXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBTYXZlcyBjaGFuZ2VzIG9udG8gc2VydmVyLlxyXG4gICAgICAgICAgICAgKiBUaGlzIG1ldGhvZCByZXNwb25zZXMgb24gY2hhbmdlIG9mIHRoZSB1c2VyJ3MgcHJvZmlsZSBpbmZvcm1hdGlvbi5cclxuICAgICAgICAgICAgICogQWxzbyBpdCB1cGRhdGVzIHVzZXIncyBwcm9maWxlIGluICRyb290U2NvcGUuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGVVc2VyKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpZCA9ICRzY29wZS50cmFuc2FjdGlvbi5iZWdpbignUmVxdWVzdEVtYWlsVmVyaWZpY2F0aW9uJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCRyb290U2NvcGUuJHVzZXIuaWQgPT09ICRyb290U2NvcGUuJHBhcnR5LmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGlwRGF0YVVzZXIudXBkYXRlVXNlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbTogJHJvb3RTY29wZS4kdXNlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS50cmFuc2FjdGlvbi5hYm9ydGVkKHRpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwVHJhbnNsYXRlLnVzZShkYXRhLmxhbmd1YWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJHVzZXIubGFuZ3VhZ2UgPSBkYXRhLmxhbmd1YWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kdXNlci50aGVtZSA9IGRhdGEudGhlbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHJvb3RTY29wZS4kdXNlci50aGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcFRoZW1lLnNldEN1cnJlbnRUaGVtZSgkcm9vdFNjb3BlLiR1c2VyLnRoZW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbi5lbmQoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSA9IFN0cmluZygpICsgJ0VSUk9SXycgKyBlcnJvci5zdGF0dXMgfHwgZXJyb3IuZGF0YS5zdGF0dXNfY29kZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcFRvYXN0cy5zaG93Tm90aWZpY2F0aW9uKHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUobWVzc2FnZSksIG51bGwsIG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5CYXNpY0luZm86cGlwVXNlclNldHRpbmdzQmFzaWNJbmZvQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQmFzaWNJbmZvLnBpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXI6b25DaGFuZ2VQYXNzd29yZFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogSXQgb3BlbnMgYSBkaWFsb2cgcGFuZWwgdG8gY2hhbmdlIHBhc3N3b3JkLlxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgICAgVHJpZ2dlcmVkIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25DaGFuZ2VQYXNzd29yZChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG1lc3NhZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX2NoYW5nZV9wYXNzd29yZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXZlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxzOiB7ZW1haWw6ICRyb290U2NvcGUuJHBhcnR5LmVtYWlsfVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoYW5zd2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbnN3ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBTdHJpbmcoKSArICdSRVNFVF9QV0RfU1VDQ0VTU19URVhUJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcFRvYXN0cy5zaG93Tm90aWZpY2F0aW9uKHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUobWVzc2FnZSksIG51bGwsIG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuQmFzaWNJbmZvOnBpcFVzZXJTZXR0aW5nc0Jhc2ljSW5mb0NvbnRyb2xsZXJcclxuICAgICAgICAgICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLkJhc2ljSW5mby5waXBVc2VyU2V0dGluZ3NCYXNpY0luZm9Db250cm9sbGVyOm9uVmVyaWZ5RW1haWxcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIEl0IG9wZW5zIGEgZGlhbG9nIHBhbmVsIHRvIGNoYW5nZSBwYXNzd29yZC5cclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50ICAgIFRyaWdnZXJlZCBldmVudCBvYmplY3RcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uVmVyaWZ5RW1haWwoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBtZXNzYWdlO1xyXG5cclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3VzZXJfc2V0dGluZ3MvdXNlcl9zZXR0aW5nc192ZXJpZnlfZW1haWwuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ3BpcFVzZXJTZXR0aW5nc1ZlcmlmeUVtYWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGxvY2Fsczoge2VtYWlsOiAkcm9vdFNjb3BlLiRwYXJ0eS5lbWFpbH1cclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGFuc3dlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXNlci5lbWFpbF92ZXIgPSBhbnN3ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbnN3ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2UgPSBTdHJpbmcoKSArICdWRVJJRllfRU1BSUxfU1VDQ0VTU19URVhUJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcFRvYXN0cy5zaG93Tm90aWZpY2F0aW9uKHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUobWVzc2FnZSksIG51bGwsIG51bGwsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQGZpbGUgU2V0dGluZ3MgY2hhbmdlIHBhc3N3b3JkIGNvbnRyb2xsZXJcclxuICogQGNvcHlyaWdodCBEaWdpdGFsIExpdmluZyBTb2Z0d2FyZSBDb3JwLiAyMDE0LTIwMTZcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFVzZXJTZXR0aW5ncy5DaGFuZ2VQYXNzd29yZCcsIFtdKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBjb250cm9sbGVyXHJcbiAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQ6cGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBDb250cm9sbGVyIGZvciBkaWFsb2cgcGFuZWwgb2YgcGFzc3dvcmQgY2hhbmdlLlxyXG4gICAgICovXHJcbiAgICB0aGlzTW9kdWxlLmNvbnRyb2xsZXIoJ3BpcFVzZXJTZXR0aW5nc0NoYW5nZVBhc3N3b3JkQ29udHJvbGxlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJG1kRGlhbG9nLCBlbWFpbCwgcGlwRGF0YVVzZXIsIHBpcFRyYW5zYWN0aW9uLCBwaXBGb3JtRXJyb3JzKSB7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24gPSBwaXBUcmFuc2FjdGlvbignc2V0dGluZ3MuY2hhbmdlX3Bhc3N3b3JkJywgJHNjb3BlKTtcclxuICAgICAgICAgICAgJHNjb3BlLmVycm9yc1JlcGVhdFdpdGhIaW50ID0gZnVuY3Rpb24gKGZvcm0sIGZvcm1QYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnNob3dSZXBlYXRIaW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBpcEZvcm1FcnJvcnMuZXJyb3JzV2l0aEhpbnQoZm9ybSwgZm9ybVBhcnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB7fTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dSZXBlYXRIaW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgJHNjb3BlLmNoYW5nZVBhc0RhdGEgPSB7fTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvcnNXaXRoSGludCA9IHBpcEZvcm1FcnJvcnMuZXJyb3JzV2l0aEhpbnQ7XHJcbiAgICAgICAgICAgICRzY29wZS5vbkNhbmNlbCA9IG9uQ2FuY2VsO1xyXG4gICAgICAgICAgICAkc2NvcGUub25DaGVja1JlcGVhdFBhc3N3b3JkID0gb25DaGVja1JlcGVhdFBhc3N3b3JkO1xyXG4gICAgICAgICAgICAkc2NvcGUub25BcHBseSA9IG9uQXBwbHk7XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICAgICAgICAgKiBAbWV0aG9kT2YgcGlwVXNlclNldHRpbmdzLkNoYW5nZVBhc3N3b3JkOnBpcFVzZXJTZXR0aW5nc0NoYW5nZVBhc3N3b3JkQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQucGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyOm9uQ2FuY2VsXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBDbG9zZXMgb3BlbmVkIGRpYWxvZyBwYW5lbC5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uQ2FuY2VsKCkge1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICAgICAgICAgKiBAbWV0aG9kT2YgcGlwVXNlclNldHRpbmdzLkNoYW5nZVBhc3N3b3JkOnBpcFVzZXJTZXR0aW5nc0NoYW5nZVBhc3N3b3JkQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQucGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyOm9uQ2hlY2tSZXBlYXRQYXNzd29yZFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogVmFsaWRhdGVzIGEgcGFzc3dvcmQgdHlwZWQgaW50byBwYXNzd29yZCBmaWVsZHMuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkNoZWNrUmVwZWF0UGFzc3dvcmQoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmNoYW5nZVBhc0RhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnJlcGVhdCA9PT0gJHNjb3BlLmNoYW5nZVBhc0RhdGEubmV3X3Bhc3N3b3JkIHx8ICRzY29wZS5yZXBlYXQgPT09ICcnIHx8ICEkc2NvcGUucmVwZWF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mb3JtLnJlcGVhdC4kc2V0VmFsaWRpdHkoJ3JlcGVhdCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnJlcGVhdCA9PT0gJHNjb3BlLmNoYW5nZVBhc0RhdGEubmV3X3Bhc3N3b3JkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd1JlcGVhdEhpbnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5zaG93UmVwZWF0SGludCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2hvd1JlcGVhdEhpbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS5yZXBlYXQuJHNldFZhbGlkaXR5KCdyZXBlYXQnLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICAgICAgICAgKiBAbWV0aG9kT2YgcGlwVXNlclNldHRpbmdzLkNoYW5nZVBhc3N3b3JkOnBpcFVzZXJTZXR0aW5nc0NoYW5nZVBhc3N3b3JkQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuQ2hhbmdlUGFzc3dvcmQucGlwVXNlclNldHRpbmdzQ2hhbmdlUGFzc3dvcmRDb250cm9sbGVyOm9uQXBwbHlcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIEFwcHJvdmVzIHBhc3N3b3JkIGNoYW5nZSBhbmQgc2VuZHMgcmVxdWVzdCB0byB0aGUgc2VydmVyIG9uIHBhc3N3b3JkIGNoYW5nZS5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uQXBwbHkoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUub25DaGVja1JlcGVhdFBhc3N3b3JkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5mb3JtLiRpbnZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghJHNjb3BlLnRyYW5zYWN0aW9uLmJlZ2luKCdDSEFOR0VfUEFTU1dPUkQnKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY2hhbmdlUGFzRGF0YS5lbWFpbCA9IGVtYWlsO1xyXG5cclxuICAgICAgICAgICAgICAgIHBpcERhdGFVc2VyLmNoYW5nZVBhc3N3b3JkKFxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jaGFuZ2VQYXNEYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGlwRm9ybUVycm9ycy5zZXRGb3JtRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybSwgZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTEwNzogJ29sZFBhc3N3b3JkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxMTA1OiAnbmV3UGFzc3dvcmQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQGZpbGUgU2V0dGluZ3Mgc2Vzc2lvbnMgY29udHJvbGxlclxyXG4gKiBAY29weXJpZ2h0IERpZ2l0YWwgTGl2aW5nIFNvZnR3YXJlIENvcnAuIDIwMTQtMjAxNlxyXG4gKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVXNlclNldHRpbmdzLlNlc3Npb25zJywgW1xyXG4gICAgICAgICdwaXBTZXR0aW5ncy5TZXJ2aWNlJywgJ3BpcFNldHRpbmdzLlBhZ2UnLF0pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuY29uZmlnKGZ1bmN0aW9uIChwaXBTZXR0aW5nc1Byb3ZpZGVyLCBwaXBEYXRhU2Vzc2lvblByb3ZpZGVyKSB7XHJcbiAgICAgICAgcGlwU2V0dGluZ3NQcm92aWRlci5hZGRUYWIoe1xyXG4gICAgICAgICAgICBzdGF0ZTogJ3Nlc3Npb25zJyxcclxuICAgICAgICAgICAgaW5kZXg6IDMsXHJcbiAgICAgICAgICAgIHRpdGxlOiAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX1RJVExFJyxcclxuICAgICAgICAgICAgc3RhdGVDb25maWc6IHtcclxuICAgICAgICAgICAgICAgIHVybDogJy9zZXNzaW9ucycsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAncGlwVXNlclNldHRpbmdzU2Vzc2lvbnNDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX3Nlc3Npb25zLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uczogcGlwRGF0YVNlc3Npb25Qcm92aWRlci5yZWFkU2Vzc2lvbnNSZXNvbHZlcixcclxuICAgICAgICAgICAgICAgICAgICBzZXNzaW9uSWQ6IHBpcERhdGFTZXNzaW9uUHJvdmlkZXIucmVhZFNlc3Npb25JZFJlc29sdmVyXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG5nZG9jIGNvbnRyb2xsZXJcclxuICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5TZXNzaW9uczpwaXBVc2VyU2V0dGluZ3NTZXNzaW9uc0NvbnRyb2xsZXJcclxuICAgICAqXHJcbiAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAqIENvbnRyb2xsZXIgcHJvdmlkZXMgYW4gaW50ZXJmYWNlIGZvciBtYW5hZ2luZyBhY3RpdmUgc2Vzc2lvbnMuXHJcbiAgICAgKi9cclxuICAgIHRoaXNNb2R1bGUuY29udHJvbGxlcigncGlwVXNlclNldHRpbmdzU2Vzc2lvbnNDb250cm9sbGVyJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBwaXBUcmFuc2FjdGlvbiwgcGlwRGF0YVNlc3Npb24sIHNlc3Npb25zLCBzZXNzaW9uSWQpIHtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZXNzaW9uSWQgPSBzZXNzaW9uSWQ7XHJcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbiA9IHBpcFRyYW5zYWN0aW9uKCdzZXR0aW5ncy5zZXNzaW9ucycsICRzY29wZSk7XHJcbiAgICAgICAgICAgICRzY29wZS5zZXNzaW9ucyA9IHNlc3Npb25zO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9uUmVtb3ZlQWxsID0gb25SZW1vdmVBbGw7XHJcbiAgICAgICAgICAgICRzY29wZS5vblJlbW92ZSA9IG9uUmVtb3ZlO1xyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEBuZ2RvYyBtZXRob2RcclxuICAgICAgICAgICAgICogQG1ldGhvZE9mIHBpcFVzZXJTZXR0aW5ncy5TZXNzaW9uczpwaXBVc2VyU2V0dGluZ3NTZXNzaW9uc0NvbnRyb2xsZXJcclxuICAgICAgICAgICAgICogQG5hbWUgcGlwVXNlclNldHRpbmdzLlNlc3Npb25zLnBpcFVzZXJTZXR0aW5nc1Nlc3Npb25zQ29udHJvbGxlcjpvblJlbW92ZUFsbFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogQ2xvc2VzIGFsbCBhY3RpdmUgc2Vzc2lvbi5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVtb3ZlQWxsKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpZCA9ICRzY29wZS50cmFuc2FjdGlvbi5iZWdpbignUkVNT1ZJTkcnKTtcclxuXHJcbiAgICAgICAgICAgICAgICBhc3luYy5lYWNoU2VyaWVzKFxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zZXNzaW9ucyxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoc2Vzc2lvbjogYW55LCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2Vzc2lvbi5pZCA9PSAkc2NvcGUuc2Vzc2lvbklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlwRGF0YVNlc3Npb24ucmVtb3ZlU2Vzc2lvbihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb246IHNlc3Npb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNlc3Npb25zID0gXy53aXRob3V0KCRzY29wZS5zZXNzaW9ucywgc2Vzc2lvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS50cmFuc2FjdGlvbi5hYm9ydGVkKHRpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7ICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogQG5nZG9jIG1ldGhvZFxyXG4gICAgICAgICAgICAgKiBAbWV0aG9kT2YgcGlwVXNlclNldHRpbmdzLlNlc3Npb25zOnBpcFVzZXJTZXR0aW5nc1Nlc3Npb25zQ29udHJvbGxlclxyXG4gICAgICAgICAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuU2Vzc2lvbnMucGlwVXNlclNldHRpbmdzU2Vzc2lvbnNDb250cm9sbGVyOm9uUmVtb3ZlXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICAgKiBDbG9zZXMgcGFzc2VkIHNlc3Npb24uXHJcbiAgICAgICAgICAgICAqXHJcbiAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBzZXNzaW9uICBTZXNzaW9uIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlbW92ZShzZXNzaW9uLCBjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlc3Npb24uaWQgPT09ICRzY29wZS5zZXNzaW9uSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgdGlkID0gJHNjb3BlLnRyYW5zYWN0aW9uLmJlZ2luKCdSRU1PVklORycpO1xyXG4gICAgICAgICAgICAgICAgcGlwRGF0YVNlc3Npb24ucmVtb3ZlU2Vzc2lvbihcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlc3Npb246IHNlc3Npb25cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS50cmFuc2FjdGlvbi5hYm9ydGVkKHRpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc2Vzc2lvbnMgPSBfLndpdGhvdXQoJHNjb3BlLnNlc3Npb25zLCBzZXNzaW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmVuZChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5tZXNzYWdlID0gJ0VSUk9SXycgKyBlcnJvci5zdGF0dXMgfHwgZXJyb3IuZGF0YS5zdGF0dXNfY29kZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSBTZXR0aW5ncyBzdHJpbmcgcmVzb3VyY2VzXHJcbiAqIEBjb3B5cmlnaHQgRGlnaXRhbCBMaXZpbmcgU29mdHdhcmUgQ29ycC4gMjAxNC0yMDE2XHJcbiAqL1xyXG5cclxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVXNlclNldHRpbmdzLlN0cmluZ3MnLCBbJ3BpcFRyYW5zbGF0ZSddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmNvbmZpZyhmdW5jdGlvbiAocGlwVHJhbnNsYXRlUHJvdmlkZXIpIHtcclxuXHJcbiAgICAgICAgLy8gU2V0IHRyYW5zbGF0aW9uIHN0cmluZ3MgZm9yIHRoZSBtb2R1bGVcclxuICAgICAgICBwaXBUcmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2VuJywge1xyXG4gICAgICAgICAgICAnU0VUVElOR1NfVElUTEUnOiAnU2V0dGluZ3MnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19USVRMRSc6ICdCYXNpYyBpbmZvJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OU19USVRMRSc6ICdBY3RpdmUgc2Vzc2lvbnMnLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fRlVMTF9OQU1FJzogJ0Z1bGwgbmFtZScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1ZFUklGWV9ISU5UJzogJ1BsZWFzZSwgdmVyaWZ5IHlvdXIgZW1haWwgYWRkcmVzcy4nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19WRVJJRllfQ09ERSc6ICdWZXJpZnkgZW1haWwgYWRkcmVzcycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0RBVEVfQ0hBTkdFX1BBU1NXT1JEJzogJ1lvdXIgcGFzc3dvcmQgd2FzIGNoYW5nZWQgb24gJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fQ0hBTkdFX1BBU1NXT1JEJzogJ0NoYW5nZSB5b3VyIHBhc3N3b3JkJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fTkFNRV9ISU5UJzogJ1BsZWFzZSwgdXNlIHlvdXIgcmVhbCBuYW1lIHRvIGxldCBvdGhlciBwZW9wbGUga25vdyB3aG8geW91IGFyZS4nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19XT1JEU19BQk9VVF9NRSc6ICdGZXcgd29yZHMgYWJvdXQgeW91cnNlbGYnLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fR0VOREVSJzogJ0dlbmRlcicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0JJUlRIREFZJzogJ0JpcnRoZGF5JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fTE9DQVRJT04nOiAnQ3VycmVudCBsb2NhdGlvbicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1BSSU1BUllfRU1BSUwnOiAnUHJpbWFyeSBlbWFpbCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0ZST00nOiAnVXNlciBzaW5jZSAnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19VU0VSX0lEJzogJ1VzZXIgSUQnLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NIQU5HRV9QQVNTV09SRF9USVRMRSc6ICdDaGFuZ2UgcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX05FV19QQVNTV09SRCc6ICdOZXcgcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX1JFUEVBVF9SQVNTV09SRCc6ICdSZXBlYXQgcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX0NVUlJFTlRfUEFTU1dPUkQnOiAnQ3VycmVudCBwYXNzd29yZCcsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX1NVQlRJVExFJzogJyBJZiB5b3Ugbm90aWNlIGFueSB1bmZhbWlsaWFyIGRldmljZXMgb3IgbG9jYXRpb25zLCBjbGljaycgK1xyXG4gICAgICAgICAgICAnXCJDbG9zZSBTZXNzaW9uXCIgdG8gZW5kIHRoZSBzZXNzaW9uLicsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfQ0xPU0VfU0VTU0lPTic6ICdDbG9zZSBzZXNzaW9uJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OU19DTE9TRV9BQ1RJVkVfU0VTU0lPTlMnOiAnQ2xvc2UgYWN0aXZlIHNlc3Npb25zJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OX09TJzogJ09TOiAnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05fSVAnOiAnSVA6ICcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTl9BQ1RJVkUnOiAnYWN0aXZlJyxcclxuXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CTEFDS0xJU1RfVElUTEUnOiAnQmxhY2tsaXN0JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JMQUNLTElTVF9TVUJUSVRMRSc6ICdQYXJ0aWVzIGZyb20gYmxhY2tsaXN0IHdpbGwgbm90IGJlIGFibGUgdG8gc2VuZCB5b3UgaW52aXRhdGlvbnMgYW5kICcgK1xyXG4gICAgICAgICAgICAncHJpdmF0ZSBtZXNzYWdlcy4nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkxBQ0tMSVNUX1VOQkxPQ0snOiAnVW5ibG9jaycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CTEFDS0xJU1RfRU1QVFknOiAnWW91IGhhdmUgbm8gYmxvY2tlZCBwYXJ0aWVzJyxcclxuXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fVElUTEUnOiAnQ29udGFjdCBpbmZvJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19FTUFJTCc6ICdFbWFpbCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUREX0VNQUlMJzogJ0FkZCBlbWFpbCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUREX1BIT05FJzogJ0FkZCBwaG9uZScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUREX0FERFJFU1MnOiAnQWRkIGFkZHJlc3MnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FERF9BQ0NPVU5UJzogJ0FkZCBhY2NvdW50JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfVVJMJzogJ0FkZCBVUkwnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FERFJFU1MnOiAnQWRkcmVzcycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fUEhPTkUnOiAnUGhvbmUnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX0FDQ09VTlRfTkFNRSc6ICdBY2NvdW50IG5hbWUnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX1VSTCc6ICdVUkwnLFxyXG5cclxuICAgICAgICAgICAgJ1RIRU1FJzogJ1RoZW1lJyxcclxuXHJcbiAgICAgICAgICAgICdISU5UX1BBU1NXT1JEJzogJ01pbmltdW0gNiBjaGFyYWN0ZXJzJyxcclxuICAgICAgICAgICAgJ0hJTlRfUkVQRUFUX1BBU1NXT1JEJzogJ1JlcGVhdCBwYXNzd29yZCcsXHJcblxyXG4gICAgICAgICAgICAnRVJST1JfV1JPTkdfUEFTU1dPUkQnOiAnV3JvbmcgcGFzc3dvcmQnLFxyXG4gICAgICAgICAgICAnRVJST1JfSURFTlRJQ0FMX1BBU1NXT1JEUyc6ICdPbGQgYW5kIG5ldyBwYXNzd29yZHMgYXJlIGlkZW50aWNhbCcsXHJcbiAgICAgICAgICAgICdSRVBFQVRfUEFTU1dPUkRfSU5WQUxJRCc6ICdQYXNzd29yZCBkb2VzIG5vdCBtYXRjaCcsXHJcbiAgICAgICAgICAgICdFUlJPUl9FTUFJTF9JTlZBTElEJzogJ1BsZWFzZSwgZW50ZXIgYSB2YWxpZCBlbWFpbCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcGlwVHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdydScsIHtcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX1RJVExFJzogJ9Cd0LDRgdGC0YDQvtC50LrQuCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1RJVExFJzogJ9Ce0YHQvdC+0LLQvdGL0LUg0LTQsNC90L3Ri9C1JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OU19USVRMRSc6ICfQkNC60YLQuNCy0L3Ri9C1INGB0LXRgdGB0LjQuCcsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19GVUxMX05BTUUnOiAn0J/QvtC70L3QvtC1INC40LzRjycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX05BTUVfSElOVCc6ICfQn9C+0LbQsNC70YPQudGB0YLQsCwg0LjRgdC/0L7Qu9GM0LfRg9C50YLQtSDRgNC10LDQu9GM0L3QvtC1INC40LzRjywg0YfRgtC+0LEg0LvRjtC00Lgg0LzQvtCz0LvQuCDQstCw0YEg0YPQt9C90LDRgtGMJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fVkVSSUZZX0hJTlQnOiAn0J/QvtC20LDQu9GD0LnRgdGC0LAsINC/0L7QtNGC0LLQtdGA0LTQuNGC0LUg0LDQtNGA0LXRgSDRgdCy0L7QtdC5INGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1ZFUklGWV9DT0RFJzogJ9Cf0L7QtNGC0LLQtdGA0LTQuNGC0LUg0LDQtNGA0LXRgSDRjdC7LtC/0L7Rh9GC0YsnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19EQVRFX0NIQU5HRV9QQVNTV09SRCc6ICfQktCw0Ygg0L/QsNGA0L7Qu9GMINCx0YvQuyDQuNC30LzQtdC90LXQvSAnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19DSEFOR0VfUEFTU1dPUkQnOiAn0J/QvtC80LXQvdGP0YLRjCDQv9Cw0YDQvtC70YwnLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fV09SRFNfQUJPVVRfTUUnOiAn0J3QtdGB0LrQvtC70YzQutC+INGB0LvQvtCyINC+INGB0LXQsdC1JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fR0VOREVSJzogJ9Cf0L7QuycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX0JJUlRIREFZJzogJ9CU0LDRgtCwINGA0L7QttC00LXQvdC40Y8nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19MT0NBVElPTic6ICfQotC10LrRg9GJ0LXQtSDQvNC10YHRgtC+0L3QsNGF0L7QttC00LXQvdC40LUnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkFTSUNfSU5GT19QUklNQVJZX0VNQUlMJzogJ9Ce0YHQvdC+0LLQvdC+0Lkg0LDQtNGA0LXRgSDRjdC7LiDQv9C+0YfRgtGLJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0JBU0lDX0lORk9fRlJPTSc6ICfQndCw0YfQuNC90LDRjyDRgScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CQVNJQ19JTkZPX1VTRVJfSUQnOiAn0JvQuNGH0L3Ri9C5INC60L7QtCcsXHJcblxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX1RJVExFJzogJ9CY0LfQvNC10L3QuNGC0Ywg0L/QsNGA0L7Qu9GMJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NIQU5HRV9QQVNTV09SRF9ORVdfUEFTU1dPUkQnOiAn0J3QvtCy0YvQuSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX1JFUEVBVF9SQVNTV09SRCc6ICfQn9C+0LLRgtC+0YAnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ0hBTkdFX1BBU1NXT1JEX0NVUlJFTlRfUEFTU1dPUkQnOiAn0KLQtdC60YPRidC40Lkg0L/QsNGA0L7Qu9GMJyxcclxuXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfU1VCVElUTEUnOiAn0JXRgdC70Lgg0LLRiyDQt9Cw0LzQtdGC0LjQu9C4INC60LDQutC40LUt0LvQuNCx0L4g0L3QtdC30L3QsNC60L7QvNGL0LUg0YPRgdGC0YDQvtC50YHRgtCy0LAg0LjQu9C4ICcgK1xyXG4gICAgICAgICAgICAn0LzQtdGB0YLQvtGA0LDRgdC/0L7Qu9C+0LbQtdC90LjQtSwg0L3QsNC20LzQuNGC0LUg0LrQvdC+0L/QutGDIFwi0JfQsNC60L7QvdGH0LjRgtGMINGB0LXQsNC90YFcIiwg0YfRgtC+0LHRiyDQt9Cw0LLQtdGA0YjQuNGC0Ywg0YHQtdCw0L3RgS4nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05TX0NMT1NFX1NFU1NJT04nOiAn0JfQsNC60YDRi9GC0Ywg0YHQtdGB0YHQuNGOJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OU19DTE9TRV9BQ1RJVkVfU0VTU0lPTlMnOiAn0JfQsNC60YDRi9GC0Ywg0LDQutGC0LjQstC90YvQtSDRgdC10YHRgdC40LgnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05fT1MnOiAn0J7QoTogJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OX0lQJzogJ0lQOiAnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05fQUNUSVZFJzogJ9CQ0LrRgtC40LLQvdC+JyxcclxuXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CTEFDS0xJU1RfVElUTEUnOiAn0JHQu9C+0LrQuNGA0L7QstC60LgnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkxBQ0tMSVNUX1NVQlRJVExFJzogJ9Cj0YfQsNGB0YLQvdC40LrQuCDQuNC3INGH0LXRgNC90L7Qs9C+INGB0L/QuNGB0LrQsCDQvdC1INGB0LzQvtCz0YPRgicgK1xyXG4gICAgICAgICAgICAnINC/0L7RgdGL0LvQsNGC0Ywg0LLQsNC8INC/0YDQuNCz0LvQsNGI0LXQvdC40Y8g0Lgg0LvQuNGH0L3Ri9C1INGB0L7QvtCx0YnQtdC90LjRjy4nLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQkxBQ0tMSVNUX1VOQkxPQ0snOiAn0KDQsNC30LHQu9C+0LrQuNGA0L7QstCw0YLRjCcsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19CTEFDS0xJU1RfRU1QVFknOiAn0KMg0LLQsNGBINC90LXRgiDQt9Cw0LHQu9C+0LrQuNGA0L7QstCw0L3QvdGL0YUg0YPRh9Cw0YHRgtC90LjQutC+0LInLFxyXG5cclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19USVRMRSc6ICfQmtC+0L3RgtCw0LrRgtGLJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19FTUFJTCc6ICfQkNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRiycsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUREX0VNQUlMJzogJ9CU0L7QsdCw0LLQuNGC0Ywg0LDQtNGA0LXRgSDRjdC7LiDQv9C+0YfRgtGLJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfUEhPTkUnOiAn0JTQvtCx0LDQstC40YLRjCDRgtC10LvQtdGE0L7QvScsXHJcbiAgICAgICAgICAgICdTRVRUSU5HU19DT05UQUNUX0lORk9fQUREX0FERFJFU1MnOiAn0JTQvtCx0LDQstC40YLRjCDQsNC00YDQtdGBJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfQUNDT1VOVCc6ICfQlNC+0LHQsNCy0LjRgtGMINCw0LrQutCw0YPQvdGCJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERfVVJMJzogJ9CU0L7QsdCw0LLQuNGC0Ywg0LLQtdCxLdGB0LDQudGCJyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BRERSRVNTJzogJ9CQ0LTRgNC10YEnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX1BIT05FJzogJ9Ci0LXQu9C10YTQvtC9JyxcclxuICAgICAgICAgICAgJ1NFVFRJTkdTX0NPTlRBQ1RfSU5GT19BQ0NPVU5UX05BTUUnOiAn0KPRh9C10YLQutCwINCyINC80LXRgdGB0LXQvdC00LbQtdGA0LUnLFxyXG4gICAgICAgICAgICAnU0VUVElOR1NfQ09OVEFDVF9JTkZPX1VSTCc6ICfQktC10LEg0YHQsNC50YInLFxyXG5cclxuICAgICAgICAgICAgJ1RIRU1FJzogJ9Ci0LXQvNCwJyxcclxuXHJcbiAgICAgICAgICAgICdISU5UX1BBU1NXT1JEJzogJ9Cc0LjQvdC40LzRg9C8IDYg0LfQvdCw0LrQvtCyJyxcclxuICAgICAgICAgICAgJ0hJTlRfUkVQRUFUX1BBU1NXT1JEJzogJ9Cf0L7QstGC0L7RgNC40YLQtSDQv9Cw0YDQvtC70YwnLFxyXG5cclxuICAgICAgICAgICAgJ0VSUk9SX1dST05HX1BBU1NXT1JEJzogJ9Cd0LXQv9GA0LDQstC40LvRjNC90YvQuSDQv9Cw0YDQvtC70YwnLFxyXG4gICAgICAgICAgICAnRVJST1JfSURFTlRJQ0FMX1BBU1NXT1JEUyc6ICfQodGC0LDRgNGL0Lkg0Lgg0L3QvtCy0YvQuSDQv9Cw0YDQvtC70Lgg0LjQtNC10L3RgtC40YfQvdGLJyxcclxuICAgICAgICAgICAgJ1JFUEVBVF9QQVNTV09SRF9JTlZBTElEJzogJ9Cf0LDRgNC+0LvRjCDQvdC1INGB0L7QstC/0LDQtNCw0LXRgicsXHJcbiAgICAgICAgICAgICdFUlJPUl9FTUFJTF9JTlZBTElEJzogJ9Cf0L7QttCw0LvRg9C50YHRgtCwLCDQstCy0LXQtNC40YLQtSDQv9GA0LDQstC40LvRjNC90YvQuSDQv9C+0YfRgi7QsNC00YDQtdGBJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvKipcclxuICogQGZpbGUgU2V0dGluZ3MgdmVyaWZ5IGVtYWlsIGNvbnRyb2xsZXJcclxuICogQGNvcHlyaWdodCBEaWdpdGFsIExpdmluZyBTb2Z0d2FyZSBDb3JwLiAyMDE0LTIwMTZcclxuICovXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbCcsIFtdKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBuZ2RvYyBjb250cm9sbGVyXHJcbiAgICAgKiBAbmFtZSBwaXBVc2VyU2V0dGluZ3MuVmVyaWZ5RW1haWw6cGlwVXNlclNldHRpbmdzVmVyaWZ5RW1haWxDb250cm9sbGVyXHJcbiAgICAgKlxyXG4gICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgKiBDb250cm9sbGVyIGZvciB2ZXJpZnkgZW1haWwgZGlhbG9nIHBhbmVsLlxyXG4gICAgICovXHJcbiAgICB0aGlzTW9kdWxlLmNvbnRyb2xsZXIoJ3BpcFVzZXJTZXR0aW5nc1ZlcmlmeUVtYWlsQ29udHJvbGxlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJG1kRGlhbG9nLCBwaXBUcmFuc2FjdGlvbiwgcGlwRm9ybUVycm9ycywgcGlwRGF0YVVzZXIsIGVtYWlsKSB7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZW1haWxWZXJpZmllZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGVtYWlsOiBlbWFpbCxcclxuICAgICAgICAgICAgICAgIGNvZGU6ICcnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICRzY29wZS50cmFuc2FjdGlvbiA9IHBpcFRyYW5zYWN0aW9uKCdzZXR0aW5ncy52ZXJpZnlfZW1haWwnLCAkc2NvcGUpO1xyXG5cclxuICAgICAgICAgICAgLyoqIEBzZWUgb25BYm9ydCAqL1xyXG4gICAgICAgICAgICAkc2NvcGUub25BYm9ydCA9IG9uQWJvcnQ7XHJcbiAgICAgICAgICAgIC8qKiBAc2VlIG9uUmVxdWVzdFZlcmlmaWNhdGlvbkNsaWNrKi9cclxuICAgICAgICAgICAgJHNjb3BlLm9uUmVxdWVzdFZlcmlmaWNhdGlvbkNsaWNrID0gb25SZXF1ZXN0VmVyaWZpY2F0aW9uQ2xpY2s7XHJcbiAgICAgICAgICAgICRzY29wZS5lcnJvcnNXaXRoSGludCA9IHBpcEZvcm1FcnJvcnMuZXJyb3JzV2l0aEhpbnQ7XHJcbiAgICAgICAgICAgIC8qKiBAc2VlIG9uVmVyaWZ5ICovXHJcbiAgICAgICAgICAgICRzY29wZS5vblZlcmlmeSA9IG9uVmVyaWZ5O1xyXG4gICAgICAgICAgICAvKiogQHNlZSBvbkNhbmNlbCAqL1xyXG4gICAgICAgICAgICAkc2NvcGUub25DYW5jZWwgPSBvbkNhbmNlbDtcclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuVmVyaWZ5RW1haWw6cGlwVXNlclNldHRpbmdzVmVyaWZ5RW1haWxDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbC5waXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXI6b25BYm9ydFxyXG4gICAgICAgICAgICAgKlxyXG4gICAgICAgICAgICAgKiBAZGVzY3JpcHRpb25cclxuICAgICAgICAgICAgICogQWJvcnRzIGEgdmVyaWZ5IHJlcXVlc3QuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkFib3J0KCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmFib3J0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuVmVyaWZ5RW1haWw6cGlwVXNlclNldHRpbmdzVmVyaWZ5RW1haWxDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbC5waXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXI6b25DYW5jZWxcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIENsb3NlcyBvcGVuZWQgZGlhbG9nIHBhbmVsLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25DYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuY2FuY2VsKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuVmVyaWZ5RW1haWw6cGlwVXNlclNldHRpbmdzVmVyaWZ5RW1haWxDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbC5waXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXI6b25SZXF1ZXN0VmVyaWZpY2F0aW9uQ2xpY2tcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIFNlbmRzIHJlcXVlc3QgdG8gdmVyaWZ5IGVudGVyZWQgZW1haWwuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvblJlcXVlc3RWZXJpZmljYXRpb25DbGljaygpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdGlkID0gJHNjb3BlLnRyYW5zYWN0aW9uLmJlZ2luKCdSZXF1ZXN0RW1haWxWZXJpZmljYXRpb24nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwaXBEYXRhVXNlci5yZXF1ZXN0RW1haWxWZXJpZmljYXRpb24oXHJcbiAgICAgICAgICAgICAgICAgICAge30sICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUudHJhbnNhY3Rpb24uYWJvcnRlZCh0aWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnRyYW5zYWN0aW9uLmVuZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBAbmdkb2MgbWV0aG9kXHJcbiAgICAgICAgICAgICAqIEBtZXRob2RPZiBwaXBVc2VyU2V0dGluZ3MuVmVyaWZ5RW1haWw6cGlwVXNlclNldHRpbmdzVmVyaWZ5RW1haWxDb250cm9sbGVyXHJcbiAgICAgICAgICAgICAqIEBuYW1lIHBpcFVzZXJTZXR0aW5ncy5WZXJpZnlFbWFpbC5waXBVc2VyU2V0dGluZ3NWZXJpZnlFbWFpbENvbnRyb2xsZXI6b25WZXJpZnlcclxuICAgICAgICAgICAgICpcclxuICAgICAgICAgICAgICogQGRlc2NyaXB0aW9uXHJcbiAgICAgICAgICAgICAqIEluaXRpYXRlcyByZXF1ZXN0IG9uIHZlcmlmeSBlbWFpbCBvbiB0aGUgc2VydmVyLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb25WZXJpZnkoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS4kc2V0U3VibWl0dGVkKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5mb3JtLiRpbnZhbGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHRpZCA9ICRzY29wZS50cmFuc2FjdGlvbi5iZWdpbignVmVyaWZ5aW5nJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGlwRGF0YVVzZXIudmVyaWZ5RW1haWwoXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWFpbDogJHNjb3BlLmRhdGEuZW1haWwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvZGU6ICRzY29wZS5kYXRhLmNvZGVcclxuICAgICAgICAgICAgICAgICAgICB9LCBcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmVyaWZ5RGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS50cmFuc2FjdGlvbi5hYm9ydGVkKHRpZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudHJhbnNhY3Rpb24uZW5kKGVycm9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBpcEZvcm1FcnJvcnMuc2V0Rm9ybUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0sIGVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDExMDY6ICdlbWFpbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMTEwMzogJ2NvZGUnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuIiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCdzZXR0aW5nc19wYWdlL1NldHRpbmdzUGFnZS5odG1sJyxcbiAgICAnPG1kLXRvb2xiYXIgY2xhc3M9XCJwaXAtYXBwYmFyLWV4dFwiPjwvbWQtdG9vbGJhcj48cGlwLWRvY3VtZW50IHdpZHRoPVwiODAwXCIgbWluLWhlaWdodD1cIjQwMFwiIGNsYXNzPVwicGlwLXNldHRpbmdzXCI+PGRpdiBjbGFzcz1cInBpcC1tZW51LWNvbnRhaW5lclwiIG5nLWhpZGU9XCJ2bS5tYW5hZ2VyID09PSBmYWxzZSB8fCAhdm0udGFicyB8fCB2bS50YWJzLmxlbmd0aCA8IDFcIj48bWQtbGlzdCBjbGFzcz1cInBpcC1tZW51IHBpcC1zaW1wbGUtbGlzdFwiIHBpcC1zZWxlY3RlZD1cInZtLnNlbGVjdGVkLnRhYkluZGV4XCIgcGlwLXNlbGVjdGVkLXdhdGNoPVwidm0uc2VsZWN0ZWQubmF2SWRcIiBwaXAtc2VsZWN0PVwidm0ub25OYXZpZ2F0aW9uU2VsZWN0KCRldmVudC5pZClcIj48bWQtbGlzdC1pdGVtIGNsYXNzPVwicGlwLXNpbXBsZS1saXN0LWl0ZW0gcGlwLXNlbGVjdGFibGUgZmxleFwiIG5nLXJlcGVhdD1cInRhYiBpbiB2bS50YWJzIHRyYWNrIGJ5IHRhYi5zdGF0ZVwiIG5nLWlmPVwidm0uJHBhcnR5LmlkID09IHZtLiR1c2VyLmlkIHx8IHRhYi5zdGF0ZSA9PSBcXCdzZXR0aW5ncy5iYXNpY19pbmZvXFwnfHwgdGFiLnN0YXRlID09XFwnc2V0dGluZ3MuY29udGFjdF9pbmZvXFwnIHx8IHRhYi5zdGF0ZSA9PVxcJ3NldHRpbmdzLmJsYWNrbGlzdFxcJ1wiIG1kLWluay1yaXBwbGU9XCJcIiBwaXAtaWQ9XCJ7ezo6IHRhYi5zdGF0ZSB9fVwiPjxwPnt7Ojp0YWIudGl0bGUgfCB0cmFuc2xhdGV9fTwvcD48L21kLWxpc3QtaXRlbT48L21kLWxpc3Q+PGRpdiBjbGFzcz1cInBpcC1jb250ZW50LWNvbnRhaW5lclwiPjxwaXAtZHJvcGRvd24gcGlwLWFjdGlvbnM9XCJ2bS50YWJzXCIgcGlwLWRyb3Bkb3duLXNlbGVjdD1cInZtLm9uRHJvcGRvd25TZWxlY3RcIiBwaXAtYWN0aXZlLWluZGV4PVwidm0uc2VsZWN0ZWQudGFiSW5kZXhcIj48L3BpcC1kcm9wZG93bj48ZGl2IGNsYXNzPVwicGlwLWJvZHkgdHAyNC1mbGV4IGxheW91dC1jb2x1bW5cIiB1aS12aWV3PVwiXCI+PC9kaXY+PC9kaXY+PC9kaXY+PGRpdiBjbGFzcz1cImxheW91dC1jb2x1bW4gbGF5b3V0LWFsaWduLWNlbnRlci1jZW50ZXIgZmxleFwiIG5nLXNob3c9XCJ2bS5tYW5hZ2VyID09PSBmYWxzZSB8fCAhdm0udGFicyB8fCB2bS50YWJzLmxlbmd0aCA8IDFcIj57ezo6XFwnRVJST1JfNDAwXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48L3BpcC1kb2N1bWVudD4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX2Jhc2ljX2luZm8uaHRtbCcsXG4gICAgJzxmb3JtIG5hbWU9XCJmb3JtXCIgY2xhc3M9XCJ3LXN0cmV0Y2hcIiBub3ZhbGlkYXRlPVwiXCI+PG1kLXByb2dyZXNzLWxpbmVhciBjbGFzcz1cInBpcC1wcm9ncmVzcy10b3BcIiBuZy1zaG93PVwidHJhbnNhY3Rpb24uYnVzeSgpXCIgbWQtbW9kZT1cImluZGV0ZXJtaW5hdGVcIj48L21kLXByb2dyZXNzLWxpbmVhcj48ZGl2IGNsYXNzPVwibGF5b3V0LXJvdyBibTEyXCI+PGRpdiBjbGFzcz1cIm1kLXRpbGUtbGVmdFwiPjxwaXAtYXZhdGFyLWVkaXQgcGlwLXBhcnR5LWlkPVwiJHBhcnR5LmlkXCIgcGlwLWNyZWF0ZWQ9XCJvblBpY3R1cmVDcmVhdGVkKCRldmVudClcIiBwaXAtY2hhbmdlZD1cIm9uUGljdHVyZUNoYW5nZWQoJGNvbnRyb2wsICRldmVudClcIj48L3BpcC1hdmF0YXItZWRpdD48L2Rpdj48ZGl2IGNsYXNzPVwibWQtdGlsZS1jb250ZW50IHRwMCBsYXlvdXQtYWxpZ24tY2VudGVyXCI+PGgzIGNsYXNzPVwidG0xNiBibTggdGV4dC1vbmUtbGluZVwiPnt7IG5hbWVDb3B5IH19PC9oMz48cCBjbGFzcz1cInRleHQtcHJpbWFyeSB0ZXh0LW92ZXJmbG93IG0wXCI+e3s6OlxcJ1NFVFRJTkdTX0JBU0lDX0lORk9fRlJPTVxcJyB8IHRyYW5zbGF0ZX19IHt7JHVzZXIuc2lnbnVwIHwgZm9ybWF0TG9uZ0RhdGUgfX08L3A+PC9kaXY+PC9kaXY+PG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+PGxhYmVsPnt7OjpcXCdTRVRUSU5HU19CQVNJQ19JTkZPX0ZVTExfTkFNRVxcJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD4gPGlucHV0IG5hbWU9XCJmdWxsTmFtZVwiIHN0ZXA9XCJhbnlcIiB0eXBlPVwidGV4dFwiIHRhYmluZGV4PVwiMFwiIHJlcXVpcmVkPVwiXCIgbmctbW9kZWw9XCIkcGFydHkubmFtZVwiIG5nLWRpc2FibGVkPVwidHJhbnNhY3Rpb24uYnVzeSgpXCIgbmctY2hhbmdlPVwib25DaGFuZ2VCYXNpY0luZm8oKVwiPjxkaXYgY2xhc3M9XCJoaW50XCIgbmctaWY9XCJlcnJvcnNXaXRoSGludChmb3JtLCBmb3JtLmZ1bGxOYW1lKS5oaW50XCI+e3s6OlxcJ0VSUk9SX0ZVTExOQU1FX0lOVkFMSURcXCcgfCB0cmFuc2xhdGV9fTwvZGl2PjwvbWQtaW5wdXQtY29udGFpbmVyPjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9jayBibTBcIj48bGFiZWw+e3s6OlxcJ1NFVFRJTkdTX0JBU0lDX0lORk9fUFJJTUFSWV9FTUFJTFxcJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD4gPGlucHV0IG5hbWU9XCJlbWFpbFwiIHR5cGU9XCJlbWFpbFwiIHJlcXVpcmVkPVwiXCIgbmctbW9kZWw9XCIkcGFydHkuZW1haWxcIiBuZy1jaGFuZ2U9XCJvbkNoYW5nZUJhc2ljSW5mbygpXCIgcGlwLWVtYWlsLXVuaXF1ZT1cInt7JHBhcnR5LmVtYWlsfX1cIj48ZGl2IGNsYXNzPVwiaGludFwiIG5nLWlmPVwiZXJyb3JzV2l0aEhpbnQoZm9ybSwgZm9ybS5lbWFpbCkuaGludCAmJiAhJHVzZXIuZW1haWxfdmVyXCI+e3s6OlxcJ1NFVFRJTkdTX0JBU0lDX0lORk9fVkVSSUZZX0hJTlRcXCcgfCB0cmFuc2xhdGV9fTwvZGl2PjxkaXYgbmctbWVzc2FnZXM9XCJlcnJvcnNXaXRoSGludChmb3JtLmVtYWlsKVwiIG5nLWhpZGU9XCIkcGFydHkudHlwZSA9PVxcJ3RlYW1cXCdcIj48ZGl2IG5nLW1lc3NhZ2U9XCJlbWFpbFwiPnt7OjpcXCdFUlJPUl9FTUFJTF9JTlZBTElEXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJlbWFpbFVuaXF1ZVwiPnt7OjpcXCdFUlJPUl9FTUFJTF9JTlZBTElEXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48L2Rpdj48L21kLWlucHV0LWNvbnRhaW5lcj48bWQtYnV0dG9uIGNsYXNzPVwibWQtcmFpc2VkIGJtMTYgdG04IHJtOFwiIG5nLWNsaWNrPVwib25WZXJpZnlFbWFpbCgkZXZlbnQpXCIgbmctaGlkZT1cIiR1c2VyLmVtYWlsX3ZlciB8fCAkcGFydHkudHlwZSA9PVxcJ3RlYW1cXCdcIj57ezo6XFwnU0VUVElOR1NfQkFTSUNfSU5GT19WRVJJRllfQ09ERVxcJyB8IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PG1kLWJ1dHRvbiBuZy1jbGljaz1cIm9uQ2hhbmdlUGFzc3dvcmQoJGV2ZW50KVwiIGNsYXNzPVwibWQtcmFpc2VkIGJtMTYgdG04XCIgbmctaGlkZT1cIiRwYXJ0eS50eXBlID09XFwndGVhbVxcJ1wiPnt7OjpcXCdTRVRUSU5HU19CQVNJQ19JTkZPX0NIQU5HRV9QQVNTV09SRFxcJyB8IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrIGZsZXhcIj48bGFiZWw+e3s6OlxcJ1NFVFRJTkdTX0JBU0lDX0lORk9fV09SRFNfQUJPVVRfTUVcXCcgfCB0cmFuc2xhdGUgfX08L2xhYmVsPiA8dGV4dGFyZWEgbmctbW9kZWw9XCIkcGFydHkuYWJvdXRcIiBjb2x1bW5zPVwiMVwiIG5nLWNoYW5nZT1cIm9uQ2hhbmdlQmFzaWNJbmZvKClcIj48L3RleHRhcmVhPjwvbWQtaW5wdXQtY29udGFpbmVyPjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWhpZGU9XCIkcGFydHkudHlwZSA9PVxcJ3RlYW1cXCdcIj48bGFiZWw+e3s6OlxcJ0dFTkRFUlxcJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD48bWQtc2VsZWN0IG5nLW1vZGVsPVwiJHBhcnR5LmdlbmRlclwiIG5nLWNoYW5nZT1cIm9uQ2hhbmdlQmFzaWNJbmZvKClcIiBwbGFjZWhvbGRlcj1cInt7XFwnR0VOREVSXFwnIHwgdHJhbnNsYXRlfX1cIj48bWQtb3B0aW9uIG5nLXZhbHVlPVwiZ2VuZGVyLmlkXCIgbmctcmVwZWF0PVwiZ2VuZGVyIGluIGdlbmRlcnNcIj57e2dlbmRlci5uYW1lfX08L21kLW9wdGlvbj48L21kLXNlbGVjdD48L21kLWlucHV0LWNvbnRhaW5lcj48ZGl2IG5nLWhpZGU9XCIkcGFydHkudHlwZSA9PVxcJ3RlYW1cXCdcIj48cCBjbGFzcz1cInRleHQtY2FwdGlvbiB0ZXh0LWdyZXkgdG0wIGJtMFwiPnt7OjpcXCdTRVRUSU5HU19CQVNJQ19JTkZPX0JJUlRIREFZXFwnIHwgdHJhbnNsYXRlfX08L3A+PHBpcC1kYXRlIG5nLW1vZGVsPVwiJHBhcnR5LmJpcnRoZGF5XCIgbmctY2hhbmdlPVwib25DaGFuZ2VCYXNpY0luZm8oKVwiIHBpcC10aW1lLW1vZGU9XCJwYXN0IHRpbWUtbW9kZT1cIiBwYXN0XCI9XCJcIj48L3BpcC1kYXRlPjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWhpZGU9XCIkcGFydHkudHlwZSA9PVxcJ3RlYW1cXCdcIj48bGFiZWw+e3s6OlxcJ0xBTkdVQUdFXFwnIHwgdHJhbnNsYXRlfX08L2xhYmVsPjxtZC1zZWxlY3QgcGxhY2Vob2xkZXI9XCJ7e1xcJ0xBTkdVQUdFXFwnIHwgdHJhbnNsYXRlfX1cIiBuZy1tb2RlbD1cIiR1c2VyLmxhbmd1YWdlXCIgbmctY2hhbmdlPVwib25DaGFuZ2VVc2VyKClcIj48bWQtb3B0aW9uIG5nLXZhbHVlPVwibGFuZ3VhZ2UuaWRcIiBuZy1yZXBlYXQ9XCJsYW5ndWFnZSBpbiBsYW5ndWFnZXNcIj57e2xhbmd1YWdlLm5hbWV9fTwvbWQtb3B0aW9uPjwvbWQtc2VsZWN0PjwvbWQtaW5wdXQtY29udGFpbmVyPjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWlmPVwiJHBhcnR5LnR5cGUgIT1cXCd0ZWFtXFwnXCI+PGxhYmVsPnt7OjpcXCdUSEVNRVxcJyB8IHRyYW5zbGF0ZX19PC9sYWJlbD48bWQtc2VsZWN0IGNsYXNzPVwidy1zdHJldGNoIHRoZW1lLXRleHQtcHJpbWFyeVwiIG5nLW1vZGVsPVwiJHVzZXIudGhlbWVcIiBuZy1jaGFuZ2U9XCJvbkNoYW5nZVVzZXIoKVwiIG5nLWRpc2FibGVkPVwidHJhbnNhY3Rpb24uYnVzeSgpXCI+PG1kLW9wdGlvbiBuZy12YWx1ZT1cInRoZW1lXCIgbmctcmVwZWF0PVwidGhlbWUgaW4gdGhlbWVzXCIgbmctc2VsZWN0ZWQ9XCIkdGhlbWUgPT0gdGhlbWUgPyB0cnVlIDogZmFsc2VcIj57eyB0aGVtZSB8IHRyYW5zbGF0ZSB9fTwvbWQtb3B0aW9uPjwvbWQtc2VsZWN0PjwvbWQtaW5wdXQtY29udGFpbmVyPjxwaXAtbG9jYXRpb24tZWRpdCBjbGFzcz1cIm1hcC1lZGl0IGJtMjQtZmxleFwiIG5nLWhpZGU9XCIkcGFydHkudHlwZSA9PVxcJ3RlYW1cXCdcIiBwaXAtY2hhbmdlZD1cIm9uQ2hhbmdlQmFzaWNJbmZvKClcIiBwaXAtbG9jYXRpb24tbmFtZT1cIiRwYXJ0eS5sb2NfbmFtZVwiIHBpcC1sb2NhdGlvbi1wb3M9XCJsb2NfcG9zXCI+PC9waXAtbG9jYXRpb24tZWRpdD48L2Zvcm0+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3VzZXJfc2V0dGluZ3MvdXNlcl9zZXR0aW5nc19jaGFuZ2VfcGFzc3dvcmQuaHRtbCcsXG4gICAgJzxtZC1kaWFsb2cgY2xhc3M9XCJwaXAtZGlhbG9nIGxheW91dC1jb2x1bW5cIiB3aWR0aD1cIjQ0MFwiPjxmb3JtIG5hbWU9XCJmb3JtXCIgbmctc3VibWl0PVwib25BcHBseSgpXCI+PGRpdiBjbGFzcz1cInBpcC1oZWFkZXJcIj48aDMgY2xhc3M9XCJtMFwiPnt7OjpcXCdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfVElUTEVcXCcgfCB0cmFuc2xhdGUgOiBtb2R1bGV9fTwvaDM+PC9kaXY+PGRpdiBjbGFzcz1cInBpcC1ib2R5XCI+PGRpdiBjbGFzcz1cInBpcC1jb250ZW50XCI+PGRpdiBjbGFzcz1cInRleHQtZXJyb3IgYm04XCIgbmctbWVzc2FnZXM9XCJmb3JtLiRzZXJ2ZXJFcnJvclwiPjxkaXYgbmctbWVzc2FnZT1cIkVSUk9SX1VOS05PV05cIj57eyBmb3JtLiRzZXJ2ZXJFcnJvci5FUlJPUl9VTktOT1dOIHwgdHJhbnNsYXRlIH19PC9kaXY+PC9kaXY+PG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCI+PGxhYmVsPnt7OjpcXCdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfQ1VSUkVOVF9QQVNTV09SRFxcJyB8IHRyYW5zbGF0ZSB9fTwvbGFiZWw+IDxpbnB1dCBuYW1lPVwib2xkUGFzc3dvcmRcIiB0eXBlPVwicGFzc3dvcmRcIiBuZy1tb2RlbD1cImNoYW5nZVBhc0RhdGEub2xkX3Bhc3N3b3JkXCIgbmctcmVxdWlyZWQ9XCJjaGFuZ2VfcGFzc3dvcmQuJHN1Ym1pdHRlZFwiIHBpcC1jbGVhci1lcnJvcnM9XCJcIj48ZGl2IG5nLW1lc3NhZ2VzPVwiZXJyb3JzV2l0aEhpbnQoZm9ybSwgZm9ybS5vbGRQYXNzd29yZClcIj48ZGl2IG5nLW1lc3NhZ2U9XCJyZXF1aXJlZFwiPnt7OjpcXCdFUlJPUl9SRVFVSVJFRFxcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjxkaXYgbmctbWVzc2FnZT1cIkVSUk9SXzExMDdcIj57ezo6XFwnRVJST1JfV1JPTkdfUEFTU1dPUkRcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48L2Rpdj48L21kLWlucHV0LWNvbnRhaW5lcj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIj48bGFiZWw+e3tcXCdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfTkVXX1BBU1NXT1JEXFwnIHwgdHJhbnNsYXRlIH19PC9sYWJlbD4gPGlucHV0IG5hbWU9XCJuZXdQYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIG5nLW1vZGVsPVwiY2hhbmdlUGFzRGF0YS5uZXdfcGFzc3dvcmRcIiBuZy1jaGFuZ2U9XCJvbkNoZWNrUmVwZWF0UGFzc3dvcmQoKVwiIG5nLXJlcXVpcmVkPVwiY2hhbmdlX3Bhc3N3b3JkLiRzdWJtaXR0ZWRcIiBuZy1taW5sZW5ndGg9XCI2XCIgcGlwLWNsZWFyLWVycm9ycz1cIlwiPjxkaXYgY2xhc3M9XCJoaW50XCIgbmctaWY9XCJlcnJvcnNXaXRoSGludChmb3JtLCBmb3JtLm5ld1Bhc3N3b3JkKS5oaW50XCI+e3sgXFwnSElOVF9QQVNTV09SRFxcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjxkaXYgbmctbWVzc2FnZXM9XCJlcnJvcnNXaXRoSGludChmb3JtLCBmb3JtLm5ld1Bhc3N3b3JkKVwiPjxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+e3s6OlxcJ0VSUk9SX1JFUVVJUkVEXFwnIHwgdHJhbnNsYXRlfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJtaW5sZW5ndGhcIj57ezo6XFwnSElOVF9QQVNTV09SRFxcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjxkaXYgbmctbWVzc2FnZT1cIkVSUk9SXzExMDVcIj57ezo6XFwnRVJST1JfSURFTlRJQ0FMX1BBU1NXT1JEU1xcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjwvZGl2PjwvbWQtaW5wdXQtY29udGFpbmVyPjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPjxsYWJlbD57eyBcXCdTRVRUSU5HU19DSEFOR0VfUEFTU1dPUkRfUkVQRUFUX1JBU1NXT1JEXFwnIHwgdHJhbnNsYXRlIH19PC9sYWJlbD4gPGlucHV0IG5hbWU9XCJyZXBlYXRcIiB0eXBlPVwicGFzc3dvcmRcIiBuZy1tb2RlbD1cInJlcGVhdFwiIG5nLWNoYW5nZT1cIm9uQ2hlY2tSZXBlYXRQYXNzd29yZCgpXCIgbmctcmVxdWlyZWQ9XCJjaGFuZ2VfcGFzc3dvcmQuJHN1Ym1pdHRlZFwiIG5nLW1pbmxlbmd0aD1cIjZcIj48ZGl2IGNsYXNzPVwiaGludFwiIG5nLWlmPVwiZXJyb3JzUmVwZWF0V2l0aEhpbnQoZm9ybS5yZXBlYXQpLmhpbnRcIj57ezo6XFwnSElOVF9SRVBFQVRfUEFTU1dPUkRcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2VzPVwiZXJyb3JzUmVwZWF0V2l0aEhpbnQoZm9ybS5yZXBlYXQpXCI+PGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj57ezo6XFwnRVJST1JfUkVRVUlSRURcXCcgfCB0cmFuc2xhdGUgfX08L2Rpdj48ZGl2IG5nLW1lc3NhZ2U9XCJtaW5sZW5ndGhcIj57ezo6XFwnSElOVF9QQVNTV09SRFxcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjxkaXYgbmctbWVzc2FnZT1cInJlcGVhdFwiPnt7OjpcXCdSRVBFQVRfUEFTU1dPUkRfSU5WQUxJRFxcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjwvZGl2PjwvbWQtaW5wdXQtY29udGFpbmVyPjwvZGl2PjwvZGl2PjxkaXYgY2xhc3M9XCJwaXAtZm9vdGVyXCI+PGRpdj48bWQtYnV0dG9uIGFyaWEtbGFiZWw9XCJ4eHhcIiBuZy1jbGljaz1cIm9uQ2FuY2VsKClcIj57ezo6XFwnQ0FOQ0VMXFwnIHwgdHJhbnNsYXRlIH19PC9tZC1idXR0b24+PG1kLWJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJtZC1hY2NlbnRcIiBhcmlhLWxhYmVsPVwieHh4XCI+e3s6OlxcJ0FQUExZXFwnIHwgdHJhbnNsYXRlIDogbW9kdWxlfX08L21kLWJ1dHRvbj48L2Rpdj48L2Rpdj48L2Zvcm0+PC9tZC1kaWFsb2c+Jyk7XG59XSk7XG59KSgpO1xuXG4oZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwU2V0dGluZ3MuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3VzZXJfc2V0dGluZ3MvdXNlcl9zZXR0aW5nc19zZXNzaW9ucy5odG1sJyxcbiAgICAnPG1kLXByb2dyZXNzLWxpbmVhciBuZy1zaG93PVwidHJhbnNhY3Rpb24uYnVzeSgpXCIgbWQtbW9kZT1cImluZGV0ZXJtaW5hdGVcIiBjbGFzcz1cInBpcC1wcm9ncmVzcy10b3BcIj48L21kLXByb2dyZXNzLWxpbmVhcj48ZGl2IGNsYXNzPVwicGlwLWRldGFpbHMtdGl0bGUgcGlwLXNlc3Npb25zXCI+PHAgY2xhc3M9XCJwaXAtdGl0bGUgYm0xNlwiPnt7OjpcXCdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfVElUTEVcXCcgfCB0cmFuc2xhdGV9fTwvcD48cCBjbGFzcz1cInBpcC1zdWJ0aXRsZVwiPnt7OjpcXCdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfU1VCVElUTEVcXCcgfCB0cmFuc2xhdGV9fTwvcD48L2Rpdj48bWQtbGlzdCBjbGFzcz1cInctc3RyZXRjaFwiPjxkaXYgbmctcmVwZWF0PVwic2Vzc2lvbiBpbiBzZXNzaW9uc1wiPjxkaXYgY2xhc3M9XCJsYXlvdXQtcm93XCIgbmctaW5pdD1cInNob3dCbG9jayA9IHNlc3Npb24uaWQgIT0gc2Vzc2lvbklkXCIgbmctY2xpY2s9XCJzaG93QmxvY2sgPSAhc2hvd0Jsb2NrXCI+PHAgY2xhc3M9XCJtMCB0ZXh0LXN1YmhlYWQyIHRleHQtb3ZlcmZsb3cgbWF4LXc1MC1zdHJldGNoXCI+e3s6OnNlc3Npb24uY2xpZW50fX08L3A+PHAgY2xhc3M9XCJtMCBscDQgdGV4dC1ib2R5MSBjb2xvci1zZWNvbmRhcnktdGV4dCBmbGV4XCI+e3s6OlxcJ1NFVFRJTkdTX0FDVElWRV9TRVNTSU9OX0FDVElWRVxcJyB8IHRyYW5zbGF0ZX19PC9wPjxwIGNsYXNzPVwibTAgdGV4dC1ib2R5MSBjb2xvci1zZWNvbmRhcnktdGV4dFwiPnt7Ojpjb3VudHJ5fX08bWQtaWNvbiBuZy1pZj1cInNob3dCbG9ja1wiIG1kLXN2Zy1pY29uPVwiaWNvbnM6dHJpYW5nbGUtdXBcIj48L21kLWljb24+PG1kLWljb24gbmctaWY9XCIhc2hvd0Jsb2NrXCIgbWQtc3ZnLWljb249XCJpY29uczp0cmlhbmdsZS1kb3duXCI+PC9tZC1pY29uPjwvcD48L2Rpdj48ZGl2IGNsYXNzPVwibGF5b3V0LXJvdyBibTggYnA4XCIgbmctY2xhc3M9XCJ7XFwnZGl2aWRlci1ib3R0b21cXCc6ISRsYXN0fVwiPjxkaXYgY2xhc3M9XCJmbGV4LTUwXCI+PHAgY2xhc3M9XCJtMCBibTQgdGV4dC1ib2R5MSB0ZXh0LW92ZXJmbG93IGNvbG9yLXNlY29uZGFyeS10ZXh0XCI+e3tzZXNzaW9uLmxhc3RfcmVxIHwgZGF0ZSA6IFxcJ21lZGl1bVxcJ319PC9wPjxwIGNsYXNzPVwibTAgYm00IHRleHQtYm9keTEgdGV4dC1vdmVyZmxvdyBjb2xvci1zZWNvbmRhcnktdGV4dFwiIG5nLXNob3c9XCJzaG93QmxvY2tcIj57ezo6XFwnU0VUVElOR1NfQUNUSVZFX1NFU1NJT05fT1NcXCcgfCB0cmFuc2xhdGV9fXt7OjpzZXNzaW9uLnBsYXRmb3JtfX08L3A+PHAgY2xhc3M9XCJtMCBibTQgdGV4dC1ib2R5MSB0ZXh0LW92ZXJmbG93IGNvbG9yLXNlY29uZGFyeS10ZXh0XCIgbmctc2hvdz1cInNob3dCbG9ja1wiPnt7OjpcXCdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTl9JUFxcJyB8IHRyYW5zbGF0ZX19e3s6OnNlc3Npb24uYWRkcmVzc319PC9wPjxtZC1idXR0b24gY2xhc3M9XCJtZC1yYWlzZWRcIiBuZy1zaG93PVwic2hvd0Jsb2NrICYmIHNlc3Npb24uaWQgIT0gc2Vzc2lvbklkXCIgbmctY2xpY2s9XCJvblJlbW92ZShzZXNzaW9uKVwiPnt7OjpcXCdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfQ0xPU0VfU0VTU0lPTlxcJyB8IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PC9kaXY+PHBpcC1sb2NhdGlvbi1pcCBjbGFzcz1cIm1hcC1lZGl0IGZsZXgtNTBcIiBuZy1pZj1cInNob3dCbG9ja1wiIHBpcC1pcGFkZHJlc3M9XCJzZXNzaW9uLmFkZHJlc3NcIiBwaXAtZXh0cmEtaW5mbz1cImNvdW50cnkgPSBleHRyYUluZm8uY291bnRyeVwiPjwvcGlwLWxvY2F0aW9uLWlwPjwvZGl2PjwvZGl2PjwvbWQtbGlzdD48ZGl2IGNsYXNzPVwibGF5b3V0LXJvdyBsYXlvdXQtYWxpZ24tZW5kLWNlbnRlclwiPjxtZC1idXR0b24gY2xhc3M9XCJtZC1yYWlzZWRcIiBuZy1zaG93PVwic2Vzc2lvbnMubGVuZ3RoID4gMVwiIG5nLWNsaWNrPVwib25SZW1vdmVBbGwoKVwiPnt7OjpcXCdTRVRUSU5HU19BQ1RJVkVfU0VTU0lPTlNfQ0xPU0VfQUNUSVZFX1NFU1NJT05TXFwnIHwgdHJhbnNsYXRlfX08L21kLWJ1dHRvbj48L2Rpdj4nKTtcbn1dKTtcbn0pKCk7XG5cbihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBTZXR0aW5ncy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcFNldHRpbmdzLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndXNlcl9zZXR0aW5ncy91c2VyX3NldHRpbmdzX3ZlcmlmeV9lbWFpbC5odG1sJyxcbiAgICAnPG1kLWRpYWxvZyBjbGFzcz1cInBpcC1kaWFsb2cgbGF5b3V0LWNvbHVtblwiIHdpZHRoPVwiNDQwXCI+PGRpdiBjbGFzcz1cInBpcC1ib2R5XCI+PGRpdiBjbGFzcz1cInBpcC1jb250ZW50XCI+PG1kLXByb2dyZXNzLWxpbmVhciBuZy1zaG93PVwidHJhbnNhY3Rpb24uYnVzeSgpXCIgbWQtbW9kZT1cImluZGV0ZXJtaW5hdGVcIiBjbGFzcz1cInBpcC1wcm9ncmVzcy10b3BcIj48L21kLXByb2dyZXNzLWxpbmVhcj48aDI+e3s6OlxcJ1ZFUklGWV9FTUFJTF9USVRMRVxcJyB8IHRyYW5zbGF0ZX19PC9oMj48cCBjbGFzcz1cInRpdGxlLXBhZGRpbmdcIj57ezo6XFwnVkVSSUZZX0VNQUlMX1RFWFRfMVxcJyB8IHRyYW5zbGF0ZX19PC9wPjxmb3JtIG5hbWU9XCJmb3JtXCIgbm92YWxpZGF0ZT1cIlwiPjxkaXYgbmctbWVzc2FnZXM9XCJmb3JtLiRzZXJ2ZXJFcnJvclwiIGNsYXNzPVwidGV4dC1lcnJvciBibThcIj48ZGl2IG5nLW1lc3NhZ2U9XCJFUlJPUl9VTktOT1dOXCI+e3sgZm9ybS4kc2VydmVyRXJyb3IuRVJST1JfVU5LTk9XTiB8IHRyYW5zbGF0ZSB9fTwvZGl2PjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJkaXNwbGF5IGJwNCBtZC1ibG9ja1wiPjxsYWJlbD57ezo6XFwnRU1BSUxcXCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+IDxpbnB1dCBuYW1lPVwiZW1haWxcIiB0eXBlPVwiZW1haWxcIiBuZy1tb2RlbD1cImRhdGEuZW1haWxcIiByZXF1aXJlZD1cIlwiIHN0ZXA9XCJhbnlcIiBwaXAtY2xlYXItZXJyb3JzPVwiXCIgdGFiaW5kZXg9XCIxXCIgbmctZGlzYWJsZWQ9XCJ0cmFuc2FjdGlvbi5idXN5KClcIiBwaXAtdGVzdD1cImlucHV0LWVtYWlsXCI+PGRpdiBjbGFzcz1cImhpbnRcIiBuZy1pZj1cImVycm9yc1dpdGhIaW50KGZvcm0sIGZvcm0uZW1haWwpLmhpbnRcIj57ezo6XFwnSElOVF9FTUFJTFxcJyB8IHRyYW5zbGF0ZX19PC9kaXY+PGRpdiBuZy1tZXNzYWdlcz1cImVycm9yc1dpdGhIaW50KGZvcm0sIGZvcm0uZW1haWwpXCIgeG5nLWlmPVwiIWZvcm0uZW1haWwuJHByaXN0aW5lXCI+PGRpdiBuZy1tZXNzYWdlPVwicmVxdWlyZWRcIj57ezo6XFwnRVJST1JfRU1BSUxfSU5WQUxJRFxcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjxkaXYgbmctbWVzc2FnZT1cIkVSUk9SXzExMDZcIj57ezo6XFwnRVJST1JfVVNFUl9OT1RfRk9VTkRcXCcgfCB0cmFuc2xhdGV9fTwvZGl2PjwvZGl2PjwvbWQtaW5wdXQtY29udGFpbmVyPjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiPjxsYWJlbD57ezo6XFwnRU5UUllfVkVSSUZJQ0FUSU9OX0NPREVcXCcgfCB0cmFuc2xhdGV9fTwvbGFiZWw+IDxpbnB1dCBuYW1lPVwiY29kZVwiIG5nLWRpc2FibGVkPVwidHJhbnNhY3Rpb24uYnVzeSgpXCIgdGFiaW5kZXg9XCIwXCIgbmctbW9kZWw9XCJkYXRhLmNvZGVcIiByZXF1aXJlZD1cIlwiIHBpcC1jbGVhci1lcnJvcnM9XCJcIj48ZGl2IG5nLW1lc3NhZ2VzPVwiZXJyb3JzV2l0aEhpbnQoZm9ybSwgZm9ybS5jb2RlKVwiPjxkaXYgbmctbWVzc2FnZT1cInJlcXVpcmVkXCI+e3s6OlxcJ0VSUk9SX0NPREVfSU5WQUxJRFxcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjxkaXYgbmctbWVzc2FnZT1cIkVSUk9SXzExMDNcIj57ezo6XFwnRVJST1JfQ09ERV9XUk9OR1xcJyB8IHRyYW5zbGF0ZSB9fTwvZGl2PjwvZGl2PjwvbWQtaW5wdXQtY29udGFpbmVyPjxwPnt7OjpcXCdWRVJJRllfRU1BSUxfVEVYVF8yMVxcJyB8IHRyYW5zbGF0ZX19IDxhIG5nLWNsaWNrPVwib25SZXF1ZXN0VmVyaWZpY2F0aW9uQ2xpY2soKVwiIGNsYXNzPVwicG9pbnRlclwiIHRhYmluZGV4PVwiMFwiPnt7OjpcXCdWRVJJRllfRU1BSUxfUkVTRU5EXFwnIHwgdHJhbnNsYXRlfX08L2E+IHt7OjpcXCdWRVJJRllfRU1BSUxfVEVYVF8yMlxcJyB8IHRyYW5zbGF0ZX19PC9wPjwvZm9ybT48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwicGlwLWZvb3RlclwiPjxtZC1idXR0b24gbmctY2xpY2s9XCJvbkNhbmNlbCgpXCIgbmctaGlkZT1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIGFyaWEtbGFiZWw9XCJ4eHhcIj57ezo6XFwnQ0FOQ0VMXFwnIHwgdHJhbnNsYXRlfX08L21kLWJ1dHRvbj48bWQtYnV0dG9uIGNsYXNzPVwibWQtYWNjZW50XCIgbmctY2xpY2s9XCJvblZlcmlmeSgpXCIgbmctaGlkZT1cInRyYW5zYWN0aW9uLmJ1c3koKVwiIHRhYmluZGV4PVwiMFwiIGFyaWEtbGFiZWw9XCJ4eHhcIiBuZy1kaXNhYmxlZD1cImRhdGEuY29kZS5sZW5ndGggPT0gMCB8fCBkYXRhLmVtYWlsLmxlbmd0aCA9PSAwIHx8ICghZGF0YS5lbWFpbCAmJiBmb3JtLiRwcmlzdGluZSkgfHwgKCFkYXRhLmNvZGUpXCI+e3s6OlxcJ1ZFUklGWVxcJyB8IHRyYW5zbGF0ZX19PC9tZC1idXR0b24+PG1kLWJ1dHRvbiBjbGFzcz1cIm1kLXdhcm5cIiBuZy1zaG93PVwidHJhbnNhY3Rpb24uYnVzeSgpXCIgbmctY2xpY2s9XCJ0cmFuc2FjdGlvbi5hYm9ydCgpXCIgdGFiaW5kZXg9XCIwXCIgYXJpYS1sYWJlbD1cInh4eFwiPnt7OjpcXCdDQU5DRUxcXCcgfCB0cmFuc2xhdGV9fTwvbWQtYnV0dG9uPjwvZGl2PjwvbWQtZGlhbG9nPicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLXNldHRpbmdzLWh0bWwubWluLmpzLm1hcFxuIl19