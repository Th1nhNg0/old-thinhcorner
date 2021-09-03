import React from "react";
import { PageSEO } from "@/components/SEO";
import siteMetadata from "@/data/siteMetadata";
import useSWR, { SWRConfig } from "swr";

export default function spotify() {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}
    >
      <PageSEO title={`Projects - ${siteMetadata.author}`} description={siteMetadata.description} />
      <div className="flex flex-col items-center gap-5 md:flex-row">
        <UserProfile />
        <CurrentPlaying />
      </div>
    </SWRConfig>
  );
}

function CurrentPlaying() {
  const { data: currentTrack } = useSWR("/api/spotify/current-playing");
  if (currentTrack)
    return (
      <div>
        <p className="mb-2 text-xl font-bold">Currently listening to</p>
        <div className="flex flex-col flex-1 w-full gap-3 p-5 bg-gray-100 shadow-md dark:bg-gray-800 md:flex-row">
          <img
            className="object-cover w-full md:w-32 md:h-32"
            src={currentTrack.item.album.images[1].url}
            alt="listen-track-cover"
          />
          <div className="flex flex-col">
            <a
              target="_blank"
              href={currentTrack.item.external_urls.spotify}
              className="text-xl font-semibold"
            >
              {currentTrack.item.name}
            </a>
            <div className="flex">
              {currentTrack.item.artists.map((e, i) => (
                <a href={e.external_urls.spotify} key={e.id}>
                  {i != 0 && ", "}
                  {e.name}
                </a>
              ))}
            </div>
            <CurrentPlayingFeatures id={currentTrack.item.id} />
          </div>
        </div>
        <div className="w-full h-2 bg-gray-500 shadow-md">
          <div
            className="h-2 bg-green-500"
            style={{
              width: (currentTrack.progress_ms / currentTrack.item.duration_ms) * 100 + "%",
            }}
          ></div>
        </div>
      </div>
    );
  return null;
}

function CurrentPlayingFeatures({ id }) {
  const { data: currentTrackFeatures } = useSWR("/api/spotify/track-features?id=" + id);
  function getValence(value) {
    if (value <= 1 / 6) return "Angry";
    if (value <= 2 / 6) return "Depressed";
    if (value <= 3 / 6) return "Sad";
    if (value <= 4 / 6) return "Happy";
    if (value <= 5 / 6) return "Cheerful";
    return "euphoric";
  }
  if (currentTrackFeatures)
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
        <span
          title="danceability"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-green-500 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 fill-current"
            viewBox="0 0 511.528 511.528"
          >
            <ellipse
              cx="239.55"
              cy="84.155"
              rx="41.49"
              ry="41.49"
              transform="matrix(1 -.026 .026 1 -2.13 6.327)"
            ></ellipse>
            <path d="M386.522 181.885l49.394-62.906c6.83-8.695 5.31-21.282-3.382-28.108-8.698-6.834-21.314-5.272-28.107 3.381l-.001.001-42.766 54.464-60.147-9.138a133.196 133.196 0 00-19.997-1.51h-60.957L156.888 93.04l-22.363-78.081c-2.99-10.436-13.65-17-24.185-14.383-11.061 2.746-17.55 14.083-14.439 24.945l24.434 85.311a20.022 20.022 0 007.686 10.832l58.867 41.632c-.091.921-.14 1.855-.14 2.8v134.542l-28.308 72.418a24.018 24.018 0 00-1.49 5.994l-12.188 105.698c-1.52 13.18 7.932 25.097 21.113 26.616 13.181 1.518 25.096-7.932 26.616-21.113l11.832-102.604 30.392-77.75h10.797l47.724 183.645c3.342 12.861 16.471 20.541 29.292 17.208 12.841-3.337 20.546-16.452 17.209-29.293l-46.952-180.674V179.446l76.408 10.032c6.518.517 12.831-2.064 17.329-7.593z"></path>
            <path d="M330.514 88.459c6.453 0 14.603-3.314 13.442-9.004V36.62l32.18-11.263v34.521c-6.4-.514-15.391 2.146-15.391 7.949 0 4.436 6.067 8.032 13.551 8.032s13.551-3.596 13.551-8.032h.206v-49.79c0-4.632-4.573-7.876-8.945-6.346l-42.291 14.802a7.135 7.135 0 00-4.778 6.734v39.222c-6.27-.419-15.076 2.25-15.076 7.978.001 4.436 6.067 8.032 13.551 8.032zM462.462 169.905l-28.571 10v44.284c-6.269-.418-15.076 2.25-15.076 7.978 0 4.436 6.067 8.032 13.551 8.032 6.453 0 14.603-3.313 13.442-9.004V188.36l9.344-3.27c6.211-2.175 9.484-8.974 7.31-15.185zM69.871 95.111l-28.571 10v44.283c-6.27-.415-15.076 2.25-15.076 7.978 0 4.436 6.067 8.032 13.551 8.032 6.453 0 14.602-3.313 13.442-9.004v-42.835l9.343-3.27c6.211-2.174 9.485-8.972 7.311-15.184zM437.333 36.821a21.513 21.513 0 018.59 8.59c.766 1.405 2.796 1.405 3.562 0a21.519 21.519 0 018.59-8.59c1.405-.766 1.405-2.796 0-3.562a21.506 21.506 0 01-8.59-8.59c-.766-1.405-2.796-1.405-3.562 0a21.525 21.525 0 01-8.59 8.59c-1.405.765-1.405 2.795 0 3.562zM28.987 93.041a21.519 21.519 0 018.59-8.59c1.405-.766 1.405-2.796 0-3.562a21.506 21.506 0 01-8.59-8.59c-.766-1.405-2.796-1.405-3.562 0a21.519 21.519 0 01-8.59 8.59c-1.405.766-1.405 2.796 0 3.562a21.506 21.506 0 018.59 8.59c.766 1.406 2.796 1.406 3.562 0zM481.692 80.468a16.847 16.847 0 01-6.727-6.727c-.6-1.1-2.19-1.1-2.789 0a16.841 16.841 0 01-6.727 6.727c-1.1.6-1.1 2.19 0 2.79a16.847 16.847 0 016.727 6.727c.6 1.1 2.19 1.1 2.789 0a16.854 16.854 0 016.727-6.727c1.1-.6 1.1-2.19 0-2.79zM82.498 55.995a16.841 16.841 0 01-6.727-6.727c-.6-1.1-2.19-1.1-2.789 0a16.847 16.847 0 01-6.727 6.727c-1.1.6-1.1 2.19 0 2.79a16.854 16.854 0 016.727 6.727c.6 1.1 2.19 1.1 2.789 0a16.854 16.854 0 016.727-6.727c1.1-.601 1.1-2.191 0-2.79zM495.16 41.623a11.998 11.998 0 01-4.792-4.792 1.133 1.133 0 00-1.987 0 12.004 12.004 0 01-4.792 4.792 1.133 1.133 0 000 1.987 11.998 11.998 0 014.792 4.792c.427.784 1.56.784 1.987 0a12.004 12.004 0 014.792-4.792 1.134 1.134 0 000-1.987zM28.331 42.452a11.998 11.998 0 014.792 4.792c.427.784 1.56.784 1.987 0a12.004 12.004 0 014.792-4.792 1.133 1.133 0 000-1.987 11.998 11.998 0 01-4.792-4.792 1.133 1.133 0 00-1.987 0 12.004 12.004 0 01-4.792 4.792 1.134 1.134 0 000 1.987z"></path>
          </svg>
          {Math.round(currentTrackFeatures.danceability * 100)}%
        </span>
        <span
          title="tempo"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-blue-500 rounded-full"
        >
          {Math.round(currentTrackFeatures.tempo)} BPM
        </span>
        <span
          title="energy"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-yellow-500 rounded-full"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 511.999 511.999">
            <path d="M389.053 7.603A14.995 14.995 0 00376.001 0h-180a14.995 14.995 0 00-14.546 11.367l-60 241a14.951 14.951 0 002.725 12.861 14.986 14.986 0 0011.821 5.771h68.35l-82.397 220.727c-2.637 7.031.337 14.927 6.943 18.486 6.636 3.556 14.846 1.653 19.233-4.395l240-331c3.325-4.556 3.794-10.591 1.245-15.63a15.018 15.018 0 00-13.374-8.188H312.5l76.362-128.28a14.999 14.999 0 00.191-15.116z"></path>
          </svg>
          {Math.round(currentTrackFeatures.energy * 100)}
        </span>
        <span
          title="loudness"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-gray-500 rounded-full"
        >
          {Math.round(currentTrackFeatures.loudness)} dB
        </span>
        <span
          title="valence"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-purple-500 rounded-full"
        >
          {getValence(currentTrackFeatures.valence)}
        </span>
        <span
          title="speechiness"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-purple-500 rounded-full"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 435.2 435.2">
            <path d="M356.864 224.768c0-8.704-6.656-15.36-15.36-15.36s-15.36 6.656-15.36 15.36c0 59.904-48.64 108.544-108.544 108.544-59.904 0-108.544-48.64-108.544-108.544 0-8.704-6.656-15.36-15.36-15.36s-15.36 6.656-15.36 15.36c0 71.168 53.248 131.072 123.904 138.752v40.96h-55.808c-8.704 0-15.36 6.656-15.36 15.36s6.656 15.36 15.36 15.36h142.336c8.704 0 15.36-6.656 15.36-15.36s-6.656-15.36-15.36-15.36H232.96v-40.96c70.656-7.68 123.904-67.584 123.904-138.752z"></path>
            <path d="M217.6 0c-47.104 0-85.504 38.4-85.504 85.504v138.752c0 47.616 38.4 85.504 85.504 86.016 47.104 0 85.504-38.4 85.504-85.504V85.504C303.104 38.4 264.704 0 217.6 0z"></path>
          </svg>
          {Math.round(currentTrackFeatures.speechiness * 100)}%
        </span>
      </div>
    );
  return null;
}

function UserProfile() {
  const { data } = useSWR("/api/spotify/me");
  if (data)
    return (
      <div className="w-60">
        <div className="flex flex-col items-center justify-center">
          <a target="_blank" href={data.external_urls.spotify}>
            <img className="w-32 rounded-full" src={data.images[0].url} alt="avatar" />
          </a>
          <p className="mt-3 text-xl font-bold">{data.display_name}</p>
        </div>
      </div>
    );
  return "loading";
}
