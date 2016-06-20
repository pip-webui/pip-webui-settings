/**
 * @file Registration of settings components
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    angular.module('pipSettings', [
        'pipSettings.Service',
        'pipSettings.Page',
        'pipUserSettings'
    ]);
    
})(window.angular);
(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings_page/settings_page.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '<pip-document width="800" min-height="400" class="pip-settings">\n' +
    '\n' +
    '    <div class="pip-menu-container" ng-hide="manager === false || !pages || pages.length < 1">\n' +
    '        <md-list class="pip-menu pip-simple-list hide-xs" pip-selected="selected.pageIndex"\n' +
    '                 pip-selected-watch="selected.navId" pip-select="onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable flex" md-ink-ripple pip-id="{{:: page.state }}"\n' +
    '                          ng-repeat="page in pages track by page.state" ng-if="$party.id == $user.id ||\n' +
    '                          page.state == \'settings.basic_info\'|| page.state ==\'settings.contact_info\'\n' +
    '                          || page.state ==\'settings.blacklist\'">\n' +
    '                <p> {{::page.title | translate}}</p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container" ng-if="selected.page">\n' +
    '            <pip-dropdown pip-actions="pages" class="hide-gt-xs" pip-dropdown-select="onDropdownSelect"\n' +
    '                          pip-active-index="selected.pageIndex"></pip-dropdown>\n' +
    '\n' +
    '            <div class="pip-body tp24-flex" ui-view layout="column"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-show="manager === false || !pages || pages.length < 1" layout="column" layout-align="center center" flex>\n' +
    '        {{::\'ERROR_400\' | translate}}\n' +
    '    </div>\n' +
    '</pip-document>');
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
    '<form name="form" novalidate class="w-stretch">\n' +
    '    <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '    </md-progress-linear>\n' +
    '    <div layout="row" class="bm12">\n' +
    '        <div class="md-tile-left">\n' +
    '            <pip-avatar-edit pip-party-id="$party.id"\n' +
    '                             pip-created="onPictureCreated($event)" pip-changed="onPictureChanged($control, $event)">\n' +
    '            </pip-avatar-edit>\n' +
    '        </div>\n' +
    '        <div class="md-tile-content tp0" layout-align="center">\n' +
    '            <h3 class="tm16 bm8 text-one-line">{{ nameCopy }}</h3>\n' +
    '\n' +
    '            <p class="text-primary text-overflow m0"> {{::\'SETTINGS_BASIC_INFO_FROM\' | translate}}\n' +
    '                {{$user.signup | formatLongDate }}</p>\n' +
    '\n' +
    '            <!--<p class="text-primary text-one-line"> {{::\'SETTINGS_BASIC_INFO_USER_ID\' | translate}} {{$party.id}} </p>-->\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <md-input-container class="md-block">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_FULL_NAME\' | translate}}</label>\n' +
    '        <input name="fullName" ng-model="$party.name" ng-disabled="transaction.busy()"\n' +
    '               step="any" type="text" tabindex="0"\n' +
    '               required\n' +
    '               ng-change="onChangeBasicInfo()"/>\n' +
    '\n' +
    '        <div class="hint" ng-if="errorsWithHint(form, form.fullName).hint">{{::\'ERROR_FULLNAME_INVALID\' | translate}}\n' +
    '        </div>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block bm0">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_PRIMARY_EMAIL\' | translate}}</label>\n' +
    '        <input name="email" pip-email-unique="{{$party.email}}" ng-model="$party.email"\n' +
    '               type="email" required\n' +
    '               ng-change="onChangeBasicInfo()"/>\n' +
    '\n' +
    '        <div class="hint" ng-if="errorsWithHint(form, form.email).hint && !$user.email_ver">\n' +
    '            {{::\'SETTINGS_BASIC_INFO_VERIFY_HINT\' |\n' +
    '            translate}}\n' +
    '        </div>\n' +
    '        <div ng-messages="errorsWithHint(form.email)" ng-hide=" $party.type ==\'team\'">\n' +
    '            <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div>\n' +
    '            <div ng-message="emailUnique">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-button ng-click="onVerifyEmail($event)" ng-hide="$user.email_ver || $party.type ==\'team\'"\n' +
    '               class="md-raised bm16 tm8 rm8">\n' +
    '        {{::\'SETTINGS_BASIC_INFO_VERIFY_CODE\' | translate}}\n' +
    '    </md-button>\n' +
    '\n' +
    '    <md-button ng-click="onChangePassword($event)" class="md-raised bm16 tm8" ng-hide="$party.type ==\'team\'">\n' +
    '        {{::\'SETTINGS_BASIC_INFO_CHANGE_PASSWORD\' | translate}}\n' +
    '    </md-button>\n' +
    '\n' +
    '    <md-input-container flex class="md-block">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_WORDS_ABOUT_ME\' | translate }}</label>\n' +
    '        <textarea ng-model="$party.about" columns="1"\n' +
    '                  ng-change="onChangeBasicInfo()"></textarea>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block" ng-hide="$party.type ==\'team\'">\n' +
    '        <label>{{::\'GENDER\' | translate}}</label>\n' +
    '        <md-select ng-model="$party.gender" ng-change="onChangeBasicInfo()"\n' +
    '                   placeholder="{{\'GENDER\' | translate}}">\n' +
    '            <md-option ng-value="gender.id" ng-repeat="gender in genders">{{gender.name}}</md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <div ng-hide="$party.type ==\'team\'">\n' +
    '        <p class="text-caption text-grey tm0 bm0">{{::\'SETTINGS_BASIC_INFO_BIRTHDAY\' | translate}}</p>\n' +
    '        <pip-date ng-model="$party.birthday" time-mode="past" ng-change="onChangeBasicInfo()"\n' +
    '                  pip-time-mode="past"></pip-date>\n' +
    '    </div>\n' +
    '\n' +
    '    <md-input-container class="md-block" ng-hide="$party.type ==\'team\'">\n' +
    '        <label>{{::\'LANGUAGE\' | translate}}</label>\n' +
    '        <md-select ng-model="$user.language" ng-change="onChangeUser()"\n' +
    '                   placeholder="{{\'LANGUAGE\' | translate}}">\n' +
    '            <md-option ng-value="language.id" ng-repeat="language in languages">{{language.name}}</md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block" ng-if="$party.type !=\'team\'">\n' +
    '        <label>{{::\'THEME\' | translate}}</label>\n' +
    '        <md-select ng-model="$user.theme" ng-change="onChangeUser()" class="w-stretch theme-text-primary"\n' +
    '                   ng-disabled="transaction.busy()">\n' +
    '            <md-option ng-value="theme" ng-repeat="theme in themes" ng-selected="$theme == theme ? true : false">\n' +
    '                {{ theme | translate }}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '    <pip-location-edit class="map-edit bm24-flex"\n' +
    '                       ng-hide="$party.type ==\'team\'"\n' +
    '                       pip-changed="onChangeBasicInfo()"\n' +
    '                       pip-location-name="$party.loc_name"\n' +
    '                       pip-location-pos="loc_pos">\n' +
    '    </pip-location-edit>\n' +
    '</form>\n' +
    '');
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
    '<md-dialog class="pip-dialog" layout="column"  width="440">\n' +
    '    <form name="form" ng-submit="onApply()" >\n' +
    '    <div class="pip-header">\n' +
    '        <h3 class="m0">{{::\'SETTINGS_CHANGE_PASSWORD_TITLE\' | translate : module}}</h3>\n' +
    '    </div>\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '            <div ng-messages="form.$serverError" class="text-error bm8">\n' +
    '                <div ng-message="ERROR_UNKNOWN">{{ form.$serverError.ERROR_UNKNOWN | translate }}</div>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{::\'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD\' | translate }}</label>\n' +
    '                <input name="oldPassword" ng-model="changePasData.old_password"\n' +
    '                       type="password" ng-required="change_password.$submitted" pip-clear-errors/>\n' +
    '\n' +
    '                <div ng-messages="errorsWithHint(form, form.oldPassword)">\n' +
    '                    <div ng-message="required">{{::\'ERROR_REQUIRED\' | translate }}</div>\n' +
    '                    <div ng-message="ERROR_1107">{{::\'ERROR_WRONG_PASSWORD\' | translate }}</div>\n' +
    '                </div>\n' +
    '\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{ \'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD\' | translate }}</label>\n' +
    '                <input name="newPassword" ng-model="changePasData.new_password"\n' +
    '                       ng-change="onCheckRepeatPassword()"\n' +
    '                       ng-minlength="6" type="password" ng-required="change_password.$submitted" pip-clear-errors/>\n' +
    '                <div class="hint" ng-if="errorsWithHint(form, form.newPassword).hint">{{ \'HINT_PASSWORD\' | translate }}</div>\n' +
    '                <div ng-messages="errorsWithHint(form, form.newPassword)">\n' +
    '                    <div ng-message="required">{{::\'ERROR_REQUIRED\' | translate }}</div>\n' +
    '                    <div ng-message="minlength">{{::\'HINT_PASSWORD\' | translate }}</div>\n' +
    '                    <div ng-message="ERROR_1105">{{::\'ERROR_IDENTICAL_PASSWORDS\' | translate }}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{ \'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD\' | translate }}</label>\n' +
    '                <input name="repeat" ng-model="repeat" ng-change="onCheckRepeatPassword()"\n' +
    '                       ng-minlength="6" type="password" ng-required="change_password.$submitted"/>\n' +
    '\n' +
    '                <div class="hint" ng-if="errorsRepeatWithHint(form.repeat).hint">{{::\'HINT_REPEAT_PASSWORD\' | translate }}</div>\n' +
    '                <div ng-messages="errorsRepeatWithHint(form.repeat)">\n' +
    '                    <div ng-message="required">{{::\'ERROR_REQUIRED\' | translate }}</div>\n' +
    '                    <div ng-message="minlength">{{::\'HINT_PASSWORD\' | translate }}</div>\n' +
    '                    <div ng-message="repeat">{{::\'REPEAT_PASSWORD_INVALID\' | translate }}</div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button ng-click="onCancel()" aria-label="xxx">{{::\'CANCEL\' | translate }} </md-button>\n' +
    '            <md-button type="submit" class="md-accent" aria-label="xxx">{{::\'APPLY\' | translate : module}}  </md-button>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    </form>\n' +
    '</md-dialog>\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '');
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
    '\n' +
    '    <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top">\n' +
    '    </md-progress-linear>\n' +
    '    <div class="pip-details-title">\n' +
    '        <p class="pip-title bm16">{{::\'SETTINGS_ACTIVE_SESSIONS_TITLE\' | translate}}</p>\n' +
    '\n' +
    '        <p class="pip-subtitle">{{::\'SETTINGS_ACTIVE_SESSIONS_SUBTITLE\' | translate}}</p>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '<md-list class="w-stretch">\n' +
    '    <md-item ng-repeat="session in sessions" >\n' +
    '        <div layout="row" ng-init="showBlock = session.id != sessionId"\n' +
    '                          ng-click="showBlock = !showBlock" >\n' +
    '            <p class="m0 text-subhead2 text-overflow max-w50-stretch" >{{session.client}}</p>\n' +
    '            <p class="m0 lp4 text-body1 color-secondary-text flex">{{::\'SETTINGS_ACTIVE_SESSION_ACTIVE\' | translate}} </p>\n' +
    '            <p class="m0 text-body1 color-secondary-text ">\n' +
    '                {{country}}\n' +
    '                <md-icon ng-if="showBlock" md-svg-icon="icons:triangle-up"></md-icon>\n' +
    '                <md-icon ng-if="!showBlock" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '        <div layout="row" class="bm8 bp8" ng-class="{\' divider-bottom\':!$last}" >\n' +
    '            <div flex="50">\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text " >{{ session.last_req | date : \'medium\' }}</p>\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text " ng-show="showBlock">{{::\'SETTINGS_ACTIVE_SESSION_OS\' | translate}}{{session.platform}}</p>\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text " ng-show="showBlock">{{::\'SETTINGS_ACTIVE_SESSION_IP\' | translate}}{{session.address}}</p>\n' +
    '                <md-button class="md-raised" ng-show="showBlock && session.id != sessionId" ng-click="onRemove(session)">\n' +
    '                    {{::\'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION\' | translate}}\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '\n' +
    '            <pip-location-ip class="map-edit" ng-if="showBlock" flex="50"\n' +
    '                             pip-ipaddress="session.address"\n' +
    '                             pip-extra-info="country = extraInfo.country">\n' +
    '            </pip-location-ip>\n' +
    '        </div>\n' +
    '\n' +
    '    </md-item>\n' +
    '</md-list>\n' +
    '<div layout="row" layout-align="end center">\n' +
    '    <md-button class="md-raised" ng-show="sessions.length > 1" ng-click="onRemoveAll()">\n' +
    '        {{::\'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS\' | translate}}\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '');
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
    '<md-dialog class="pip-dialog layout-column"  width="440">\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '                <md-progress-linear ng-show="transaction.busy()" md-mode="indeterminate" class="pip-progress-top" >\n' +
    '                </md-progress-linear>\n' +
    '\n' +
    '                <h2>{{::\'VERIFY_EMAIL_TITLE\' | translate}}</h2>\n' +
    '\n' +
    '                <p class="title-padding">{{::\'VERIFY_EMAIL_TEXT_1\' | translate}} </p>\n' +
    '\n' +
    '                <form name=\'form\' novalidate>\n' +
    '                    <div ng-messages="form.$serverError" class="text-error bm8">\n' +
    '                        <div ng-message="ERROR_UNKNOWN">{{ form.$serverError.ERROR_UNKNOWN | translate }}</div>\n' +
    '                    </div>\n' +
    '\n' +
    '                    <md-input-container class="display  bp4 md-block" >\n' +
    '                        <label>{{::\'EMAIL\' | translate}}</label>\n' +
    '                        <input name="email" type="email" ng-model="data.email" required step="any"\n' +
    '                               pip-clear-errors  tabindex="1"\n' +
    '                               ng-disabled="transaction.busy()"\n' +
    '                               pip-test="input-email"/>\n' +
    '                        <div class="hint" ng-if="errorsWithHint(form, form.email).hint">{{::\'HINT_EMAIL\' | translate}}</div>\n' +
    '                        <div ng-messages="errorsWithHint(form, form.email)"\n' +
    '                             xng-if="!form.email.$pristine">\n' +
    '                            <div ng-message="required">{{::\'ERROR_EMAIL_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1106">{{::\'ERROR_USER_NOT_FOUND\' | translate}}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <md-input-container class="md-block">\n' +
    '                        <label>{{::\'ENTRY_VERIFICATION_CODE\' | translate}}</label>\n' +
    '                        <input name="code" ng-disabled="transaction.busy()" tabindex="0"\n' +
    '                               ng-model="data.code" required pip-clear-errors/>\n' +
    '                        <div ng-messages="errorsWithHint(form, form.code)">\n' +
    '                            <div ng-message="required"> {{::\'ERROR_CODE_INVALID\' | translate }}</div>\n' +
    '                            <div ng-message="ERROR_1103"> {{::\'ERROR_CODE_WRONG\' | translate }}</div>\n' +
    '                        </div>\n' +
    '                    </md-input-container>\n' +
    '\n' +
    '                    <p>\n' +
    '                        {{::\'VERIFY_EMAIL_TEXT_21\' | translate}}\n' +
    '                        <a ng-click="onRequestVerificationClick()" class="pointer" tabindex="0">{{::\'VERIFY_EMAIL_RESEND\' | translate}}</a>\n' +
    '                        {{::\'VERIFY_EMAIL_TEXT_22\' | translate}}\n' +
    '                    </p>\n' +
    '                </form>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="pip-footer">\n' +
    '            <md-button ng-click="onCancel()" ng-hide="transaction.busy()" aria-label="xxx">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-accent" ng-click="onVerify()" ng-hide="transaction.busy()" tabindex="0" aria-label="xxx"\n' +
    '                ng-disabled="data.code.length == 0 || data.email.length == 0 || (!data.email && form.$pristine) || (!data.code)">\n' +
    '                {{::\'VERIFY\' | translate}}\n' +
    '            </md-button>\n' +
    '            <md-button class="md-warn" ng-show="transaction.busy()" ng-click="transaction.abort()" tabindex="0" aria-label="xxx">\n' +
    '                {{::\'CANCEL\' | translate}}\n' +
    '            </md-button>\n' +
    '\n' +
    '        </div>\n' +
    '</md-dialog>');
}]);
})();

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSettings.Service', []);

    thisModule.provider('pipSettings', ['pipAuthStateProvider', function (pipAuthStateProvider) {

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
    }]);

})(window.angular, window._);


(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipSettings.Page', [
        'pipState', 'pipSettings.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipSettings.Templates'
    ]);

    thisModule.config(['pipAuthStateProvider', function (pipAuthStateProvider) {
        pipAuthStateProvider.state('settings', {
            url: '/settings?party_id',
            auth: true,
            controller: 'pipSettingsPageController',
            templateUrl: 'settings_page/settings_page.html'
        });
    }]);

    thisModule.controller('pipSettingsPageController', ['$scope', '$state', '$rootScope', 'pipAppBar', 'pipSettings', function ($scope, $state, $rootScope, pipAppBar, pipSettings) {

        $scope.pages = _.filter(pipSettings.getPages(), function (page) {
            if (page.visible === true && (page.access ? page.access($rootScope.$user, page) : true)) {
                return page;
            }
        });

        $scope.pages = _.sortBy($scope.pages, function (page) {
            return page.index;
        });

        $scope.selected = {};
        if ($state.current.name != 'settings')
            initSelect($state.current.name);
        else {
            if (pipSettings.getDefaultPage())
                initSelect(pipSettings.getDefaultPage().state);
            else {
                setTimeout(function () {
                    if (pipSettings.getDefaultPage())
                        initSelect(pipSettings.getDefaultPage().state);
                    else {
                        if ($scope.pages.length > 0)
                            initSelect($scope.pages[0].state);

                    }
                }, 0);

            }

        }

        appHeader();

        $scope.onNavigationSelect = onNavigationSelect;
        $scope.onDropdownSelect = onDropdownSelect;

        return;

        function appHeader() {
            pipAppBar.showMenuNavIcon();
            pipAppBar.showTitleText('SETTINGS_TITLE');
            pipAppBar.showLocalActions(null, []);
            pipAppBar.showShadowSm();
            pipAppBar.hideSearch();
        }

        function onDropdownSelect(state) {
            onNavigationSelect(state.state);
        }

        function onNavigationSelect(state) {
            initSelect(state);

            if ($scope.selected.page) {
                $state.go(state);
            }
        }

        function initSelect(state) {
            $scope.selected.page = _.find($scope.pages, function (page) {
                return page.state == state;
            });
            $scope.selected.pageIndex = _.indexOf($scope.pages, $scope.selected.page);
            $scope.selected.pageId = state;
        }
    }]);


})(window.angular, window._);
/**
 * @file Settings page logic
 * @copyright Digital Living Software Corp. 2014-2016
 */


(function () {
    'use strict';

    var thisModule = angular.module('pipUserSettings', [
        'ngMaterial', 'pipData',
        'pipSettings.Service',
        'pipSettings.Page',

        'pipUserSettings.Data',
        'pipUserSettings.Strings',
        'pipUserSettings.BasicInfo',
        'pipUserSettings.Sessions',
        'pipSettings.Templates'

    ]);

})();
/**
 * @file Settings basic info controller
 * @copyright Digital Living Software Corp. 2014-2016
 */


(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.BasicInfo', ['pipUserSettings.ChangePassword', 'pipUserSettings.VerifyEmail']);

    thisModule.config(['pipSettingsProvider', function (pipSettingsProvider) {
        pipSettingsProvider.addPage({
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

        pipSettingsProvider.setDefaultPage('basic_info');
    }]);

    thisModule.controller('pipUserSettingsBasicInfoController',
        ['$scope', '$rootScope', '$mdDialog', '$state', 'pipTranslate', 'pipTransaction', 'pipFormErrors', 'pipUserSettingsPageData', 'pipToasts', '$window', 'pipTheme', '$mdTheming', function ($scope, $rootScope, $mdDialog, $state, pipTranslate, pipTransaction, pipFormErrors,
                  pipUserSettingsPageData, pipToasts, $window, pipTheme, $mdTheming) {

            $scope.originalParty = angular.toJson($rootScope.$party);

            $scope.nameCopy = $rootScope.$party.name;
            setTimeout(function () {
                $scope.loc_pos = $rootScope.$party.loc_pos;
                $scope.$apply();
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

            return;

            //-----------------------------

            function onPictureChanged($control) {
                $scope.picture.save(
                    function () {
                        $rootScope.$broadcast('pipPartyAvatarUpdated');

                    },
                    function (error) {
                        console.error(error);
                    }
                );
            }

            function onPictureCreated($event) {
                $scope.picture = $event.sender;
                $scope.picture.save(
                    function () {
                        $rootScope.$broadcast('pipPartyAvatarUpdated');
                    },
                    function (error) {
                        console.error(error);
                    }
                );
            }

            function saveChanges() {
                if ($scope.form)
                    $scope.form.$setSubmitted();

                if ($rootScope.$party) {

                    if ($rootScope.$party.type == 'person' && $scope.form.$invalid) return;

                    // Check to avoid unnecessary savings
                    $rootScope.$party.loc_pos = $scope.loc_pos;
                    var party = angular.toJson($rootScope.$party);

                    if (party != $scope.originalParty) {
                        pipUserSettingsPageData.updateParty($scope.transaction, $rootScope.$party,
                            function (data) {
                                $scope.originalParty = party;
                                $scope.nameCopy = data.name;
                            }, function (error) {
                                $scope.message = String() + 'ERROR_' + error.status || error.data.status_code;
                                //pipToasts.showNotification(pipTranslate.translate($scope.message), null, null, null);
                                $rootScope.$party = angular.fromJson($scope.originalParty);
                            }
                        );
                    }
                }

            }

            function updateUser() {

                //if ($rootScope.$user.theme)
                //pipTheme.setCurrentTheme($rootScope.$user.theme);

                if ($rootScope.$user.id == $rootScope.$party.id) {
                    pipUserSettingsPageData.updateUser($scope.transaction, $rootScope.$user,
                        function (data) {
                            pipTranslate.use(data.language);
                            $rootScope.$user.language = data.language;
                            $rootScope.$user.theme = data.theme;
                            if ($rootScope.$user.theme)
                                pipTheme.setCurrentTheme($rootScope.$user.theme, true);


                            // $window.location.reload();

                        }, function (error) {
                            var message = String() + 'ERROR_' + error.status || error.data.status_code;
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                            //$scope.user.language =  angular.fromJson($scope.originalParty).language;
                            //$scope.user.theme = angular.fromJson($scope.originalParty).theme;
                        }
                    );
                }


            }

            function onChangePassword(event) {
                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_change_password.html',
                    controller: 'pipUserSettingsChangePasswordController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        if (answer) {
                            var message = String() + 'RESET_PWD_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);
                        }
                    });
            }

            function onVerifyEmail(event) {
                $mdDialog.show({
                    templateUrl: 'user_settings/user_settings_verify_email.html',
                    controller: 'pipUserSettingsVerifyEmailController',
                    targetEvent: event,
                    locals: {email: $rootScope.$party.email}
                }).then(
                    function (answer) {
                        $scope.user.email_ver = answer;
                        if (answer) {
                            var message = String() + 'VERIFY_EMAIL_SUCCESS_TEXT';
                            pipToasts.showNotification(pipTranslate.translate(message), null, null, null);

                        }
                    }
                );
            }
        }]
    );

})(window.angular, window._);

/**
 * @file Settings change password controller
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.ChangePassword', []);
	
    thisModule.controller('pipUserSettingsChangePasswordController',
        ['$scope', '$rootScope', '$mdDialog', 'pipRest', 'pipTransaction', 'pipFormErrors', 'email', function($scope, $rootScope, $mdDialog, pipRest, pipTransaction, pipFormErrors, email) {
        
            $scope.transaction = pipTransaction('settings.change_password', $scope);
            $scope.errorsRepeatWithHint = function (form,formPart) {
                if ($scope.showRepeatHint)  
                    return pipFormErrors.errorsWithHint(form, formPart);
                else return { };
            };
            $scope.showRepeatHint = true;
            $scope.changePasData = {};
            
            $scope.errorsWithHint = pipFormErrors.errorsWithHint;
            $scope.onCancel = onCancel;
            $scope.onCheckRepeatPassword = onCheckRepeatPassword;
            $scope.onApply = onApply;
    
            return;
            
            //-----------------------------
            
            function onCancel() {
                $mdDialog.cancel();
            };
    
            function onCheckRepeatPassword() {
                if ($scope.changePasData)
                    if ($scope.repeat === $scope.changePasData.new_password || $scope.repeat == "" || !$scope.repeat) {
                        $scope.form.repeat.$setValidity('repeat', true);
                        if ($scope.repeat === $scope.changePasData.new_password)
                            $scope.showRepeatHint = false;
                        else
                            $scope.showRepeatHint = true;
                    }
                    else {
                        $scope.showRepeatHint = true;
                        $scope.form.repeat.$setValidity('repeat', false);
                    }
            };
    
            function onApply() {
                $scope.onCheckRepeatPassword();
    
                if ($scope.form.$invalid) return;
    
                if (!$scope.transaction.begin('CHANGE_PASSWORD')) return;
    
                $scope.changePasData.email = email;
    
                pipRest.changePassword().call(
                    $scope.changePasData,
                    function (data) {
                        $scope.transaction.end();
                        $mdDialog.hide(true);
                    },
                    function (error) {
                        $scope.transaction.end(error);
    
                        //pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            { 
                                1107 : 'oldPassword', 
                                1105 : 'newPassword' 
                            }
                        );
                    }
                );
            };
        }]
    );
	
})(window.angular);

/**
 * @file Settings data model
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Data', ['pipDataModel']);

    thisModule.provider('pipUserSettingsPageData', function () {

        this.readContactsResolver = /* @ngInject */
            ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.getOwnContacts().get({
                    party_id: pipRest.partyId($stateParams),
                    session_id: pipRest.sessionId()
                }).$promise;
            }];

        this.readBlocksResolver = /* @ngInject */
            ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.connectionBlocks().query({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            }];

        this.readSessionsResolver = /* @ngInject */
            ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.userSessions().query({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            }];

        this.readActivitiesResolver = /* @ngInject */
            ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.partyActivities().page({
                    party_id: pipRest.partyId($stateParams),
                    paging: 1,
                    skip: 0,
                    take: 25
                }).$promise;
            }];

        this.readSettingsResolver = /* @ngInject */
            ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.partySettings().get({
                    party_id: pipRest.partyId($stateParams)
                }).$promise;
            }];

        this.readSessionIdResolver = /* @ngInject */
            ['$stateParams', 'pipRest', function ($stateParams, pipRest) {
                return pipRest.sessionId();
            }];

        // CRUD operations and other business methods

        this.$get = ['pipRest', '$stateParams', function (pipRest, $stateParams) {
            return {
                partyId: pipRest.partyId,

                updateParty: function (transaction, party, successCallback, errorCallback) {
                    var tid = transaction.begin('UPDATING');
                    if (!tid) return;

                    pipRest.parties().update(
                        party,
                        function (updatedParty) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(updatedParty);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                saveContacts: function (transaction, contacts, successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');
                    if (!tid) return;

                    pipRest.contacts().save(
                        contacts,
                        function (savedContacts) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(savedContacts);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                updateContact: function (transaction, contact, successCallback, errorCallback) {
                    var tid = transaction.begin('UPDATING');
                    if (!tid) return;

                    pipRest.contacts().update(
                        contact,
                        function (updatedContact) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();
                            if (successCallback) successCallback(updatedContact);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                updateUser: function (transaction, user, successCallback, errorCallback) {
                    var tid = transaction.begin('UPDATING');
                    if (!tid) return;
                    pipRest.users().update(
                        user,
                        function (updatedUser) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(updatedUser);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                removeBlock: function (transaction, block, successCallback, errorCallback) {
                    var tid = transaction.begin('REMOVING');
                    if (!tid) return;

                    pipRest.connectionBlocks().remove(
                        block,
                        function (removedBlock) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(removedBlock);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                removeSession: function (transaction, session, successCallback, errorCallback) {
                    var tid = transaction.begin('REMOVING');
                    if (!tid) return;

                    pipRest.userSessions().remove(
                        {
                            id: session.id,
                            party_id: pipRest.partyId($stateParams)
                        },
                        function (removedSession) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(removedSession);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                requestEmailVerification: function (transaction) {
                    var tid = transaction.begin('RequestEmailVerification');
                    if (!tid) return;

                    pipRest.requestEmailVerification().get(
                        {
                            party_id: pipRest.partyId($stateParams)
                        }, function () {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();
                        }, function (error) {
                            transaction.end(error);
                        }
                    );
                },

                verifyEmail: function (transaction, verifyData, successCallback, errorCallback) {
                    var tid = transaction.begin('Verifying');
                    if (!tid) return;

                    pipRest.verifyEmail().call(
                        verifyData,
                        function (verifyData) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(verifyData);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                saveSettings: function (transaction, settings, successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');
                    if (!tid) return;

                    pipRest.partySettings().save(
                        settings,
                        function (savedSettings) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(savedSettings);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                getPreviousActivities: function (transaction, start, successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');
                    if (!tid) return;

                    pipRest.partyActivities().page(
                        {
                            party_id: pipRest.partyId($stateParams),
                            paging: 1,
                            skip: start,
                            take: 25
                        },
                        function (pagedActivities) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(pagedActivities);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                },

                getRefPreviousEventsActivities: function (transaction, start, ref_type, item, successCallback, errorCallback) {
                    var tid = transaction.begin('SAVING');
                    if (!tid) return;

                    pipRest.partyActivities().page(
                        {
                            party_id: pipRest.partyId($stateParams),
                            paging: 1,
                            skip: start,
                            ref_type: ref_type,
                            ref_id: item.id,
                            take: 25
                        },
                        function (pagedActivities) {
                            if (transaction.aborted(tid)) return;
                            else transaction.end();

                            if (successCallback) successCallback(pagedActivities);
                        },
                        function (error) {
                            transaction.end(error);
                            if (errorCallback) errorCallback(error);
                        }
                    );
                }
            }
        }];
    });

})(window.angular);
/**
 * @file Settings sessions controller
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Sessions', []);

    thisModule.config(['pipSettingsProvider', 'pipUserSettingsPageDataProvider', 'pipAuthStateProvider', function (pipSettingsProvider, pipUserSettingsPageDataProvider,  pipAuthStateProvider) {
        pipSettingsProvider.addPage({
            state: 'sessions',
            index: 3,
            title: 'SETTINGS_ACTIVE_SESSIONS_TITLE',
            stateConfig: {
                url: '/sessions',
                controller: 'pipUserSettingsSessionsController',
                templateUrl: 'user_settings/user_settings_sessions.html',
                auth: true,
                resolve: {
                    sessions: pipUserSettingsPageDataProvider.readSessionsResolver,
                    sessionId: pipUserSettingsPageDataProvider.readSessionIdResolver
                }
            }
        });
    }]);

    thisModule.controller('pipUserSettingsSessionsController',
        ['$scope', 'pipTransaction', 'pipUserSettingsPageData', 'sessions', 'sessionId', function ($scope, pipTransaction, pipUserSettingsPageData, sessions, sessionId) {

            $scope.sessionId = sessionId;
            $scope.transaction = pipTransaction('settings.sessions', $scope);
            $scope.sessions = sessions;

            $scope.onRemoveAll = onRemoveAll;
            $scope.onRemove = onRemove;

            return;
            //-----------------------------

            function onRemoveAll() {
                async.each($scope.sessions, function (session) {
                    if (session.id != $scope.sessionId)
                        $scope.onRemove(session);
                });
            }

            function onRemove(session) {
                if (session.id == $scope.sessionId) return;

                pipUserSettingsPageData.removeSession($scope.transaction, session,
                    function () {
                        $scope.sessions = _.without($scope.sessions, session);
                    }, 
                    function (error) {
                        $scope.message = 'ERROR_' + error.status || error.data.status_code;

                        //$scope.onShowToast(message, 'error');
                    }
                );
            }
        }]
    );
	
})(window.angular, window._);

/**
 * @file Settings string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
 
/* global angular */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.Strings', ['pipTranslate']);

    thisModule.config(['pipTranslateProvider', function(pipTranslateProvider) {

        // Set translation strings for the module
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
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL':'Primary email',
            'SETTINGS_BASIC_INFO_FROM':'User since ',
            'SETTINGS_BASIC_INFO_USER_ID':'User ID',

            'SETTINGS_CHANGE_PASSWORD_TITLE':'Change password',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD':'New password',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD':'Repeat password',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD':'Current password',

            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE':" If you notice any unfamiliar devices or locations, click 'Close Session' to end the session.",
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION':'Close session',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS':'Close active sessions',
            'SETTINGS_ACTIVE_SESSION_OS' : 'OS: ',
            'SETTINGS_ACTIVE_SESSION_IP' : 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE':'active',

            'SETTINGS_BLACKLIST_TITLE': 'Blacklist',
            'SETTINGS_BLACKLIST_SUBTITLE': 'Parties from blacklist will not be able to send you invitations and private messages.',
            'SETTINGS_BLACKLIST_UNBLOCK': 'Unblock',
            'SETTINGS_BLACKLIST_EMPTY':'You have no blocked parties',

            'SETTINGS_CONTACT_INFO_TITLE': 'Contact info',
            'SETTINGS_CONTACT_INFO_EMAIL':'Email',
            'SETTINGS_CONTACT_INFO_ADD_EMAIL':'Add email',
            'SETTINGS_CONTACT_INFO_ADD_PHONE' : 'Add phone',
            'SETTINGS_CONTACT_INFO_ADD_ADDRESS' : 'Add address',
            'SETTINGS_CONTACT_INFO_ADD_ACCOUNT' : 'Add account',
            'SETTINGS_CONTACT_INFO_ADD_URL' : 'Add URL',
            'SETTINGS_CONTACT_INFO_ADDRESS':'Address',
            'SETTINGS_CONTACT_INFO_PHONE':'Phone',
            'SETTINGS_CONTACT_INFO_ACCOUNT_NAME':'Account name',
            'SETTINGS_CONTACT_INFO_URL':'URL',

            'THEME':'Theme',
                        
            //Hints
// определено в entry           'HINT_PASSWORD' : 'Minimum 6 characters',
            'HINT_REPEAT_PASSWORD' : 'Repeat password',

            //Errors
            'ERROR_WRONG_PASSWORD' : 'Wrong password',
            'ERROR_IDENTICAL_PASSWORDS' : 'Old and new passwords are identical',
            'REPEAT_PASSWORD_INVALID' : 'Password does not match',
            'ERROR_EMAIL_INVALID' : 'Please, enter a valid email'
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
            'SETTINGS_BASIC_INFO_PRIMARY_EMAIL':'Основной адрес эл. почты',
            'SETTINGS_BASIC_INFO_FROM':'Начиная с',
            'SETTINGS_BASIC_INFO_USER_ID':'Личный код',

            'SETTINGS_CHANGE_PASSWORD_TITLE':'Изменить пароль',
            'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD':'Новый пароль',
            'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD':'Повтор',
            'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD':'Текущий пароль',

            'SETTINGS_ACTIVE_SESSIONS_SUBTITLE':'Если вы заметили какие-либо незнакомые устройства или месторасположение, нажмите кнопку "Закончить сеанс", чтобы завершить сеанс.',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION':'Закрыть сессию',
            'SETTINGS_ACTIVE_SESSIONS_CLOSE_ACTIVE_SESSIONS':'Закрыть активные сессии',
            'SETTINGS_ACTIVE_SESSION_OS' : 'ОС: ',
            'SETTINGS_ACTIVE_SESSION_IP' : 'IP: ',
            'SETTINGS_ACTIVE_SESSION_ACTIVE': 'Активно',

            'SETTINGS_BLACKLIST_TITLE': 'Блокировки',
            'SETTINGS_BLACKLIST_SUBTITLE': 'Участники из черного списка не смогут посылать вам приглашения и личные сообщения.',
            'SETTINGS_BLACKLIST_UNBLOCK': 'Разблокировать',
            'SETTINGS_BLACKLIST_EMPTY':'У вас нет заблокированных участников',

            'SETTINGS_CONTACT_INFO_TITLE': 'Контакты',
            'SETTINGS_CONTACT_INFO_EMAIL':'Адрес электронной почты',
            'SETTINGS_CONTACT_INFO_ADD_EMAIL':'Добавить адрес эл. почты',
            'SETTINGS_CONTACT_INFO_ADD_PHONE' : 'Добавить телефон',
            'SETTINGS_CONTACT_INFO_ADD_ADDRESS' : 'Добавить адрес',
            'SETTINGS_CONTACT_INFO_ADD_ACCOUNT' : 'Добавить аккаунт',
            'SETTINGS_CONTACT_INFO_ADD_URL' : 'Добавить веб-сайт',
            'SETTINGS_CONTACT_INFO_ADDRESS': 'Адрес',
            'SETTINGS_CONTACT_INFO_PHONE': 'Телефон',
            'SETTINGS_CONTACT_INFO_ACCOUNT_NAME': 'Учетка в мессенджере',
            'SETTINGS_CONTACT_INFO_URL': 'Веб сайт',

            'THEME':'Тема',

            //Hints
// определено в entry               'HINT_PASSWORD' : 'Минимум 6 знаков',
            'HINT_REPEAT_PASSWORD' : 'Повторите пароль',
            
            //Errors
            'ERROR_WRONG_PASSWORD' : 'Неправильный пароль',
            'ERROR_IDENTICAL_PASSWORDS' : 'Старый и новый пароли идентичны',
            'REPEAT_PASSWORD_INVALID' : 'Пароль не совпадает',
            'ERROR_EMAIL_INVALID' : 'Пожалуйста, введите правильный почт.адрес'
        });
    }]);

})(window.angular);
/**
 * @file Settings verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */

/* global angular */

(function (angular) {
    'use strict';

    var thisModule = angular.module('pipUserSettings.VerifyEmail', []);

    thisModule.controller('pipUserSettingsVerifyEmailController',
        ['$scope', '$rootScope', '$mdDialog', 'pipTransaction', 'pipFormErrors', 'pipUserSettingsPageData', 'email', function ($scope, $rootScope, $mdDialog, pipTransaction, pipFormErrors, pipUserSettingsPageData, email) {

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

            return;
            //-----------------------------

            function onAbort() {
                $scope.transaction.abort();
            };

            function onCancel() {
                $mdDialog.cancel();
            };

            function onRequestVerificationClick() {
                pipUserSettingsPageData.requestEmailVerification($scope.transaction);
            };

            function onVerify() {
                $scope.form.$setSubmitted();

                if ($scope.form.$invalid) return;

                pipUserSettingsPageData.verifyEmail(
                    $scope.transaction,
                    $scope.data,
                    function (verifyData) {
                        $mdDialog.hide(true);
                    },
                    function (error) {
                        //pipFormErrors.resetFormErrors($scope.form, true);
                        pipFormErrors.setFormError(
                            $scope.form, error,
                            {
                                1106: 'email',
                                1103: 'code'
                            }
                        );

                    }
                )
            };
        }]
    );

})(window.angular);

//# sourceMappingURL=pip-webui-settings.js.map
