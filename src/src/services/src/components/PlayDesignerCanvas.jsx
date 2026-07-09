import React, { useRef, useEffect, useState } from 'react';

const PlayDesignerCanvas = ({ width = 800, height = 400 }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#1a1a2e');

  useEffect(() => {
    drawCourt();
  }, []);

  const drawCourt = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Court border
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Half court line
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Free throw circles
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;

    // Left free throw circle
    ctx.beginPath();
    ctx.arc(width * 0.25, height / 2, height * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Right free throw circle
    ctx.beginPath();
    ctx.arc(width * 0.75, height / 2, height * 0.2, 0, Math.PI * 2);
    ctx.stroke();

    // Three-point line (left)
    ctx.beginPath();
    ctx.moveTo(0, height * 0.15);
    ctx.lineTo(width * 0.3, height * 0.15);
    ctx.arc(width * 0.25, height / 2, height * 0.35, -Math.PI / 6, Math.PI / 6);
    ctx.lineTo(0, height * 0.85);
    ctx.stroke();

    // Three-point line (right)
    ctx.beginPath();
    ctx.moveTo(width, height * 0.15);
    ctx.lineTo(width * 0.7, height * 0.15);
    ctx.arc(width * 0.75, height / 2, height * 0.35, Math.PI - Math.PI / 6, Math.PI + Math.PI / 6);
    ctx.lineTo(width, height * 0.85);
    ctx.stroke();

    // Baskets (circles)
    ctx.fillStyle = '#FF6B35';
    ctx.beginPath();
    ctx.arc(width * 0.06, height / 2, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.94, height / 2, 8, 0, Math.PI * 2);
    ctx.fill();
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.clearRect(x - 10, y - 10, 20, 20);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, width, height);
      drawCourt();
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'basketball-play.png';
      link.click();
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
      <h3 style={{ color: '#1a1a2e', marginBottom: '15px', fontWeight: '700' }}>✏️ Play Design Whiteboard</h3>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setTool('pen')}
          style={{
            padding: '8px 16px',
            backgroundColor: tool === 'pen' ? '#ff6b35' : '#ffffff',
            color: tool === 'pen' ? '#ffffff' : '#1a1a2e',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          ✏️ Draw
        </button>
        <button
          onClick={() => setTool('eraser')}
          style={{
            padding: '8px 16px',
            backgroundColor: tool === 'eraser' ? '#ff6b35' : '#ffffff',
            color: tool === 'eraser' ? '#ffffff' : '#1a1a2e',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          🗑️ Erase
        </button>
        <button
          onClick={clearCanvas}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          🔄 Clear
        </button>
        <button
          onClick={downloadCanvas}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          ⬇️ Download
        </button>
      </div>

      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: '2px solid #ff6b35',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          cursor: 'crosshair',
          display: 'block',
          width: '100%',
          maxWidth: '800px',
        }}
      />
    </div>
  );
};

export default PlayDesignerCanvas;
