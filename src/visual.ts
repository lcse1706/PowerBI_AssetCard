/*
 * Based on "Power BI Custom Visuals CircleCard" sample © Microsoft Corporation
 * Licensed under the MIT License (see LICENSE file for details).
 *
 * Modified by Lukasz Czarniecki © 2025
 */

'use strict';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import powerbi from 'powerbi-visuals-api';
import { FormattingSettingsService } from 'powerbi-visuals-utils-formattingmodel';
import {
  createTooltipServiceWrapper,
  ITooltipServiceWrapper,
} from 'powerbi-visuals-utils-tooltiputils';
import * as d3 from 'd3-selection';

// Power BI type imports
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import ILocalizationManager = powerbi.extensibility.ILocalizationManager;
import FormattingModel = powerbi.visuals.FormattingModel;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import IViewport = powerbi.IViewport;
import ISelectionId = powerbi.extensibility.ISelectionId;
import ISelectionManager = powerbi.extensibility.ISelectionManager;
import VisualTooltipDataItem = powerbi.extensibility.VisualTooltipDataItem;

// Internal imports
import { AssetComp, initialState } from './component';
import { Settings } from './settings';
import './../style/visual.less';

/**
 * AssetCard visual
 * React-based custom Power BI visual showing Asset and Value
 * with selection, drill-through, and tooltips.
 */
export class AssetCard implements IVisual {
  private target: HTMLElement;
  private reactRoot: React.ComponentElement<any, any>;
  private settings: Settings;
  private viewport: IViewport;
  private formattingSettingsService: FormattingSettingsService;
  private localizationManager: ILocalizationManager;

  private host: powerbi.extensibility.visual.IVisualHost;
  private tooltipServiceWrapper: ITooltipServiceWrapper;

  // Selection state
  private selectionManager: ISelectionManager;
  private currentSelectionId: ISelectionId | null = null;
  private currentTooltip: VisualTooltipDataItem[] = [];

  constructor(options: VisualConstructorOptions) {
    // Host services (selection, tooltips, localization)
    this.host = options.host;
    this.selectionManager = this.host.createSelectionManager();

    // Root container
    this.target = options.element;

    // Mount React component
    this.reactRoot = React.createElement(AssetComp, {});
    ReactDOM.render(this.reactRoot, this.target);

    // Formatting
    this.localizationManager = this.host.createLocalizationManager();
    this.formattingSettingsService = new FormattingSettingsService(
      this.localizationManager
    );
    this.settings = new Settings();

    // Tooltips wrapper
    this.tooltipServiceWrapper = createTooltipServiceWrapper(
      this.host.tooltipService,
      this.target
    );

    // Clear selection when clicking poza visualem
    document.addEventListener('click', ev => {
      if (!this.target.contains(ev.target as Node)) {
        this.selectionManager.clear();
      }
    });
  }

  public update(options: VisualUpdateOptions) {
    const dv: DataView | undefined = options.dataViews && options.dataViews[0];
    if (!dv || !dv.categorical) {
      this.clear();
      return;
    }

    // Viewport
    this.viewport = options.viewport;
    const { width, height } = this.viewport;
    const size = Math.min(width, height);

    // Formatting pane
    this.settings =
      this.formattingSettingsService.populateFormattingSettingsModel(
        Settings,
        options.dataViews
      );

    const fontSize = this.settings.assetSettings.fontSize.value;
    const enableFiltering = this.settings.assetSettings.enableFiltering.value;

    // Data
    const catCol = dv.categorical.categories?.[0];
    const valCol = dv.categorical.values?.[0];

    const assetLabel = catCol?.source?.displayName ?? 'Asset';
    const assetValue =
      catCol?.values?.[0] != null ? String(catCol.values[0]) : '';

    const valueLabel = valCol?.source?.displayName ?? 'Value';
    const valueRaw = valCol?.values?.[0];
    const valueText = valueRaw == null ? '' : String(valueRaw);

    // SelectionId for first row (single card)
    this.currentSelectionId = this.host
      .createSelectionIdBuilder()
      .withCategory(catCol, 0)
      .createSelectionId();

    // Tooltip content
    this.currentTooltip = [
      { displayName: assetLabel, value: assetValue },
      { displayName: valueLabel, value: valueText },
    ];

    // Render React
    AssetComp.update({
      size,
      assetTextValue: assetValue,
      valueTextValue: valueText,
      fontSize: fontSize,
    });

    // Tooltips on info icon
    const sel = d3.select(this.target).selectAll('.info-btn');
    this.tooltipServiceWrapper.addTooltip(
      sel,
      () => this.currentTooltip,
      () => this.currentSelectionId
    );

    // Interakcje (filter + drill-through)
    this.attachInteractions(enableFiltering);
  }

  /**
   * Attach click and contextmenu handlers to support selection & drill-through.
   */
  private attachInteractions(enableFiltering: boolean) {
    // LEWY KLIK – filtruje inne visuale (Filter out)
    this.target.onclick = async (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (!this.currentSelectionId) return;

      if (enableFiltering) {
        await this.selectionManager.select(this.currentSelectionId, false);
      }
      // jeśli enableFiltering = false → nic nie robimy (brak filtrowania)
    };

    // PRAWY KLIK – context menu z Drill through (jak w działającej wersji)
    this.target.oncontextmenu = (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();

      if (!this.currentSelectionId) {
        this.selectionManager.showContextMenu(undefined as any, {
          x: ev.clientX,
          y: ev.clientY,
        });
        return;
      }

      // Używamy tego samego wywołania, które wcześniej dawało Drill through
      (this.selectionManager as any).showContextMenu(this.currentSelectionId, {
        x: ev.clientX,
        y: ev.clientY,
      });
    };
  }

  private clear() {
    this.currentTooltip = [];
    this.currentSelectionId = null;
    AssetComp.update(initialState);
  }

  public getFormattingModel(): FormattingModel {
    return this.formattingSettingsService.buildFormattingModel(this.settings);
  }
}

// Keep default export name for the plugin
export class Visual extends AssetCard {}
