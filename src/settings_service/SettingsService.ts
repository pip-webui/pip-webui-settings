'use strict';

export class SettingsTab {
    public state: string;
    public title: string;
    public index: string;
    public access: boolean;
    public visible: boolean;
    public stateConfig: any;
}

export interface ISettingsService {
    getDefaultTab();
    showTitleText (newTitleText);
    showTitleLogo(newTitleLogo);
    showNavIcon(value);
    getTabs();
}

export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab();
    addTab(tabObj);
}

export class SettingsConfig {

    public defaultTab: string;
    public tabs: SettingsTab[] = [];
    public titleText: string = 'SETTINGS_TITLE';
    public titleLogo: boolean = null;
    public isNavIcon: boolean = true;

}

class SettingsService implements ISettingsService {
    private _config: SettingsConfig;
    private _rootScope: ng.IRootScopeService;

    public constructor($rootScope: ng.IRootScopeService, 
                       config: SettingsConfig) {
        "ngInject";
        this._rootScope = $rootScope;
        this._config = config;
    }

    public getDefaultTab() {
        var defaultTab;
        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === defaultTab;
        });
        return _.cloneDeep(defaultTab);
    }

    public showTitleText (newTitleText: string) {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }

        return this._config.titleText;
    }

    public showTitleLogo(newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }

        return this._config.titleLogo;
    }

    public showNavIcon(value: boolean) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }

        return this._config.isNavIcon;
    }
    public getTabs() {
        return _.cloneDeep(this._config.tabs);
    }

}

class SettingsProvider implements ISettingsProvider {
    private _service: SettingsService;
    private _config: SettingsConfig = new SettingsConfig();
    private _stateProvider: ng.ui.IStateProvider;

    constructor($stateProvider: ng.ui.IStateProvider) {
        this._stateProvider = $stateProvider;
    }

    public getFullStateName(state): string {
        return 'settings.' + state;
    }

    public getDefaultTab() {
        var defaultTab;

        defaultTab = _.find(this._config.tabs, function (p) {
            return p.state === defaultTab;
        });

        return _.cloneDeep(defaultTab);
    }

    public addTab(tabObj) {
        var existingTab: SettingsTab;

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

        // if we just added first state and no default state is specified
        if (typeof this._config.defaultTab === 'undefined' && this._config.tabs.length === 1) {
            this.setDefaultTab(tabObj.state);
        }
    }

    public setDefaultTab(name: string) {
        // TODO [apidhirnyi] extract expression inside 'if' into variable. It isn't readable now.
        if (!_.find(this._config.tabs, function (tab) {
            return tab.state === 'settings.' + name;
        })) {
            throw new Error('Tab with state name "' + name + '" is not registered');
        }

        this._config.defaultTab = this.getFullStateName(name);
        //this._stateProvider.go(this._config.defaultTab);
            //pipAuthStateProvider.redirect('settings', getFullStateName(name));
    }

    /**
     * Validates passed tab config object
     * If passed tab is not valid it will throw an error
     */

    private validateTab(tabObj: SettingsTab) {
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

    public showTitleText (newTitleText: string): string {
        if (newTitleText) {
            this._config.titleText = newTitleText;
            this._config.titleLogo = null;
        }

        return this._config.titleText;
    }

    public showTitleLogo(newTitleLogo) {
        if (newTitleLogo) {
            this._config.titleLogo = newTitleLogo;
            this._config.titleText = null;
        }

        return this._config.titleLogo;
    }

    public showNavIcon(value) {
        if (value !== null && value !== undefined) {
            this._config.isNavIcon = !!value;
        }

        return this._config.isNavIcon;
    }

    public $get($rootScope, $state) {
        "ngInject";

        if (this._service == null)
            this._service = new SettingsService($rootScope, this._config);
        
        return this._service;
    }
}

angular
    .module('pipSettings.Service')
    .provider('pipSettings', SettingsProvider);

