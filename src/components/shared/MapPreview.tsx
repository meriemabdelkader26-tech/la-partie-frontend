"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-50/50 animate-pulse flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 min-h-[300px]">
      <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
      <div className="text-gray-400 font-medium text-sm">Initializing Map...</div>
    </div>
  ),
});

interface MapPreviewProps {
  lat: number;
  lon: number;
  zoom?: number;
  onLocationSelect?: (lat: number, lon: number) => void;
}

export default function MapPreview(props: MapPreviewProps) {
  return <Map {...props} />;
}
