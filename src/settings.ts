'use strict';

import { formattingSettings } from 'powerbi-visuals-utils-formattingmodel';

import Model = formattingSettings.Model;
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;

export class AssetSettings extends FormattingSettingsCard {
  public fontSize = new formattingSettings.NumUpDown({
    name: 'fontSize',
    displayName: 'Font Size',
    value: 12,
  });

  public enableFiltering = new formattingSettings.ToggleSwitch({
    name: 'enableFiltering',
    displayName: 'Filter other visuals',
    value: true,
  });

  name = 'assetSettings';
  displayName = 'Asset Settings';

  slices: FormattingSettingsSlice[] = [this.fontSize, this.enableFiltering];
}

export class Settings extends Model {
  public assetSettings: AssetSettings = new AssetSettings();
  cards = [this.assetSettings];
}
