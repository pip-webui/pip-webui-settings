import { SettingsTab } from './SettingsTab';

export interface ISettingsService {
    getDefaultTab(): SettingsTab;
    showTitleText (newTitleText: string): void;
    showTitleLogo(newTitleLogo);
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): SettingsTab[];
}

export interface ISettingsProvider extends ng.IServiceProvider {
    getDefaultTab(): SettingsTab;
    addTab(tabObj: SettingsTab): void;
    setDefaultTab(name: string): void;
    getFullStateName(state: string): string;
}
