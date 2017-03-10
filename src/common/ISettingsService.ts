import {
    SettingsTab
} from './SettingsConfig';

export interface ISettingsService {
    getDefaultTab(): SettingsTab;
    showTitleText (newTitleText: string): void;
    showTitleLogo(newTitleLogo);
    setDefaultTab(name: string): void;
    showNavIcon(value: boolean): boolean;
    getTabs(): SettingsTab[];
}