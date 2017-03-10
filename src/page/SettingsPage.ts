import { ISettingsService } from '../service/ISettingsService';
import { SettingsTab } from '../service/SettingsTab';
import { SettingsPageSelectedTab } from '../service/SettingsPageSelectedTab';

interface ISettingsPageController {
    tabs: SettingsTab[];
    selected: SettingsPageSelectedTab;
    onDropdownSelect: Function;
    onNavigationSelect(state: string): void;
}

class SettingsPageController implements ISettingsPageController {
    public tabs: SettingsTab[];
    public selected: SettingsPageSelectedTab;
    public onDropdownSelect: Function;

    constructor(
        private $state: ng.ui.IStateService,
        pipNavService: pip.nav.INavService,
        pipSettings: ISettingsService,
        $rootScope: ng.IRootScopeService, 
        $timeout: angular.ITimeoutService
    ) {

        this.tabs = _.filter(pipSettings.getTabs(), (tab: SettingsTab) => {
                if (tab.visible === true && (tab.access ? tab.access($rootScope['$user'], tab) : true)) {
                    return tab;
                }
            });

        this.tabs = _.sortBy(this.tabs, 'index');

        this.selected = new SettingsPageSelectedTab();
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

    private initSelect(state: string): void {
        this.selected.tab = _.find(this.tabs, (tab: SettingsTab) => {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
    }

    public onNavigationSelect(state: string): void {
        this.initSelect(state);

        if (this.selected.tab) {
            this.$state.go(state);
        }
    }
}

angular
    .module('pipSettings.Page')
    .controller('pipSettingsPageController', SettingsPageController);
