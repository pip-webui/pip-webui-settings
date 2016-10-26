(function(module) {
try {
  module = angular.module('pipSettings.Templates');
} catch (e) {
  module = angular.module('pipSettings.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('settings_page/settings_page.html',
    '<md-toolbar class="pip-appbar-ext"></md-toolbar>\n' +
    '<pip-document width="800" min-height="400"\n' +
    '              class="pip-settings">\n' +
    '\n' +
    '    <div class="pip-menu-container"\n' +
    '         ng-hide="manager === false || !tabs || tabs.length < 1">\n' +
    '        <md-list class="pip-menu pip-simple-list hide-xs"\n' +
    '                 pip-selected="selected.tabIndex"\n' +
    '                 pip-selected-watch="selected.navId"\n' +
    '                 pip-select="onNavigationSelect($event.id)">\n' +
    '            <md-list-item class="pip-simple-list-item pip-selectable flex"\n' +
    '                          ng-repeat="tab in tabs track by tab.state" ng-if="$party.id == $user.id ||\n' +
    '                          tab.state == \'settings.basic_info\'|| tab.state ==\'settings.contact_info\'\n' +
    '                          || tab.state ==\'settings.blacklist\'"\n' +
    '                          md-ink-ripple\n' +
    '                          pip-id="{{:: tab.state }}">\n' +
    '                <p>{{::tab.title | translate}}</p>\n' +
    '            </md-list-item>\n' +
    '        </md-list>\n' +
    '\n' +
    '        <div class="pip-content-container" ng-if="selected.tab">\n' +
    '            <pip-dropdown class="hide-gt-xs"\n' +
    '                          pip-actions="tabs"\n' +
    '                          pip-dropdown-select="onDropdownSelect"\n' +
    '                          pip-active-index="selected.tabIndex"></pip-dropdown>\n' +
    '\n' +
    '            <div class="pip-body tp24-flex layout-column" ui-view></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="layout-column layout-align-center-center flex"\n' +
    '         ng-show="manager === false || !tabs || tabs.length < 1">\n' +
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
    '<form name="form" class="w-stretch" novalidate>\n' +
    '    <md-progress-linear class="pip-progress-top"\n' +
    '                        ng-show="transaction.busy()"\n' +
    '                        md-mode="indeterminate"></md-progress-linear>\n' +
    '    <div class="layout-row bm12">\n' +
    '        <div class="md-tile-left">\n' +
    '            <pip-avatar-edit pip-party-id="$party.id"\n' +
    '                             pip-created="onPictureCreated($event)"\n' +
    '                             pip-changed="onPictureChanged($control, $event)">\n' +
    '            </pip-avatar-edit>\n' +
    '        </div>\n' +
    '        <div class="md-tile-content tp0 layout-align-center">\n' +
    '            <h3 class="tm16 bm8 text-one-line">{{ nameCopy }}</h3>\n' +
    '\n' +
    '            <p class="text-primary text-overflow m0">\n' +
    '                {{::\'SETTINGS_BASIC_INFO_FROM\' | translate}}\n' +
    '                {{$user.signup | formatLongDate }}\n' +
    '            </p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <md-input-container class="md-block">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_FULL_NAME\' | translate}}</label>\n' +
    '        <input name="fullName" step="any" type="text" tabindex="0" required\n' +
    '               ng-model="$party.name"\n' +
    '               ng-disabled="transaction.busy()"\n' +
    '               ng-change="onChangeBasicInfo()"/>\n' +
    '\n' +
    '        <div class="hint"\n' +
    '             ng-if="errorsWithHint(form, form.fullName).hint">\n' +
    '            {{::\'ERROR_FULLNAME_INVALID\' | translate}}\n' +
    '        </div>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block bm0">\n' +
    '        <label>{{::\'SETTINGS_BASIC_INFO_PRIMARY_EMAIL\' | translate}}</label>\n' +
    '        <input name="email" type="email" required\n' +
    '               ng-model="$party.email"\n' +
    '               ng-change="onChangeBasicInfo()"\n' +
    '               pip-email-unique="{{$party.email}}"/>\n' +
    '\n' +
    '        <div class="hint"\n' +
    '             ng-if="errorsWithHint(form, form.email).hint && !$user.email_ver">\n' +
    '            {{::\'SETTINGS_BASIC_INFO_VERIFY_HINT\' | translate}}\n' +
    '        </div>\n' +
    '        <div ng-messages="errorsWithHint(form.email)" ng-hide=" $party.type ==\'team\'">\n' +
    '            <div ng-message="email">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div>\n' +
    '            <div ng-message="emailUnique">{{::\'ERROR_EMAIL_INVALID\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-button class="md-raised bm16 tm8 rm8"\n' +
    '               ng-click="onVerifyEmail($event)"\n' +
    '               ng-hide="$user.email_ver || $party.type ==\'team\'">\n' +
    '        {{::\'SETTINGS_BASIC_INFO_VERIFY_CODE\' | translate}}\n' +
    '    </md-button>\n' +
    '\n' +
    '    <md-button ng-click="onChangePassword($event)" class="md-raised bm16 tm8" ng-hide="$party.type ==\'team\'">\n' +
    '        {{::\'SETTINGS_BASIC_INFO_CHANGE_PASSWORD\' | translate}}\n' +
    '    </md-button>\n' +
    '\n' +
    '    <md-input-container class="md-block flex">\n' +
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
    '        <pip-date ng-model="$party.birthday"\n' +
    '                  ng-change="onChangeBasicInfo()"\n' +
    '                  pip-time-mode="past\n' +
    '                  time-mode="past"></pip-date>\n' +
    '    </div>\n' +
    '\n' +
    '    <md-input-container class="md-block"\n' +
    '                        ng-hide="$party.type ==\'team\'">\n' +
    '        <label>{{::\'LANGUAGE\' | translate}}</label>\n' +
    '        <md-select placeholder="{{\'LANGUAGE\' | translate}}"\n' +
    '                   ng-model="$user.language"\n' +
    '                   ng-change="onChangeUser()">\n' +
    '            <md-option ng-value="language.id"\n' +
    '                       ng-repeat="language in languages">\n' +
    '                {{language.name}}\n' +
    '            </md-option>\n' +
    '        </md-select>\n' +
    '    </md-input-container>\n' +
    '\n' +
    '    <md-input-container class="md-block"\n' +
    '                        ng-if="$party.type !=\'team\'">\n' +
    '        <label>{{::\'THEME\' | translate}}</label>\n' +
    '        <md-select class="w-stretch theme-text-primary"\n' +
    '                   ng-model="$user.theme"\n' +
    '                   ng-change="onChangeUser()"\n' +
    '                   ng-disabled="transaction.busy()">\n' +
    '            <md-option ng-value="theme"\n' +
    '                       ng-repeat="theme in themes"\n' +
    '                       ng-selected="$theme == theme ? true : false">\n' +
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
    '<md-dialog class="pip-dialog layout-column"  width="440">\n' +
    '    <form name="form" ng-submit="onApply()" >\n' +
    '    <div class="pip-header">\n' +
    '        <h3 class="m0">\n' +
    '            {{::\'SETTINGS_CHANGE_PASSWORD_TITLE\' | translate : module}}\n' +
    '        </h3>\n' +
    '    </div>\n' +
    '    <div class="pip-body">\n' +
    '        <div class="pip-content">\n' +
    '            <div class="text-error bm8"\n' +
    '                 ng-messages="form.$serverError">\n' +
    '                <div ng-message="ERROR_UNKNOWN">\n' +
    '                    {{ form.$serverError.ERROR_UNKNOWN | translate }}\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{::\'SETTINGS_CHANGE_PASSWORD_CURRENT_PASSWORD\' | translate }}</label>\n' +
    '                <input name="oldPassword" type="password"\n' +
    '                       ng-model="changePasData.old_password"\n' +
    '                       ng-required="change_password.$submitted"\n' +
    '                       pip-clear-errors/>\n' +
    '\n' +
    '                <div ng-messages="errorsWithHint(form, form.oldPassword)">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'ERROR_REQUIRED\' | translate }}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1107">\n' +
    '                        {{::\'ERROR_WRONG_PASSWORD\' | translate }}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{\'SETTINGS_CHANGE_PASSWORD_NEW_PASSWORD\' | translate }}</label>\n' +
    '                <input name="newPassword" type="password"\n' +
    '                       ng-model="changePasData.new_password"\n' +
    '                       ng-change="onCheckRepeatPassword()"\n' +
    '                       ng-required="change_password.$submitted"\n' +
    '                       ng-minlength="6"\n' +
    '                       pip-clear-errors/>\n' +
    '                <div class="hint"\n' +
    '                     ng-if="errorsWithHint(form, form.newPassword).hint">\n' +
    '                    {{ \'HINT_PASSWORD\' | translate }}\n' +
    '                </div>\n' +
    '                <div ng-messages="errorsWithHint(form, form.newPassword)">\n' +
    '                    <div ng-message="required">\n' +
    '                        {{::\'ERROR_REQUIRED\' | translate}}\n' +
    '                    </div>\n' +
    '                    <div ng-message="minlength">\n' +
    '                        {{::\'HINT_PASSWORD\' | translate }}\n' +
    '                    </div>\n' +
    '                    <div ng-message="ERROR_1105">\n' +
    '                        {{::\'ERROR_IDENTICAL_PASSWORDS\' | translate }}\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </md-input-container>\n' +
    '\n' +
    '            <md-input-container class="md-block">\n' +
    '                <label>{{ \'SETTINGS_CHANGE_PASSWORD_REPEAT_RASSWORD\' | translate }}</label>\n' +
    '                <input name="repeat"  type="password"\n' +
    '                       ng-model="repeat"\n' +
    '                       ng-change="onCheckRepeatPassword()"\n' +
    '                       ng-required="change_password.$submitted"\n' +
    '                       ng-minlength="6" />\n' +
    '\n' +
    '                <div class="hint"\n' +
    '                     ng-if="errorsRepeatWithHint(form.repeat).hint">\n' +
    '                    {{::\'HINT_REPEAT_PASSWORD\' | translate }}\n' +
    '                </div>\n' +
    '\n' +
    '                <div ng-messages="errorsRepeatWithHint(form.repeat)">\n' +
    '                    <div ng-message="required">{{::\'ERROR_REQUIRED\' | translate }}</div>\n' +
    '                    <div ng-message="minlength">{{::\'HINT_PASSWORD\' | translate }}</div>\n' +
    '                    <div ng-message="repeat">{{::\'REPEAT_PASSWORD_INVALID\' | translate }}</div>\n' +
    '                </div>\n' +
    '\n' +
    '            </md-input-container>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="pip-footer">\n' +
    '        <div>\n' +
    '            <md-button aria-label="xxx"\n' +
    '                       ng-click="onCancel()">\n' +
    '                {{::\'CANCEL\' | translate }}\n' +
    '            </md-button>\n' +
    '            <md-button type="submit" class="md-accent" aria-label="xxx">\n' +
    '                {{::\'APPLY\' | translate : module}}\n' +
    '            </md-button>\n' +
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
    '    <div class="pip-details-title pip-sessions">\n' +
    '        <p class="pip-title bm16">\n' +
    '            {{::\'SETTINGS_ACTIVE_SESSIONS_TITLE\' | translate}}\n' +
    '        </p>\n' +
    '\n' +
    '        <p class="pip-subtitle">\n' +
    '            {{::\'SETTINGS_ACTIVE_SESSIONS_SUBTITLE\' | translate}}\n' +
    '        </p>\n' +
    '    </div>\n' +
    '\n' +
    '\n' +
    '<md-list class="w-stretch">\n' +
    '    <div ng-repeat="session in sessions" >\n' +
    '        <div class="layout-row"\n' +
    '             ng-init="showBlock = session.id != sessionId"\n' +
    '             ng-click="showBlock = !showBlock" >\n' +
    '            <p class="m0 text-subhead2 text-overflow max-w50-stretch">\n' +
    '                {{::session.client}}\n' +
    '            </p>\n' +
    '            <p class="m0 lp4 text-body1 color-secondary-text flex">\n' +
    '                {{::\'SETTINGS_ACTIVE_SESSION_ACTIVE\' | translate}}\n' +
    '            </p>\n' +
    '            <p class="m0 text-body1 color-secondary-text">\n' +
    '                {{::country}}\n' +
    '                <md-icon ng-if="showBlock" md-svg-icon="icons:triangle-up"></md-icon>\n' +
    '                <md-icon ng-if="!showBlock" md-svg-icon="icons:triangle-down"></md-icon>\n' +
    '            </p>\n' +
    '        </div>\n' +
    '        <div class="layout-row bm8 bp8" ng-class="{\'divider-bottom\':!$last}" >\n' +
    '            <div class="flex-50">\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text ">\n' +
    '                    {{session.last_req | date : \'medium\'}}\n' +
    '                </p>\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text"\n' +
    '                   ng-show="showBlock">\n' +
    '                    {{::\'SETTINGS_ACTIVE_SESSION_OS\' | translate}}{{::session.platform}}</p>\n' +
    '                <p class="m0 bm4 text-body1 text-overflow color-secondary-text"\n' +
    '                   ng-show="showBlock">\n' +
    '                    {{::\'SETTINGS_ACTIVE_SESSION_IP\' | translate}}{{::session.address}}\n' +
    '                </p>\n' +
    '                <md-button class="md-raised"\n' +
    '                           ng-show="showBlock && session.id != sessionId"\n' +
    '                           ng-click="onRemove(session)">\n' +
    '                    {{::\'SETTINGS_ACTIVE_SESSIONS_CLOSE_SESSION\' | translate}}\n' +
    '                </md-button>\n' +
    '            </div>\n' +
    '\n' +
    '            <pip-location-ip class="map-edit flex-50" ng-if="showBlock"\n' +
    '                             pip-ipaddress="session.address"\n' +
    '                             pip-extra-info="country = extraInfo.country">\n' +
    '            </pip-location-ip>\n' +
    '        </div>\n' +
    '\n' +
    '    </div>\n' +
    '</md-list>\n' +
    '<div class="layout-row layout-align-end-center">\n' +
    '    <md-button class="md-raised"\n' +
    '               ng-show="sessions.length > 1"\n' +
    '               ng-click="onRemoveAll()">\n' +
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

/**
 * @file Registration of settings components
 * @copyright Digital Living Software Corp. 2014-2016
 */
(function () {
    'use strict';
    angular.module('pipSettings', [
        'pipSettings.Service',
        'pipSettings.Page'
    ]);
})();

/**
 * @file Service for settings component
 * @copyright Digital Living Software Corp. 2014-2016
 */
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
     */
    thisModule.provider('pipSettings', ['$stateProvider', function ($stateProvider) {
        var defaultTab, tabs = [], titleText = 'SETTINGS_TITLE', titleLogo = null, isNavIcon = true;
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
             */
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
             */
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
             */
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
             */
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
                 */
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
                     */
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
                     */
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
                     */
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
                     */
                    setDefaultTab: setDefaultTab,
                    showTitleText: showTitleText,
                    showTitleLogo: showTitleLogo,
                    showNavIcon: showNavIcon
                };
            }
        };
        /**
         * Appends component abstract state prefix to passed state
         */
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
         */
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
        function showTitleText(newTitleText) {
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
    }]);
})();

/**
 * @file Define controller for a settings tab
 * @copyright Digital Living Software Corp. 2014-2016
 */
(function () {
    'use strict';
    var thisModule = angular.module('pipSettings.Page', [
        'pipSettings.Service', 'pipAppBar', 'pipSelected', 'pipTranslate',
        'pipSettings.Templates', 'pipNavIcon', 'pipActions.Service'
    ]);
    thisModule.config(['$stateProvider', function ($stateProvider) {
        $stateProvider.state('settings', {
            url: '/settings?party_id',
            auth: true,
            controller: 'pipSettingsPageController',
            templateUrl: 'settings_page/settings_page.html'
        });
    }]);
    /**
     * @ngdoc controller
     * @name pipSettings.Page:pipSettingsPageController
     *
     * @description
     * The controller is used for the whole settings tabs and provides
     * navigation menu on the left and load content into right panel.
     * This component is integrated with `'pipAppBar'` component and adapt the tabs header.
     * The component has predefined states `'settings.base_info'` and `'settings.active_sessions'`. Each of these states
     * require user's authorization.
     *
     * @requires pipAppBar
     */
    thisModule.controller('pipSettingsPageController', ['$scope', '$state', '$rootScope', '$timeout', 'pipAppBar', 'pipSettings', 'pipActions', 'pipBreadcrumb', 'pipNavIcon', function ($scope, $state, $rootScope, $timeout, pipAppBar, pipSettings, pipActions, pipBreadcrumb, pipNavIcon) {
        $scope.tabs = _.filter(pipSettings.getTabs(), function (tab) {
            if (tab.visible === true && (tab.access ? tab.access($rootScope.$user, tab) : true)) {
                return tab;
            }
        });
        $scope.tabs = _.sortBy($scope.tabs, 'index');
        $scope.selected = {};
        if ($state.current.name !== 'settings') {
            initSelect($state.current.name);
        }
        else if ($state.current.name === 'settings' && pipSettings.getDefaultTab()) {
            initSelect(pipSettings.getDefaultTab().state);
        }
        else {
            $timeout(function () {
                if (pipSettings.getDefaultTab()) {
                    initSelect(pipSettings.getDefaultTab().state);
                }
                if (!pipSettings.getDefaultTab() && $scope.tabs.length > 0) {
                    initSelect($scope.tabs[0].state);
                }
            });
        }
        appHeader();
        /** @see onNavigationSelect */
        $scope.onNavigationSelect = onNavigationSelect;
        /** @see onDropdownSelect */
        $scope.onDropdownSelect = onDropdownSelect;
        /**
         * Config header panel
         */
        function appHeader() {
            pipActions.hide();
            pipAppBar.part('menu', true);
            pipAppBar.part('actions', 'primary');
            pipAppBar.part('icon', true);
            pipAppBar.part('title', 'breadcrumb');
            pipAppBar.hideShadow();
            pipBreadcrumb.text = 'Settings';
            pipNavIcon.menu();
        }
        /**
         * @ngdoc method
         * @methodOf pipSettings.Page:pipSettingsPageController
         * @name pipSettings.Page:pipSettingsPageController:onDropdownSelect
         *
         * @description
         * Method changes selected tab in the navigation menu and transfer to selected tab(state).
         * It used on mobile screens.
         *
         * @param {Object} state    State configuration object
         */
        function onDropdownSelect(state) {
            onNavigationSelect(state.state);
        }
        /**
         * @ngdoc method
         * @methodOf pipSettings.Page:pipSettingsPageController
         * @name pipSettings.Page:pipSettingsPageController:onNavigationSelect
         *
         * @description
         * Method changes selected tab in the navigation menu and transfer to selected tab(state).
         * It uses on screens more than mobile.
         *
         * @param {string} state    Name of new state
         */
        function onNavigationSelect(state) {
            initSelect(state);
            if ($scope.selected.tab) {
                $state.go(state);
            }
        }
        /**
         * Establish selected tab
         */
        function initSelect(state) {
            $scope.selected.tab = _.find($scope.tabs, function (tab) {
                return tab.state === state;
            });
            $scope.selected.tabIndex = _.indexOf($scope.tabs, $scope.selected.tab);
            $scope.selected.tabId = state;
        }
    }]);
})();

/**
 * @file Settings tab logic
 * @copyright Digital Living Software Corp. 2014-2016
 */
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

/**
 * @file Settings basic info controller
 * @copyright Digital Living Software Corp. 2014-2016
 */
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
    /**
     * @ngdoc controller
     * @name pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
     *
     * @description
     * Controller for the predefined 'basic_info' state.
     * Provides sync changes user's profile with remote profile.
     * On state exit everything is saved on the server.
     */
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
        /** @see onChangePassword */
        $scope.onChangePassword = onChangePassword;
        /** @see onVerifyEmail */
        $scope.onVerifyEmail = onVerifyEmail;
        /** @see onPictureCreated */
        $scope.onPictureCreated = onPictureCreated;
        /** @see onPictureChanged */
        $scope.onPictureChanged = onPictureChanged;
        /** @see updateUser */
        $scope.onChangeUser = _.debounce(updateUser, 2000);
        /** @see saveChanges */
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeBasicInfo
         *
         * @description
         * Saves changes onto server.
         * This method responses on change of the input information.
         * It is updated user's party profile. Also it updates user's profile in $rootScope.
         */
        function saveChanges() {
            if ($scope.form) {
                $scope.form.$setSubmitted();
            }
            if ($rootScope.$party) {
                if ($rootScope.$party.type === 'person' && $scope.form.$invalid) {
                    return;
                }
                // Check to avoid unnecessary savings
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangeUser
         *
         * @description
         * Saves changes onto server.
         * This method responses on change of the user's profile information.
         * Also it updates user's profile in $rootScope.
         */
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onChangePassword
         *
         * @description
         * It opens a dialog panel to change password.
         *
         * @param {Object} event    Triggered event object
         */
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.BasicInfo:pipUserSettingsBasicInfoController
         * @name pipUserSettings.BasicInfo.pipUserSettingsBasicInfoController:onVerifyEmail
         *
         * @description
         * It opens a dialog panel to change password.
         *
         * @param {Object} event    Triggered event object
         */
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

/**
 * @file Settings change password controller
 * @copyright Digital Living Software Corp. 2014-2016
 */
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.ChangePassword', []);
    /**
     * @ngdoc controller
     * @name pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
     *
     * @description
     * Controller for dialog panel of password change.
     */
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
         * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onCancel
         *
         * @description
         * Closes opened dialog panel.
         */
        function onCancel() {
            $mdDialog.cancel();
        }
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
         * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onCheckRepeatPassword
         *
         * @description
         * Validates a password typed into password fields.
         */
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.ChangePassword:pipUserSettingsChangePasswordController
         * @name pipUserSettings.ChangePassword.pipUserSettingsChangePasswordController:onApply
         *
         * @description
         * Approves password change and sends request to the server on password change.
         */
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

/**
 * @file Settings sessions controller
 * @copyright Digital Living Software Corp. 2014-2016
 */
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.Sessions', [
        'pipSettings.Service', 'pipSettings.Page',]);
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
    /**
     * @ngdoc controller
     * @name pipUserSettings.Sessions:pipUserSettingsSessionsController
     *
     * @description
     * Controller provides an interface for managing active sessions.
     */
    thisModule.controller('pipUserSettingsSessionsController', ['$scope', 'pipTransaction', 'pipDataSession', 'sessions', 'sessionId', function ($scope, pipTransaction, pipDataSession, sessions, sessionId) {
        $scope.sessionId = sessionId;
        $scope.transaction = pipTransaction('settings.sessions', $scope);
        $scope.sessions = sessions;
        $scope.onRemoveAll = onRemoveAll;
        $scope.onRemove = onRemove;
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
         * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemoveAll
         *
         * @description
         * Closes all active session.
         */
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.Sessions:pipUserSettingsSessionsController
         * @name pipUserSettings.Sessions.pipUserSettingsSessionsController:onRemove
         *
         * @description
         * Closes passed session.
         *
         * @param {Object} session  Session configuration object
         */
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

/**
 * @file Settings string resources
 * @copyright Digital Living Software Corp. 2014-2016
 */
/* eslint-disable quote-props */
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.Strings', ['pipTranslate']);
    thisModule.config(['pipTranslateProvider', function (pipTranslateProvider) {
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

/**
 * @file Settings verify email controller
 * @copyright Digital Living Software Corp. 2014-2016
 */
(function () {
    'use strict';
    var thisModule = angular.module('pipUserSettings.VerifyEmail', []);
    /**
     * @ngdoc controller
     * @name pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
     *
     * @description
     * Controller for verify email dialog panel.
     */
    thisModule.controller('pipUserSettingsVerifyEmailController', ['$scope', '$rootScope', '$mdDialog', 'pipTransaction', 'pipFormErrors', 'pipDataUser', 'email', function ($scope, $rootScope, $mdDialog, pipTransaction, pipFormErrors, pipDataUser, email) {
        $scope.emailVerified = false;
        $scope.data = {
            email: email,
            code: ''
        };
        $scope.transaction = pipTransaction('settings.verify_email', $scope);
        /** @see onAbort */
        $scope.onAbort = onAbort;
        /** @see onRequestVerificationClick*/
        $scope.onRequestVerificationClick = onRequestVerificationClick;
        $scope.errorsWithHint = pipFormErrors.errorsWithHint;
        /** @see onVerify */
        $scope.onVerify = onVerify;
        /** @see onCancel */
        $scope.onCancel = onCancel;
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
         * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onAbort
         *
         * @description
         * Aborts a verify request.
         */
        function onAbort() {
            $scope.transaction.abort();
        }
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
         * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onCancel
         *
         * @description
         * Closes opened dialog panel.
         */
        function onCancel() {
            $mdDialog.cancel();
        }
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
         * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onRequestVerificationClick
         *
         * @description
         * Sends request to verify entered email.
         */
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
        /**
         * @ngdoc method
         * @methodOf pipUserSettings.VerifyEmail:pipUserSettingsVerifyEmailController
         * @name pipUserSettings.VerifyEmail.pipUserSettingsVerifyEmailController:onVerify
         *
         * @description
         * Initiates request on verify email on the server.
         */
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



//# sourceMappingURL=pip-webui-settings.js.map
