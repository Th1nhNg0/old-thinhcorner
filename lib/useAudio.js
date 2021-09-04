import { useEffect, useState } from "react";

export default function useAudio(url) {
  const [playingReview, setPlayingPreview] = useState(false);
  const [audio, setaudio] = useState(false);
  let toggle = () => setPlayingPreview(!playingReview);
  useEffect(() => {
    if (audio) {
      audio.pause();
      setPlayingPreview(false);
    }
    if (url) setaudio(new Audio(url));
  }, [url]);
  useEffect(() => {
    if (!audio) return;
    audio.addEventListener("ended", () => setPlayingPreview(false));
    return () => {
      audio.removeEventListener("ended", () => setPlayingPreview(false));
    };
  }, [audio]);
  useEffect(() => {
    if (!audio) return;
    if (playingReview) audio.play();
    else audio.pause();
  }, [playingReview]);

  return [playingReview, toggle];
}
