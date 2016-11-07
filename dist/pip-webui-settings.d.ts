declare module pip.settings {




function configureSettingsPageRoutes($stateProvider: any): void;



export interface ISettingsService {
    getDefaultTab(): any;
    showTitleText(newTitleText: any): any;
    showTitleLogo(newTitleLogo: any): any;
    showNavIcon(value: any): any;
    getTabs(): any;
}
export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): any;
    addTab(tabObj: any): any;
}
export class SettingsConfig {
    defaultTab: string;
    tabs: any[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}








}
