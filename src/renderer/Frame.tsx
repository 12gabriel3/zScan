import React from 'react';
import './Frame.css';
import hover from '../../assets/hover.wav';

export default function Frame() {
  const audio = new Audio(hover);
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
        <line x1="0" y1="0" x2="3" y2="0" stroke="lightgray" strokeWidth="2px" />
        <line x1="0" y1="0" x2="0" y2="3" stroke="lightgray" strokeWidth="2px" />
      </svg>
    </div>
  );
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div className="banner">
        <div className="drag" />
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
