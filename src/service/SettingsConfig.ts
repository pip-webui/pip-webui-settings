import { SettingsTab } from './SettingsTab';

export class SettingsConfig {
    public defaultTab: string;
    public tabs: SettingsTab[] = [];
    public titleText: string = 'SETTINGS_TITLE';
    public titleLogo: boolean = null;
    public isNavIcon: boolean = true;
}
