import React, { useEffect, useRef, useState, useImperativeHandle } from "react";
import { API } from "../../../api/config";
import "./style.scss";

export interface FaceScannerProps {
  onResult?: (data: any, previewUrl: string) => void;
  hideTrigger?: boolean;
}

const FaceScanner = React.forwardRef<any, FaceScannerProps>((props, ref) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fmRef = useRef<any>(null);
  const camRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [centered, setCentered] = useState(false);
  const [active, setActive] = useState(false);
  const [permission, setPermission] = useState<string>('unknown');
  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any | null>(null);
  const [analyzeLoading, setAnalyzeLoading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{x:number,y:number}>({ x:0,y:0 });
  const offsetStartRef = useRef<{x:number,y:number}>({ x:0,y:0 });
  const scannerRef = useRef<HTMLDivElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    open: openScanner,
    close: closeScanner,
    triggerUpload: () => fileInputRef.current?.click(),
  }));

  const drawFaceOutline = (ctx: CanvasRenderingContext2D, cx: number, cy: number, width: number, height: number) => {
    const w = width / 2;
    const h = height / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - h);
    ctx.bezierCurveTo(cx + w * 0.8, cy - h, cx + w, cy - h * 0.3, cx + w * 0.9, cy - h * 0.1);
    ctx.bezierCurveTo(cx + w * 1.1, cy - h * 0.1, cx + w * 1.1, cy + h * 0.15, cx + w * 0.95, cy + h * 0.15);
    ctx.bezierCurveTo(cx + w * 0.9, cy + h * 0.6, cx + w * 0.4, cy + h, cx, cy + h);
    ctx.bezierCurveTo(cx - w * 0.4, cy + h, cx - w * 0.9, cy + h * 0.6, cx - w * 0.95, cy + h * 0.15);
    ctx.bezierCurveTo(cx - w * 1.1, cy + h * 0.15, cx - w * 1.1, cy - h * 0.1, cx - w * 0.9, cy - h * 0.1);
    ctx.bezierCurveTo(cx - w, cy - h * 0.3, cx - w * 0.8, cy - h, cx, cy - h);
    ctx.closePath();
  };

  const translateKey = (k: string) => {
    const map: Record<string,string> = {
      acne: 'MỤN VIÊM',
      blackheads: 'MỤN ĐẦU ĐEN',
      dark_spots: 'VẾT THÂM',
      pores: 'LỖ CHÂN LÔNG',
      wrinkles: 'NẾP NHĂN',
      score_brightness: 'Độ sáng da',
      score_texture: 'Kết cấu da',
      score_spots: 'Vết thâm/đốm',
      score_pores: 'Lỗ chân lông',
      score_overall: 'Tổng điểm',
    };
    return map[k] || k;
  };

  // start camera and mediapipe when user opens scanner
  const startCamera = async () => {
    setErrorMsg(null);
    try {
      // check permissions API if available
      try {
        // @ts-ignore
        const p = await navigator.permissions.query?.({ name: 'camera' });
        if (p && p.state) setPermission(p.state);
      } catch (pe) {
        // ignore
      }

      // request camera stream first
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' }, audio: false });
      videoRef.current.muted = true;
      videoRef.current.playsInline = true as any;
      videoRef.current.autoplay = true;
      videoRef.current.srcObject = stream;
      setStreamActive(true);
      try { await videoRef.current.play(); } catch (err) { console.warn('video play failed', err); }

      // load MediaPipe FaceMesh (CDN fallback)
      let faceModule: any;
      try { faceModule = await import(/* @vite-ignore */ '@mediapipe/face_mesh'); } catch (e) { faceModule = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js'); }
      const { FaceMesh } = faceModule as any;
      const fm = new FaceMesh({ locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
      fmRef.current = fm;
      fm.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });

      let lastResults: any = null;
      fm.onResults((r: any) => { lastResults = r; });

      setReady(true);

      const loop = async () => {
        if (!fmRef.current || !videoRef.current) return;
        try { await fmRef.current.send({ image: videoRef.current as HTMLVideoElement }); } catch(_) {}

        // render overlay from latest results
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            ctx.clearRect(0,0,canvas.width, canvas.height);
            const frameCx = canvas.width / 2;
            const frameCy = canvas.height / 2;
            // Face aspect ratio is roughly 1:1.4
            const frameH = canvas.height * 0.5; // Make the frame smaller (50% of height)
            const frameW = frameH * 0.75; // Proportional width

            if (lastResults && lastResults.multiFaceLandmarks && lastResults.multiFaceLandmarks.length) {
              const lm = lastResults.multiFaceLandmarks[0];
              const coords = lm.map((p: any) => ({ x: p.x * canvas.width, y: p.y * canvas.height }));
              const xs = coords.map((c: any) => c.x);
              const ys = coords.map((c: any) => c.y);
              const minX = Math.min(...xs);
              const maxX = Math.max(...xs);
              const minY = Math.min(...ys);
              const maxY = Math.max(...ys);
              const faceCx = (minX + maxX) / 2;
              const faceCy = (minY + maxY) / 2;
              const faceDx = maxX - minX;

              const isCentered = Math.abs(faceCx - frameCx) < frameW * 0.35 &&
                                 Math.abs(faceCy - frameCy) < frameH * 0.35 &&
                                 faceDx > frameW * 0.5 && faceDx < frameW * 1.5;
              setCentered(isCentered);

              ctx.save();
              ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.globalCompositeOperation = 'destination-out';
              drawFaceOutline(ctx, frameCx, frameCy, frameW, frameH);
              ctx.fill();
              ctx.globalCompositeOperation = 'source-over';
              ctx.restore();

              ctx.lineWidth = 4;
              ctx.strokeStyle = isCentered ? '#52c41a' : '#a0aec0';
              drawFaceOutline(ctx, frameCx, frameCy, frameW, frameH);
              ctx.stroke();
            } else {
              setCentered(false);
              ctx.save();
              ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.globalCompositeOperation = 'destination-out';
              drawFaceOutline(ctx, frameCx, frameCy, frameW, frameH);
              ctx.fill();
              ctx.globalCompositeOperation = 'source-over';
              ctx.restore();

              ctx.lineWidth = 4;
              ctx.strokeStyle = '#a0aec0';
              drawFaceOutline(ctx, frameCx, frameCy, frameW, frameH);
              ctx.stroke();
            }
          }
        }

        requestAnimationFrame(loop);
      };

      requestAnimationFrame(loop);
    } catch (err: any) {
      console.error('startCamera failed', err);
      setErrorMsg(err?.message || String(err));
      setReady(false);
      setStreamActive(false);
      // if permission denied, reflect that
      try {
        // @ts-ignore
        const p2 = await navigator.permissions.query?.({ name: 'camera' });
        if (p2 && p2.state) setPermission(p2.state);
      } catch (_) {}
    }
  };

  const stopCamera = async () => {
    try {
      if (camRef.current && camRef.current.stop) await camRef.current.stop();
    } catch (e) {}
    try { if (fmRef.current && fmRef.current.close) fmRef.current.close(); } catch (e) {}
    camRef.current = null;
    fmRef.current = null;
    setReady(false);
    setCentered(false);
    setStreamActive(false);
    // stop media tracks if any
    try {
      const v = videoRef.current;
      if (v && v.srcObject) {
        const st = v.srcObject as MediaStream;
        st.getTracks().forEach((t) => { try { t.stop(); } catch (e) {} });
        v.srcObject = null;
      }
    } catch (e) { console.warn('stopCamera: stop tracks failed', e); }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0,0,canvas.width, canvas.height);
    }
  };

  const captureAndSend = async () => {
    const video = videoRef.current;
    if (!video) return;
    const off = document.createElement('canvas');
    // make capture larger: use video natural size if available
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    off.width = w;
    off.height = h;
    const ctx = off.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, off.width, off.height);
    off.toBlob(async (blob) => {
      if (!blob) return;
      // show instant local preview
      const obj = URL.createObjectURL(blob);
      setPreviewUrl(obj);

      const fd1 = new FormData();
      fd1.append('file', blob, 'capture.jpg');
      try {
        const res = await API.post('/ai/predict', fd1, { headers: { 'Content-Type': 'multipart/form-data' } });
        const aiRaw = res.data;
        // immediately call analyze to enrich with advice and products
        try {
          setAnalyzeLoading(true);
          const ares = await API.post('/ai/analyze', { aiResult: aiRaw });
          if (ares.data?.err === 1) {
            throw new Error(ares.data.mess || 'Analyze returned err: 1');
          }
          const combined = ares.data?.data ?? ares.data;
          setResultData(combined);
          if (props.onResult) {
            props.onResult(combined, obj);
            closeScanner();
          }
        } catch (ae: any) {
          console.error('analyze failed', ae);
          setResultData(aiRaw?.data ?? aiRaw);
          if (props.onResult) {
            props.onResult(aiRaw?.data ?? aiRaw, obj);
            closeScanner();
          }
        } finally {
          setAnalyzeLoading(false);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err?.message || String(err));
        setPreviewUrl(null);
        setAnalyzeLoading(false);
      }
    }, 'image/jpeg', 0.95);
  };

  // open scanner (start camera)
  const openScanner = () => {
    // clear previous results when reopening
    setPreviewUrl(null);
    setResultData(null);
    setActive(true);
  };

  const closeScanner = () => {
    // stop camera and reset state so user can reopen and capture again
    stopCamera();
    setPreviewUrl(null);
    setResultData(null);
    setActive(false);
    setOffset({ x: 0, y: 0 });
  };

  // ensure camera starts/stops after the scanner DOM mounts/unmounts
  useEffect(() => {
    if (active) {
      // small tick to ensure refs are attached
      const t = setTimeout(() => { startCamera(); }, 50);
      return () => clearTimeout(t);
    } else {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // revoke local preview blob when changed/unmounted
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        try { URL.revokeObjectURL(previewUrl); } catch (e) {}
      }
    };
    // only run on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // dragging handlers
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      const cx = e.clientX;
      const cy = e.clientY;
      const dx = cx - dragStartRef.current.x;
      const dy = cy - dragStartRef.current.y;
      setOffset({ x: offsetStartRef.current.x + dx, y: offsetStartRef.current.y + dy });
    };
    const onUp = () => { draggingRef.current = false; document.body.style.userSelect = ''; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    // touch
    const onTouchMove = (ev: TouchEvent) => {
      if (!draggingRef.current) return;
      const t0 = ev.touches[0];
      if (!t0) return;
      const dx = t0.clientX - dragStartRef.current.x;
      const dy = t0.clientY - dragStartRef.current.y;
      setOffset({ x: offsetStartRef.current.x + dx, y: offsetStartRef.current.y + dy });
    };
    const onTouchEnd = () => { draggingRef.current = false; document.body.style.userSelect = ''; };
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    
    // Automatically open the scanner overlay to show loading state
    setActive(true);
    setReady(false); // disable capture button while uploading

    try {
      const obj = URL.createObjectURL(f);
      setPreviewUrl(obj);
      const fd = new FormData();
      fd.append('file', f, f.name);
      const res = await API.post('/ai/predict', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const aiRaw = res.data;
      try {
        setAnalyzeLoading(true);
        const ares = await API.post('/ai/analyze', { aiResult: aiRaw });
        if (ares.data?.err === 1) {
          throw new Error(ares.data.mess || 'Analyze returned err: 1');
        }
        const combined = ares.data?.data ?? ares.data;
        setResultData(combined);
        if (props.onResult) {
          props.onResult(combined, obj);
          closeScanner();
        }
      } catch (ae: any) {
        console.error('analyze failed', ae);
        setResultData(aiRaw?.data ?? aiRaw);
        if (props.onResult) {
          props.onResult(aiRaw?.data ?? aiRaw, obj);
          closeScanner();
        }
      } finally {
        setAnalyzeLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || String(err));
      setPreviewUrl(null);
      setAnalyzeLoading(false);
    }
    e.currentTarget.value = '';
  };

  return (
    <>
      {!active && !props.hideTrigger && (
        <button className="bc-open-btn" title="Mở AI Scanner" onClick={openScanner}>
          AI
        </button>
      )}
      <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={uploadFile} />
      {active && (
        <div
          ref={scannerRef}
          className={`bc-face-scanner bc-face-scanner--large ${resultData ? 'result-mode' : ''}`}
          style={{ transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)` }}
        >
          <div className="bc-topbar">
            <button className="bc-close" onClick={closeScanner}>Đóng</button>
            {/* drag handle: start drag on mousedown/touchstart */}
            <div
              className="bc-drag-handle"
              onMouseDown={(e) => {
                draggingRef.current = true;
                dragStartRef.current = { x: e.clientX, y: e.clientY };
                offsetStartRef.current = { ...offset };
                document.body.style.userSelect = 'none';
              }}
              onTouchStart={(ev) => {
                const t0 = ev.touches[0];
                if (!t0) return;
                draggingRef.current = true;
                dragStartRef.current = { x: t0.clientX, y: t0.clientY };
                offsetStartRef.current = { ...offset };
                document.body.style.userSelect = 'none';
              }}
            />
            <div className="bc-status">
              <div>{previewUrl && !resultData ? 'Đang tải ảnh...' : (centered ? 'Sẵn sàng' : 'Đưa mặt vào giữa')}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                Quyền: {permission} • Stream: {streamActive ? 'on' : 'off'}
              </div>
              {errorMsg && <div style={{ color: 'salmon', fontSize: 12 }}>{errorMsg}</div>}
            </div>
          </div>
          <div className="bc-media-wrap">
            <video ref={videoRef} className="bc-video" autoPlay playsInline muted />
            <canvas ref={canvasRef} className="bc-canvas" />
            {!previewUrl && (
              <div className="kyc-instruction">
                {centered ? 'Tuyệt vời! Giữ nguyên và bấm Quét da' : 'Giữ khuôn mặt của bạn ở trong khung hình'}
              </div>
            )}
            {previewUrl && (
              <div className="premium-loading-container">
                <img src={previewUrl} className="captured-preview-img" alt="Captured" />
                <div className="scanning-laser"></div>
                <div className="loading-overlay">
                  <div className="premium-spinner"></div>
                  <div className="loading-text">
                     {analyzeLoading ? 'AI đang phân tích chuyên sâu...' : 'Đang xử lý hình ảnh...'}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Hide controls when previewing or result is ready, but keep in DOM to prevent height shift */}
          <div className="bc-controls bc-controls--large" style={{ visibility: (resultData || previewUrl) ? 'hidden' : 'visible' }}>
            <button className="bc-btn bc-btn--large" onClick={captureAndSend} disabled={!ready || !centered} style={{ width: '100%', height: '48px', fontSize: '16px', fontWeight: 'bold' }}>CHỤP ẢNH</button>
          </div>

        </div>
      )}
    </>
  );
});

export default FaceScanner;
