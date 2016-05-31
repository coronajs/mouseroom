import * as React from "react";
import {Client} from 'corona-client';
require('./mousePool.scss');

interface IMouse {
  position: {
    x: number,
    y: number
  },
  color: string,
}

type MouseMap = {
  [id: string]: IMouse
}

interface IMousePoolState {
  mouses?: MouseMap,
  initialized?: boolean
}

/**
 * Mouse 类，方便初始化
 */
// class Mouse implements IMouse {
//   constructor(x: number = 0, y: number = 0, color?) {
//     this.position = {
//       x: x,
//       y: y
//     }
//     color = color || `rgb(${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())})`;
//     this.color = color;
//   }
//   position;
//   color;
// }

export default class MousePool extends React.Component<{}, IMousePoolState> {
  // Corona Client
  client: Client
  controller: any
  you: string
  
  constructor(props: {}, context?: any) {
    super(props, context);
    this.state = {
      initialized: false,
      mouses: {},
    };
  }
  componentDidMount() {
    var self = this;
    // 链接Corona
    var client = new Client('ws://localhost:8080/', function (controller) {
      controller.getModels('mouses', 'mouse').then(([mouses, mouse]) => {
        // 设置本身
        self.you = mouse.data._id;
        // 初始化已有鼠标
        self.state.mouses = mouses.dataMap;
        // 更新位置
        mouses.on('*.change', () => { self.updateMouses() })
        // 新增鼠标
        .on('add', () => { self.updateMouses() })
        // 删除鼠标
        .on('remove', () => { self.updateMouses() });
        // 初始化组件
        self.initialize();
      });
      self.controller = controller;
    });
    this.client = client;
  }
  initialize(callback?: () => void) {
    this.setState({
      initialized: true
    }, callback);
  }
  updateMouses(mouses?: MouseMap, callback?: () => void) {
    mouses = mouses || this.state.mouses;
    this.setState({
      mouses: mouses
    }, callback)
  }
  handleMouseMove(e: React.MouseEvent) {
    if (this.state.initialized) {
      // TODO 向Corona更新自身位置
      this.controller.update(e.pageX, e.pageY);
    }
  }
  render() {
    return (
      <div className="mouse-pool" onMouseMove={this.handleMouseMove.bind(this) }>
        {
          this.state.initialized ? null :
            <div className="loading">Loading...</div>
        }
        {
          Object.keys(this.state.mouses).map(key => {
            return <div className="mouse iconfont icon-shubiao" style={{ left: this.state.mouses[key].position.x, top: this.state.mouses[key].position.y, color: this.state.mouses[key].color }} key={key}></div>
          })
        }
      </div>
    );
  }
}