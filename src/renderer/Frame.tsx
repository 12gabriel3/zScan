import React from 'react';
import './Frame.css';
import hover from '../../assets/hover.wav';

export default class Frame extends React.Component<
  unknown,
  { focused: boolean }
> {
  audio = new Audio(hover);

  dragging = false;

  constructor(props: unknown) {
    super(props);
    this.state = { focused: true };
  }

  componentDidMount() {
    window.electron.ipcRenderer.on('focus', () =>
      this.setState({ focused: true })
    );
    window.electron.ipcRenderer.on('unfocus', () =>
      this.setState({ focused: false })
    );
  }

  render() {
    const upperLeft = (style: React.CSSProperties) => (
      <div
        style={{
          position: 'absolute',
          top: style.top,
          bottom: style.bottom,
          left: style.left,
          right: style.right,
        }}
      >
        <svg
          className="corner"
          style={{ transform: style.transform, width: '3px', height: '3px' }}
        >
          <line
            x1="0"
            y1="0"
            x2="3"
            y2="0"
            stroke="lightgray"
            strokeWidth="2px"
          />
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="3"
            stroke="lightgray"
            strokeWidth="2px"
          />
        </svg>
      </div>
    );
    const { focused } = this.state;
    return (
      <div
        style={{
          top: '1px',
          bottom: '1px',
          height: 'calc(100vh - 2px)',
          width: 'calc(100vw - 2px)',
          backgroundColor: focused ? '#151617dd' : '#101112aa',
          transition: 'background-color 0.2s ease-in-out',
          border: 'solid 1px',
          borderColor: focused ? '#303235dd' : '#303235aa',
        }}
      >
        <div className="banner">
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className="drag"
            onMouseDown={() => window.electron.ipcRenderer.send('drag')}
          />
          <div className="buttons">
            <button
              type="button"
              onClick={() => window.electron.ipcRenderer.send('close')}
              onMouseEnter={() => this.audio.play()}
            >
              <div>
                <svg className="button">
                  <line className="button" x1="0" y1="1" x2="7" y2="8" />
                  <line className="button" x1="7" y1="1" x2="0" y2="8" />
                </svg>
              </div>
            </button>
            <button
              type="button"
              onClick={() => window.electron.ipcRenderer.send('minimize')}
              onMouseEnter={() => this.audio.play()}
            >
              <div>
                <svg className="button">
                  <line className="button" x1="0" y1="7" x2="8" y2="7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
        {upperLeft({ transform: 'none', top: 0, left: 0 })}
        {upperLeft({
          transform: 'rotate(180deg)',
          bottom: 0,
          right: 0,
        })}
        {upperLeft({
          transform: 'rotate(-90deg)',
          bottom: 0,
          left: 0,
        })}
        {upperLeft({
          transform: 'rotate(90deg)',
          top: 0,
          right: 0,
        })}
      </div>
    );
  }
}
