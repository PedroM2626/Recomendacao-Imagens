import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import HomePage from "@/pages/HomePage";
import UploadPage from "@/pages/UploadPage";
import GalleryPage from "@/pages/GalleryPage";
import RecommendationsPage from "@/pages/RecommendationsPage";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/recommendations/:imageId" element={<RecommendationsPage />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}
