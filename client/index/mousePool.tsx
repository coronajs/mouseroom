import * as React from "react";
require('./mousePool.scss');

interface IMouse {
  position: {
    x: number,
    y: number
  },
  color: string,
  id: string,
}

interface IMousePoolState {
  mouses?: IMouse[],
  initialized?: boolean,
  test?: boolean,
  you?: IMouse,
}

/**
 * Mouse 类，方便初始化
 */
class Mouse implements IMouse {
  constructor(x: number = 0, y: number = 0, color: string = '#000') {
    this.position = {
      x: x,
      y: y
    }
    this.color = color;
  }
  position;
  color;
  id = `${parseInt((Math.random() * 10000).toString())}_${(new Date()).getTime()}`
}

/**
 * 测试函数
 */
let m_width = document.documentElement.clientWidth;
let m_height = document.documentElement.clientHeight;

function addMouse(self: MousePool) {
  let mouses = self.state.mouses;
  let newMouse = new Mouse(
    parseInt((Math.random() * m_width).toString()),
    parseInt((Math.random() * m_height).toString()),
    `rgb(${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())},${parseInt((Math.random() * 255).toString())})`
  )
  mouses.push(newMouse);
  mouses[newMouse.id] = newMouse;
  
  
  let id = newMouse.id;
  self.updateMouses(mouses, () => {
    let xspeed = Math.random() * 4 - 2;
    let yspeed = Math.random() * 4 - 2;
    setInterval(() => {
      xspeed = Math.random() * 4 - 2;
    }, parseInt((Math.random() * 2000).toString()));
    setInterval(() => {
      yspeed = Math.random() * 4 - 2;
    }, parseInt((Math.random() * 2000).toString()));
    
    (function renderLoop() {
      window.requestAnimationFrame(renderLoop);
      let mouse = mouses[id] as IMouse;
      mouse.position.x += xspeed;
      mouse.position.y += yspeed;
      if (mouse.position.x > m_width) {
        mouse.position.x = m_width;
      } else if (mouse.position.x < 0) {
        mouse.position.x = 0;
      }
      if (mouse.position.y > m_height) {
        mouse.position.y = m_height;
      } else if (mouse.position.x < 0) {
        mouse.position.y = 0;
      }
      self.setState({
        mouses: mouses
      });
    })();
  });
}


export default class MousePool extends React.Component<{}, IMousePoolState> {
  constructor(props: {}, context?: any) {
    super(props, context);
    this.state = { 
      initialized: false,
      mouses: [],
      test: true,
      you: new Mouse()
    };
    // TODO: 连接Corona，回调中调用self.initialize
  }
  initialize(mouses: IMouse[] = [], callback?: () => void) {
    this.setState({
      initialized: true,
      mouses: mouses
    }, callback);
  }
  updateMouses(mouses: IMouse[] = [], callback?: () => void) {
    this.setState({
      mouses: mouses
    }, callback)
  }
  handleMouseMove(e: React.MouseEvent) {
    if (this.state.initialized) {
      let you = this.state.you;
      you.position.x = e.pageX;
      you.position.y = e.pageY;
      let self = this;
      this.setState({
        you: you
      }, () => {
        // TODO 向Corona更新自身位置
      });
    }
  }
  render() {
    return (
      <div className="mouse-pool" onMouseMove={this.handleMouseMove.bind(this)}>
        {
          this.state.initialized ? null :
            <div className="loading">Loading...</div>
        }
        {
          this.state.mouses.map(m => {
            return <div className="mouse iconfont icon-shubiao" style={{left: m.position.x, top: m.position.y, color: m.color}} key={m.id}></div>
          })
        }
        {
          this.state.test ?
            <div className="mouse-pool-test">
              <input type="button" value="初始化完成" onClick={() => {this.initialize()}}/>
              <input type="button" value="增加鼠标" onClick={() => addMouse(this)}/>
              <input type="button" value="删除一个鼠标" />
              <span>当前鼠标(id: {this.state.you.id})位置: {this.state.you.position.x}, {this.state.you.position.y}</span>
            </div>
          : null
        }
      </div>
    );
  }
}