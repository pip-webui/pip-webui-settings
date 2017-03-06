// Prevent junk from going into typescript definitions

import {ISettingsService} from '../settings_service/SettingsService';

class SettingsPageController {
    public tabs: any;
    public selected: any;
    public onDropdownSelect: any;

    constructor(
        private $state: ng.ui.IStateService,
        pipNavService: pip.nav.INavService,
        pipSettings: ISettingsService,
        $rootScope: ng.IRootScopeService, 
        $timeout: angular.ITimeoutService
    ) {

        this.tabs = _.filter(pipSettings.getTabs(), function (tab: any) {
                if (tab.visible === true && (tab.access ? tab.access($rootScope['$user'], tab) : true)) {
                    return tab;
                }
            });

        this.tabs = _.sortBy(this.tabs, 'index');

        this.selected = {};
        if (this.$state.current.name !== 'settings') {
            this.initSelect(this.$state.current.name);
        } else if (this.$state.current.name === 'settings' && pipSettings.getDefaultTab()) {
            this.initSelect(pipSettings.getDefaultTab().state);
        } else {
            $timeout(() => {
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
        
        this.onDropdownSelect = (state) => {
            this.onNavigationSelect(state.state);
        }
    }

    private initSelect(state: string) {
        this.selected.tab = _.find(this.tabs, (tab: any) => {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
    }

    public onNavigationSelect(state: string) {
        this.initSelect(state);

        if (this.selected.tab) {
            this.$state.go(state);
        }
    }
}

(() => {

angular.module('pipSettings.Page')
    .controller('pipSettingsPageController', SettingsPageController);
})();