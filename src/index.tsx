import * as React from 'react';
import { render } from 'react-dom';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@contentful/forma-36-react-components';
import { init, FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
const parse = require('csv-parse')

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

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  parseValue(value: string) {
    parse(value, {
      quoting: false,
      relax_column_count: true,
    }, (err: any, output: string[][]) => {
      if (err) {
        console.error(err.message);
      }

      this.setState({ value: output })

      this.props.sdk.field.setValue(output)
        .catch(err => {
          console.log(err)
        });
    })
  }

  readFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files && e.currentTarget.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (evt : any) => {
        this.parseValue(evt.target && evt.target.result);
      }
    }
  };

  render = () => {
    const tableRows = this.state.value;

    return (
      <div>
        <input className="fileInput" type="file" accept=".csv" onChange={event=> {
               this.readFile(event)
          }} ></input>

        {tableRows &&
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
          }
      </div>
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
