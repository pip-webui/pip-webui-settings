
export class SettingsTab {
    public state: string;
    public title: string;
    public index: number;
    public access: Function;
    public visible: boolean;
    public stateConfig: SettingsStateConfig;
}

export class SettingsStateConfig {
    public url: string;
    public auth: boolean = false;
    public templateUrl?: string;
    public template?: string;
}

export class SettingsPageSelectedTab {
    public tab: SettingsTab;
    public tabIndex: number = 0;
    public tabId: string;
}


export class SettingsConfig {

    public defaultTab: string;
    public tabs: SettingsTab[] = [];
    public titleText: string = 'SETTINGS_TITLE';
    public titleLogo: boolean = null;
    public isNavIcon: boolean = true;

}