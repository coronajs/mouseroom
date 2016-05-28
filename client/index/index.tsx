import * as React from "react";
import MousePool from "./mousePool";

export class Index extends React.Component<{}, {}> {
  render() {
    return (
      <div id="MouseZoom">
        <MousePool />
      </div>
    );
  }
}