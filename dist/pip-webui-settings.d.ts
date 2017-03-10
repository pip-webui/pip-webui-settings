declare module pip.settings {

export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): SettingsTab;
    addTab(tabObj: SettingsTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}

export interface ISettingsService {
    getDefaultTab(): SettingsTab;
    showTitleText(newTitleText: string): void;
    showTitleLogo(newTitleLogo: any): any;
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): SettingsTab[];
}

export class SettingsTab {
    state: string;
    title: string;
    index: number;
    access: Function;
    visible: boolean;
    stateConfig: SettingsStateConfig;
}
export class SettingsStateConfig {
    url: string;
    auth: boolean;
    templateUrl?: string;
    template?: string;
}
export class SettingsPageSelectedTab {
    tab: SettingsTab;
    tabIndex: number;
    tabId: string;
}
export class SettingsConfig {
    defaultTab: string;
    tabs: SettingsTab[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}





}
