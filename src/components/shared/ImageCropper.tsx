'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropImage';
import { X, Check } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  onCancel: () => void;
  onCropComplete: (croppedFile: File) => void;
  aspectRatio?: number; // Default 1 (Persegi) atau 4/3
}

export default function ImageCropper({ imageSrc, onCancel, onCropComplete, aspectRatio = 1 }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    setProcessing(true);
    try {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, 'cropped-image.jpg');
      onCropComplete(croppedFile);
    } catch (e) {
      console.error(e);
      alert('Gagal memotong gambar');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-white z-10">
          <h3 className="font-bold text-gray-800">Sesuaikan Gambar</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-red-500">
            <X size={24} />
          </button>
        </div>

        {/* Cropper Area */}
        <div className="relative flex-1 bg-gray-900 w-full">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-white space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={processing}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={processing}
              className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-semibold"
            >
              {processing ? 'Memproses...' : <><Check size={18} /> Simpan Gambar</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}