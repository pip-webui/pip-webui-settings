import { ISettingsService } from '../service/ISettingsService';
import { SettingsTab } from '../service/SettingsTab';
import { SettingsPageSelectedTab } from '../service/SettingsPageSelectedTab';

interface ISettingsPageController {
    tabs: SettingsTab[];
    selected: SettingsPageSelectedTab;
    // onDropdownSelect: Function;
    onNavigationSelect(state: string): void;
}

class SettingsPageController implements ISettingsPageController {
    private _pipTranslate: pip.services.ITranslateService
        
    public tabs: SettingsTab[];
    public selected: SettingsPageSelectedTab;
    // public onDropdownSelect: Function;
    private cleanUpFunc: Function;
    private mediaSizeGtSm: boolean;
    public details: boolean;

    constructor(
        private $state: ng.ui.IStateService,
        private $rootScope: ng.IRootScopeService,
        private $injector: ng.auto.IInjectorService,
        private $timeout: angular.ITimeoutService,
        private $location: ng.ILocationService,
        private pipNavService: pip.nav.INavService,
        private pipSettings: ISettingsService,
        public pipMedia: pip.layouts.IMediaService,
    ) {

        this.translateInit();

        this.mediaSizeGtSm = this.pipMedia('gt-sm');

        this.initTabs();

        if (!this.pipMedia('gt-sm')) {
            this.details = $location.search().details == 'details' ? true : false;
        } else {
            this.details = false;
            this.$location.search('details', 'main');
        }

        this.cleanUpFunc = $rootScope.$on('pipMainResized', () => {
            if (this.mediaSizeGtSm !== this.pipMedia('gt-sm')) {
                this.mediaSizeGtSm = this.pipMedia('gt-sm');

                if (this.pipMedia('gt-sm')) {
                    this.details = false;
                }
                this.appHeader();
            }
        });
        this.appHeader();
        // this.onDropdownSelect = (state) => {
        //     this.onNavigationSelect(state.state);
        // }
    }

    private initTabs(): void {
        this.tabs = _.filter(this.pipSettings.getTabs(), (tab: SettingsTab) => {
            if (tab.visible === true && (tab.access ? tab.access(this.$rootScope['$user'], tab) : true)) {
                return tab;
            }
        });

        this.tabs = _.sortBy(this.tabs, 'index');

        this.selected = new SettingsPageSelectedTab();
        if (this.$state.current.name !== 'settings') {
            this.initSelect(this.$state.current.name);
        } else if (this.$state.current.name === 'settings' && this.pipSettings.getDefaultTab()) {
            this.initSelect(this.pipSettings.getDefaultTab().state);
        } else {
            this.$timeout(() => {
                if (this.pipSettings.getDefaultTab()) {
                    this.initSelect(this.pipSettings.getDefaultTab().state);
                }
                if (!this.pipSettings.getDefaultTab() && this.tabs.length > 0) {
                    this.initSelect(this.tabs[0].state);
                }
            });
        }
    }

    private translateInit() {
        this._pipTranslate = this.$injector.has('pipTranslate') ? <pip.services.ITranslateService>this.$injector.get('pipTranslate') : null;
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
    }
    private toMainFromDetails(): void {
        this.$location.search('details', 'main');
        this.details = false;
        this.appHeader();
    }

    public appHeader(): void {
        this.pipNavService.breadcrumb.breakpoint = 'gt-sm';
        if (!this.pipMedia('gt-sm')) {
            let detailsTitle: string = this.selected && this.selected.tab ? this.selected.tab.title : 'PIP_SETTINGS_DETAILS';
            if (this.details) {
                this.pipNavService.icon.showBack(() => {
                    this.toMainFromDetails();
                });
                this.pipNavService.breadcrumb.items = [
                    <pip.nav.BreadcrumbItem>{
                        title: "PIP_SETTINGS", click: () => {
                            this.toMainFromDetails();
                        }
                    },
                    <pip.nav.BreadcrumbItem>{
                        title: detailsTitle, click: () => { }, subActions: []
                    }
                ];
            } else {
                this.pipNavService.icon.showMenu();
                this.pipNavService.breadcrumb.text = "PIP_SETTINGS";
            }
        } else {
            this.pipNavService.icon.showMenu();
            this.pipNavService.breadcrumb.text = "PIP_SETTINGS";
        }


        this.pipNavService.actions.hide();
        this.pipNavService.appbar.removeShadow();
    }

    private initSelect(state: string): void {
        this.selected.tab = _.find(this.tabs, (tab: SettingsTab) => {
            return tab.state === state;
        });
        this.selected.tabIndex = _.indexOf(this.tabs, this.selected.tab);
        this.selected.tabId = state;
    //    this.$state.go(this.selected.tabId);
    }

    public onNavigationSelect(state: string): void {
        this.initSelect(state);
        if (!this.pipMedia('gt-sm')) {
            this.details = true;
            this.$location.search('details', 'details');
            this.appHeader();
        }
        if (this.selected.tab) {
            this.$state.go(state);
        }
    }
}

angular
    .module('pipSettings.Page')
    .controller('pipSettingsPageController', SettingsPageController);
