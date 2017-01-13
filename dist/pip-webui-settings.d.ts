declare module pip.settings {




function configureSettingsPageRoutes($stateProvider: any): void;



export class SettingsTab {
    state: string;
    title: string;
    index: string;
    access: boolean;
    visible: boolean;
    stateConfig: any;
}
export interface ISettingsService {
    getDefaultTab(): any;
    showTitleText(newTitleText: any): any;
    showTitleLogo(newTitleLogo: any): any;
    setDefaultTab(name: string): any;
    showNavIcon(value: any): any;
    getTabs(): any;
}
export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): SettingsTab;
    addTab(tabObj: any): any;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}
export class SettingsConfig {
    defaultTab: string;
    tabs: SettingsTab[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}







}
