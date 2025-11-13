/*
 * Based on "Power BI Custom Visuals CircleCard" sample © Microsoft Corporation
 * Licensed under the MIT License (see LICENSE file for details).
 *
 * Modified by Lukasz Czarniecki © 2025
 */

'use strict';

import { formattingSettings } from 'powerbi-visuals-utils-formattingmodel';

import Model = formattingSettings.Model;
import FormattingSettingsCard = formattingSettings.Card;
import FormattingSettingsSlice = formattingSettings.Slice;

export class AssetSettings extends FormattingSettingsCard {
  //   public circleColor = new formattingSettings.ColorPicker({
  //     name: 'Asset',
  //     displayName: 'Color',
  //     value: { value: 'white' },
  //   });
  //   public circleThickness = new formattingSettings.NumUpDown({
  //     name: 'circleThickness',
  //     displayName: 'Thickness',
  //     value: 2,
  //   });
  //   name: string = 'circle';
  //   displayName: string = 'Size';
  //   slices: FormattingSettingsSlice[] = [this.circleColor, this.circleThickness];

  public fontSize = new formattingSettings.NumUpDown({
    name: 'fontSize',
    displayName: 'Font Size',
    value: 12,
  });

  name: string = 'assetSettings';
  displayName: string = 'Asset Settings';

  slices = [this.fontSize];
}

export class Settings extends Model {
  public assetSettings: AssetSettings = new AssetSettings();
  cards = [this.assetSettings];
}
