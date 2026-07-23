import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { ScanLine, Camera, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const SCANNER_ID = 'qr-reader-region';

export default function QRScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null); // { success, message, data }
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

  // ── Clean up on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  // ── Start camera scan ──────────────────────────────────────────────────────
  const startScan = async () => {
    setResult(null);
    setScanning(true);

    const html5Qrcode = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = html5Qrcode;

    try {
      await html5Qrcode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {} // suppress per-frame errors
      );
    } catch {
      toast.error('Camera access denied or not available');
      setScanning(false);
    }
  };

  // ── Stop camera ────────────────────────────────────────────────────────────
  const stopScan = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    setScanning(false);
  };

  // ── Handle decoded QR ──────────────────────────────────────────────────────
  const onScanSuccess = async (decodedText) => {
    await stopScan();
    setLoading(true);

    try {
      // The QR pass token is the decoded text — send to check-in endpoint
      const res = await api.post('/checkin', { token: decodedText });
      setResult({ success: true, message: res.data.message || 'Check-in successful!', data: res.data.data });
      toast.success('Check-in recorded!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired QR pass';
      setResult({ success: false, message: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const reset = async () => {
    await stopScan();
    setResult(null);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ScanLine className="w-7 h-7 text-violet-600" />
        </div>
        <h1 className="text-2xl font-bold">QR Check-in Scanner</h1>
        <p className="text-sm text-[rgb(var(--color-muted))] mt-1">
          Point the camera at a member's QR pass to check them in
        </p>
      </div>

      {/* Scanner region — always rendered so html5-qrcode can mount */}
      <div className={`card overflow-hidden mb-6 ${!scanning ? 'hidden' : ''}`}>
        <div id={SCANNER_ID} className="w-full" />
        <div className="p-4 flex justify-center">
          <button onClick={stopScan} className="btn-secondary gap-2">
            <XCircle className="w-4 h-4" /> Stop Camera
          </button>
        </div>
      </div>

      {/* Idle / result state */}
      {!scanning && (
        <div className="card p-8 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-[rgb(var(--color-muted))]">Processing check-in…</p>
            </div>
          ) : result ? (
            <div className="flex flex-col items-center gap-4">
              {result.success ? (
                <CheckCircle className="w-12 h-12 text-emerald-500" />
              ) : (
                <XCircle className="w-12 h-12 text-red-500" />
              )}
              <div>
                <p className={`font-semibold text-lg ${result.success ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result.success ? 'Check-in Successful' : 'Check-in Failed'}
                </p>
                <p className="text-sm text-[rgb(var(--color-muted))] mt-1">{result.message}</p>
                {result.data?.user && (
                  <p className="text-sm font-medium mt-2">{result.data.user.name}</p>
                )}
              </div>
              <button onClick={reset} className="btn-primary gap-2">
                <RefreshCw className="w-4 h-4" /> Scan Another
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Camera className="w-10 h-10 text-[rgb(var(--color-muted))]" />
              <p className="text-sm text-[rgb(var(--color-muted))]">
                Camera is off. Press the button below to start scanning.
              </p>
              <button id="start-scan-btn" onClick={startScan} className="btn-primary gap-2">
                <ScanLine className="w-4 h-4" /> Start Scanning
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 card p-4">
        <p className="text-xs font-semibold text-[rgb(var(--color-muted))] uppercase tracking-wide mb-2">How it works</p>
        <ul className="space-y-1.5 text-xs text-[rgb(var(--color-muted))]">
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 bg-violet-100 dark:bg-violet-900/40 text-violet-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
            Member generates a QR pass from the gym page (valid 60s)
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 bg-violet-100 dark:bg-violet-900/40 text-violet-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
            Gym staff opens this page and taps "Start Scanning"
          </li>
          <li className="flex items-start gap-2">
            <span className="w-4 h-4 bg-violet-100 dark:bg-violet-900/40 text-violet-600 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
            Point camera at member's QR code — check-in is instant
          </li>
        </ul>
      </div>
    </div>
  );
}
