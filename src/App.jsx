import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';

function App() {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const handleStartExperience = () => {
    setIsStarted(true);
    
    // Putar Audio
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio gagal diputar:", e));
    }

    // Akses Kamera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          alert("Gagal mengakses kamera. Pastikan perangkat Anda memiliki kamera dan Anda telah memberikan izin akses.");
        });
    }
  };

  return (
    // Container Utama: Mencegah scrollbar muncul dengan h-screen dan w-full, mengunci overflow
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans">
      
      <audio ref={audioRef} src="/assets/backsound.mp3" loop />

      {/* --- LAYAR AWAL (START SCREEN) --- */}
      {/* 
        Menggunakan flexbox Tailwind (flex, items-center, justify-center) 
        untuk memastikan konten SELALU berada tepat di tengah layar di semua perangkat 
      */}
      {!isStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/80 backdrop-blur-sm text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-wide">
            Museum AR
          </h1>
          <p className="text-gray-300 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
            Nyalakan volume perangkat Anda dan izinkan akses kamera untuk memulai pengalaman interaktif 3D.
          </p>
          <button 
            onClick={handleStartExperience}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            Mulai Pengalaman AR
          </button>
        </div>
      )}

      {/* --- LATAR BELAKANG KAMERA --- */}
      {/* Mengisi seluruh layar (object-cover) tanpa merusak rasio aspek kamera */}
      <video 
        ref={videoRef} 
        autoPlay playsInline muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* --- AREA 3D MODEL & UI --- */}
      {isStarted && (
        <>
          <model-viewer
            src="/assets/kereta.glb" 
            camera-controls
            auto-rotate
            rotation-per-second="30deg"
            shadow-intensity="1"
            className="absolute inset-0 z-10 w-full h-full bg-transparent outline-none"
          >
            {/* Panel Hotspot Teks */}
            {showInfo && (
              <div 
                slot="hotspot-sejarah" 
                data-position="0 1.5 0" 
                data-normal="0 1 0"
                className="w-64 md:w-80 p-5 bg-gray-900/80 backdrop-blur-md text-white rounded-2xl border border-white/20 shadow-2xl -translate-x-1/2 -translate-y-full"
              >
                <h2 className="text-lg md:text-xl font-bold mb-2">Sejarah Kereta Kuda</h2>
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
                  Kereta kuda ini digunakan pada abad ke-19 oleh para bangsawan. Terbuat dari kayu jati pilihan dengan interior kain beludru.
                </p>
              </div>
            )}
          </model-viewer>

          {/* Tombol Toggle Informasi (Diposisikan aman di kanan atas) */}
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`absolute top-6 right-6 z-20 w-12 h-12 flex items-center justify-center rounded-full text-white text-2xl font-bold shadow-lg transition-colors ${
              showInfo ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
            aria-label="Toggle Informasi"
          >
            {showInfo ? '×' : 'i'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;