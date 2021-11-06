import { ReactNode, useEffect, useState } from 'react';
import './Window.css';
import hover from '../../assets/hover.wav';

interface WindowProps {
  children: ReactNode;
}

export default function Window({ children }: WindowProps) {
  const audio = new Audio(hover);

  const [focused, setFocused] = useState(true);

  useEffect(() => {
    window.electron.ipcRenderer.on('focus', () => setFocused(true));
    window.electron.ipcRenderer.on('unfocus', () => setFocused(false));
  }, []);

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
          className="corner"
          x1="0"
          y1="0"
          x2="3"
          y2="0"
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
        />
        <line
          className="corner"
          x1="0"
          y1="0"
          x2="0"
          y2="3"
          stroke={style.stroke}
          strokeWidth={style.strokeWidth}
        />
      </svg>
    </div>
  );

  return (
    <div>
      <div style={{ flex: '0 0 auto', bottom: '0'}}>
        {upperLeft({
          transform: 'none',
          top: 0,
          left: 0,
          transitionTimingFunction: focused ? 'linear' : 'ease-in',
          transitionDuration: focused ? '250ms' : '250ms',
          stroke: focused ? '#ffffffdd' : '#ffffffaa',
          strokeWidth: focused ? '3px' : '2px',
        })}
        {upperLeft({
          transform: 'rotate(180deg)',
          bottom: 0,
          right: 0,
          transitionTimingFunction: focused ? 'linear' : 'ease-in',
          transitionDuration: focused ? '250ms' : '0.4s',
          strokeWidth: focused ? '3px' : '2px',
          stroke: focused ? '#ffffffdd' : '#ffffffaa',
        })}
        {upperLeft({
          transform: 'rotate(-90deg)',
          bottom: 0,
          left: 0,
          transitionTimingFunction: focused ? 'linear' : 'ease-in',
          transitionDuration: focused ? '250ms' : '0.4s',
          strokeWidth: focused ? '3px' : '2px',
          stroke: focused ? '#ffffffdd' : '#ffffffaa',
        })}
        {upperLeft({
          transform: 'rotate(90deg)',
          top: 0,
          right: 0,
          transitionTimingFunction: focused ? 'linear' : 'ease-in',
          transitionDuration: focused ? '250ms' : '0.4s',
          strokeWidth: focused ? '3px' : '2px',
          stroke: focused ? '#ffffffdd' : '#ffffffaa',
        })}
      </div>
      <div
        className="background"
        style={{
          backgroundColor: focused ? '#151617dd' : '#101112aa',
          transitionTimingFunction: focused ? 'linear' : 'ease-in',
          transitionDuration: focused ? '250ms' : '0.4s',
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
              onMouseEnter={() => audio.play()}
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
              onMouseEnter={() => audio.play()}
            >
              <div>
                <svg className="button">
                  <line className="button" x1="0" y1="7" x2="8" y2="7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}
