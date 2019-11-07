import * as React from 'react';
import { render } from 'react-dom';
import { TextInput, Table, TableHead, TableBody, TableRow, TableCell } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

const parse = require('csv-parse')
const example = `Manufacturer,Coating,U-Value,VLT
SHGC 0.21 - 0.25,,.9,
Glastroesch,Superselekt 60/27T,0.23,0.59`;

interface AppProps {
  sdk: FieldExtensionSDK;
}

interface AppState {
  value?: string[][];
}

export class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      value: props.sdk.field.getValue() || []
    };
  }

  // detachExternalChangeHandler: Function | null = null;

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    // this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
    this.parseValue(example);
  }

  // componentWillUnmount() {
  //   if (this.detachExternalChangeHandler) {
  //     this.detachExternalChangeHandler();
  //   }
  // }

  parseValue(value: string) {
    parse(value, {
      quoting: false,
      relax_column_count: true,
    }, (err: any, output: string[][]) => {
      if (err) {
        console.error(err.message);
      }
      this.setState({ value: output })
    })
  }

  // onExternalChange = (value: string) => {
  //   this.setState({ value });
  // };

  // onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.currentTarget.value;

  //   this.setState({ value });
  //   if (value) {
  //     await this.props.sdk.field.setValue(value);
  //   } else {
  //     await this.props.sdk.field.removeValue();
  //   }
  // };

  render = () => {
    const tableRows = this.state.value;
    console.log(tableRows);
    if (!tableRows || tableRows.length === 0) {
      return null;
    }
    return (
      <Table>
        <TableHead>
          <TableRow>
            {tableRows && tableRows.length > 0 && tableRows[0].map(cell =>
              <TableCell key={cell}>{cell}</TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>{tableRows && tableRows.length > 1 && tableRows.slice(1).map((row, i) =>
          <TableRow key={`row${i}`}>
            {row && row.map((cell, j) =>
              <TableCell key={`${cell}-${j}`}>{cell}</TableCell>
            )}
          </TableRow>
        )}</TableBody>
    </Table>

    );
  };
}

init(sdk => {
  render(<App sdk={sdk as FieldExtensionSDK} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
