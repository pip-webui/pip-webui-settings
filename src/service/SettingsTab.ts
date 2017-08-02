import { SettingsStateConfig } from './SettingsStateConfig';

export class SettingsTab {
    public state: string;
    public title: string;
    public icon?: string;
    public iconClass?: string;
    public index: number;
    public access: Function;
    public visible: boolean;
    public stateConfig: SettingsStateConfig;
}
