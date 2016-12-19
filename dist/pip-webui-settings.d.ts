declare module pip.settings {

import './settings_service/index';
import './settings_page/index';

import './SettingsPageController';
import './SettingsPageRoutes';


function configureSettingsPageRoutes($stateProvider: any): void;


import './SettingsService';

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
    showNavIcon(value: any): any;
    getTabs(): any;
}
export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): any;
    addTab(tabObj: any): any;
}
export class SettingsConfig {
    defaultTab: string;
    tabs: SettingsTab[];
    titleText: string;
    titleLogo: boolean;
    isNavIcon: boolean;
}







}
