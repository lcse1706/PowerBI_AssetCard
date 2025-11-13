/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
import * as React from 'react';

export interface State {
  assetTextLabel: string;
  assetTextValue: string;
  valueTextLabel: string;
  valueTextValue: string;
  size: number;
  background?: string;
  borderWidth?: number;
}

export const initialState: State = {
  assetTextLabel: '',
  assetTextValue: '',
  valueTextLabel: '',
  valueTextValue: '',
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
      assetTextLabel,
      assetTextValue,
      valueTextLabel,
      valueTextValue,
      size,
      background,
      borderWidth,
    } = this.state;

    const style: React.CSSProperties = {
      width: size,
      height: size,
      background,
      borderWidth,
    };

    return (
      <div className="asset-card">
        <p className="asset">{assetTextValue}</p>
        <p className="value">{valueTextValue}</p>
        <button className="info-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
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
