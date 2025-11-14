/*
 * Based on "Power BI Custom Visuals CircleCard" sample © Microsoft Corporation
 * Licensed under the MIT License (see LICENSE file for details).
 *
 * Modified by Lukasz Czarniecki © 2025
 */

import * as React from 'react';

export interface State {
  assetTextValue: string;
  valueTextValue: string;
  size: number;
  fontSize?: number;
}

export const initialState: State = {
  assetTextValue: 'Asset Number',
  valueTextValue: 'KPI',
  size: 200,
};

export class AssetComp extends React.Component<object, State> {
  private static updateCallback: (data: object) => void = null;

  public static update(newState: State) {
    if (typeof AssetComp.updateCallback === 'function') {
      AssetComp.updateCallback(newState);
    }
  }

  public state: State = initialState;

  constructor(props: any) {
    super(props);
    this.state = initialState;
  }

  public componentWillMount() {
    AssetComp.updateCallback = (newState: State): void => {
      this.setState(newState);
    };
  }

  public componentWillUnmount() {
    AssetComp.updateCallback = null;
  }

  render() {
    const {
      assetTextValue,
      valueTextValue,
      // size,
      fontSize,
    } = this.state;

    const style: React.CSSProperties = {
      // width: size,
      // height: size,
      fontSize: fontSize,
    };

    return (
      <div className="asset-card">
        <p className="asset" style={style}>
          {assetTextValue}
        </p>
        <p className="value" style={style}>
          {valueTextValue}
        </p>
        <button className="info-btn">
          <svg
            xmlns="https://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#000000"
          >
            <path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
        </button>
      </div>
    );
  }
}

export default AssetComp;
