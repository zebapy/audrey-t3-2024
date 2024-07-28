"use client";
import "react-barcode-scanner/polyfill";

import { BarcodeScanner, type DetectedBarcode } from "react-barcode-scanner";
import { redirect } from "next/navigation";

export default function ScanPage() {
  const onCapture = (result: DetectedBarcode) => {
    redirect(`/search?code=${result.rawValue}`);
  };

  return (
    <div className="container">
      <BarcodeScanner options={{ formats: ["ean_13"] }} onCapture={onCapture} />
    </div>
  );
}
