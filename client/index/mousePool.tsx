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
  [id: string]: Mouse
}

interface IMousePoolState {
  mouses?: MouseMap,
  initialized?: boolean
}

/**
 * Mouse 类，方便初始化
 */
class Mouse implements IMouse {
  constructor(x: number = 0, y: number = 0, color?) {
    this.position = {
      x: x,
      y: y
    }
    color = color || `rgb(${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())})`;
    this.color = color;
  }
  position;
  color;
}

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
      controller.getModel('mouses').then((mouses) => {
        // 更新位置
        mouses.on('*.change', (key, prop, value) => {
          let mouse = self.state.mouses[key];
          if (mouse) {
            let mouseMap = self.state.mouses;
            mouseMap[key].position[prop] = value;
            self.updateMouses(mouseMap);
          }
        });
        // 新增鼠标
        mouses.on('add', (id, obj) => {
          let mouseMap = self.state.mouses;
          mouseMap[id] = new Mouse(obj.data.x, obj.data.y);
          self.updateMouses(mouseMap);
        });
        // 删除鼠标
        mouses.on('remove', (id) => {
          let mouseMap = self.state.mouses;
          if (mouseMap[id] != null) {
            delete mouseMap[id];
            self.updateMouses(mouseMap);
          }
        })
        // 初始化已有鼠标
        let mousesMap = self.state.mouses;
        mouses.forEachValue((val, key) => {
          mousesMap[key] = new Mouse(val.x, val.y);
        })
        self.initialize(mousesMap);
      }).then(() => {
        controller.getModel('mouse').then((mouse) => {
          self.you = mouse.data._id;
        });
      });
      self.controller = controller;
    });
    this.client = client;
  }
  initialize(mouses: MouseMap = {}, callback?: () => void) {
    this.setState({
      initialized: true,
      mouses: mouses
    }, callback);
  }
  updateMouses(mouses: MouseMap = {}, callback?: () => void) {
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