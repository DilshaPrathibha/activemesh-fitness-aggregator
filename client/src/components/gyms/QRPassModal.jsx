import { useState, useEffect, useRef } from 'react';
import { X, QrCode, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import QRCode from 'qrcode';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const QR_TTL = 60; // seconds

export default function QRPassModal({ gymId, gymName, onClose }) {
  const [qrData, setQrData] = useState(null);
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(QR_TTL);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  const generatePass = async () => {
    setLoading(true);
    setExpired(false);
    setSecondsLeft(QR_TTL);
    try {
      const { data } = await api.post('/qr/generate', { gymId });
      setQrData(data.data);

      // Generate QR code image from token
      const url = await QRCode.toDataURL(data.data.token, {
        width: 220,
        margin: 2,
        color: { dark: '#4c1d95', light: '#ffffff' },
      });
      setQrImageUrl(url);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not generate QR pass');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer
  useEffect(() => {
    if (!qrData) return;
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [qrData]);

  useEffect(() => { generatePass(); }, []);

  const progress = (secondsLeft / QR_TTL) * 100;
  const circleSize = 180;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card p-6 w-full max-w-sm relative" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <div className="w-10 h-10 bg-violet-100 dark:bg-violet-900/40 rounded-xl flex items-center justify-center mx-auto mb-3">
            <QrCode className="w-5 h-5 text-violet-600" />
          </div>
          <h2 className="text-lg font-bold">Gym QR Pass</h2>
          <p className="text-sm text-[rgb(var(--color-muted))] mt-1">{gymName}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : expired ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <p className="font-medium mb-4">Pass Expired</p>
            <button onClick={generatePass} className="btn-primary">
              <RefreshCw className="w-4 h-4" /> Generate New Pass
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {/* Circular countdown + QR */}
            <div className="relative mb-4" style={{ width: circleSize, height: circleSize }}>
              <svg className="absolute inset-0 -rotate-90" width={circleSize} height={circleSize}>
                <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke="currentColor" className="text-gray-200 dark:text-slate-600" strokeWidth="8" />
                <circle
                  cx={circleSize / 2}
                  cy={circleSize / 2}
                  r={radius}
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              {qrImageUrl && (
                <div className="absolute inset-3 rounded-full overflow-hidden flex items-center justify-center bg-white">
                  <img src={qrImageUrl} alt="QR Pass" className="w-full h-full object-contain p-1" />
                </div>
              )}
            </div>

            <div className={`text-3xl font-bold tabular-nums mb-1 ${secondsLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-violet-600'}`}>
              {secondsLeft}s
            </div>
            <p className="text-xs text-[rgb(var(--color-muted))] mb-4">Show this QR code to the gym staff</p>

            <div className="w-full bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 text-xs text-center text-violet-700 dark:text-violet-300">
              <CheckCircle className="w-3.5 h-3.5 inline mr-1" />
              Single-use · Expires in {secondsLeft} seconds
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
