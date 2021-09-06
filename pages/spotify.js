import React, { useEffect, useRef, useState } from "react";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import moment from "moment";
import { PageSEO } from "@/components/SEO";
import siteMetadata from "@/data/siteMetadata";

import * as SpotifyApi from "@/lib/spotify-api";

export default function spotify({
  profile,
  top_artists,
  top_tracks,
  last_refresh_date,
  top_genres,
  stats_analysis,
}) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}
    >
      <PageSEO
        title={`My Spotify - ${siteMetadata.author}`}
        description={siteMetadata.description}
      />
      <div className="relative flex flex-col items-center w-full gap-5 md:items-start md:flex-row">
        <div className="w-full md:sticky md:top-5 md:w-60 ">
          <UserProfile profile={profile} />
          <FeelingNow />
          <TagAndAnalysis top_genres={top_genres} stats_analysis={stats_analysis} />
        </div>
        <div className="flex-1 space-y-5">
          <CurrentPlaying />
          <RecentlyTrack />
          <TopArtists top_artists={top_artists} />
          <TopTracks top_tracks={top_tracks} />
          <div className="py-5 text-sm text-center">
            Last refresh: {moment(last_refresh_date).fromNow()}
          </div>
        </div>
      </div>
    </SWRConfig>
  );
}

function getValence(value) {
  if (value <= 1 / 6) return ["Angry", "red-500"];
  if (value <= 2 / 6) return ["Depressed", "blue-700"];
  if (value <= 3 / 6) return ["Sad", "blue-400"];
  if (value <= 4 / 6) return ["Happy", "green-500"];
  if (value <= 5 / 6) return ["Cheerful", "yellow-500"];
  return ["euphoric", "pink-500"];
}

function FeelingNow() {
  const { data: currentTrack } = useSWR("/api/spotify/current-playing", { refreshInterval: 5000 });
  const { data: currentTrackFeatures } = useSWR(
    `/api/spotify/track-features?id=${currentTrack?.item?.id}`
  );
  const { data } = useSWR("/api/spotify/my-feeling");
  if (data?.feeling && currentTrack.item)
    return (
      <p className="text-center text-gray-700 dark:text-gray-300">
        I'm feeling{" "}
        <span className={`font-bold text-${getValence(data.feeling)[1]}`}>
          {
            getValence(
              data.feeling.reduce((a, b) => a + b, currentTrackFeatures.valence) /
                (data.feeling.length + 1)
            )[0]
          }
        </span>{" "}
        rightnow
      </p>
    );
  return null;
}

function RecentlyTrack() {
  const { data } = useSWR("/api/spotify/recently-track?limit=10");
  const [showMore, setshowMore] = useState(false);

  const TrackItem = ({ track, played_at }) => {
    function getTime() {
      const minutes = moment.duration(track.duration_ms).minutes();
      let seconds = `0${moment.duration(track.duration_ms).seconds()}`;
      seconds = seconds.substr(seconds.length - 2);
      return `${minutes}:${seconds}`;
    }
    return (
      <div className="flex items-center gap-2 py-2">
        <div aria-hidden="true" className="relative w-16">
          <a target="_blank" href={track.external_urls.spotify} rel="noreferrer">
            <img src={track.album.images[2].url} width="64" height="64" alt="track" />
          </a>
        </div>
        <div className="flex-1">
          <a
            target="_blank"
            href={track.external_urls.spotify}
            className="font-semibold md:text-lg"
            rel="noreferrer"
          >
            {track.name}
          </a>
          <p className="flex text-sm text-gray-700 dark:text-gray-300 md:text-base ">
            {track.artists.map((e2, i) => (
              <span key={i}>
                {i != 0 && ", "}
                <a target="_blank" href={e2.external_urls.spotify} rel="noreferrer">
                  {e2.name}
                </a>
              </span>
            ))}
          </p>
          <p className="text-xs text-gray-500">{moment(played_at).fromNow()}</p>
        </div>
        <span title="duration" className="hidden text-sm md:text-base md:block">
          {getTime()}
        </span>
      </div>
    );
  };

  return (
    <div>
      <p className="mb-2 text-xl font-bold">Recently played track</p>
      <div className="relative px-5 py-3 bg-gray-100 shadow dark:bg-gray-800">
        <div className="mb-5 divide-y-2 dark:divide-gray-700">
          {data
            ? data.items.slice(0, showMore ? 10 : 5).map((e, i) => <TrackItem key={i} {...e} />)
            : [0, 1, 2, 3, 4].map((e) => (
                <div key={e} className="flex items-center justify-center gap-2 py-2">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 animate-pulse" />
                  <div className="flex flex-col flex-1 space-y-1">
                    <div
                      className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse"
                      style={{ width: `${20 + Math.random() * 80}%` }}
                    />
                    <div
                      className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse"
                      style={{ width: `${30 + Math.random() * 50}%` }}
                    />
                    <div
                      className="h-4 bg-gray-300 dark:bg-gray-600 animate-pulse"
                      style={{ width: `${10 + Math.random() * 10}%` }}
                    />
                  </div>
                </div>
              ))}
        </div>
        {data && (
          <button className="absolute left-0 w-full -bottom-5">
            <svg
              onClick={() => setshowMore(!showMore)}
              className="w-10 h-10 p-2 mx-auto rounded-full shadow bg-spotify"
              viewBox="0 0 20 20"
              fill="white"
            >
              {showMore ? (
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function CurrentPlaying() {
  const { data: currentTrack } = useSWR("/api/spotify/current-playing", { refreshInterval: 1000 });
  const { mutate } = useSWRConfig();
  useEffect(() => {
    mutate("/api/spotify/recently-track?limit=10");
    mutate("/api/spotify/my-feeling");
  }, [currentTrack?.item?.name, mutate]);
  if (currentTrack && currentTrack.item)
    return (
      <div>
        <p className="mb-2 text-xl font-bold">Currently listening to</p>
        <div className="overflow-hidden rounded-lg bg-spotify">
          <div className="flex flex-col flex-1 w-full gap-3 p-5 text-white md:flex-row">
            <div className="relative" aria-hidden="true">
              <a target="_blank" href={currentTrack.item.external_urls.spotify} rel="noreferrer">
                <img
                  className="object-cover w-full md:w-32 md:h-32"
                  width="128"
                  height="128"
                  src={currentTrack.item.album?.images[1].url || currentTrack.item?.images[1].url}
                  alt="listen-track-cover"
                />
              </a>
            </div>
            <div className="flex flex-col">
              <a
                target="_blank"
                href={currentTrack.item.external_urls.spotify}
                className="text-xl font-semibold"
                rel="noreferrer"
              >
                {currentTrack.item.name}
              </a>
              <div className="flex text-gray-200">
                {currentTrack.item?.artists ? (
                  currentTrack.item.artists.map((e, i) => (
                    <a target="_blank" href={e.external_urls.spotify} key={i} rel="noreferrer">
                      {i !== 0 && ", "}
                      {e.name}
                    </a>
                  ))
                ) : (
                  <div>
                    <a
                      target="_blank"
                      href={currentTrack.item.show.external_urls.spotify}
                      rel="noreferrer"
                    >
                      {currentTrack.item.show.name} • {currentTrack.item.show.publisher}
                    </a>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-end flex-1">
                <div className="flex items-center gap-2 mt-3 md:mt-0">
                  {!currentTrack.is_playing && (
                    <span title="Pause">
                      <svg className="w-6 h-6" viewBox="0 0 20 20" fill="white">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  {currentTrack.shuffle_state && (
                    <span title="Play on shuffle">
                      <svg className="w-5 h-5" viewBox="0 0 512 512" fill="white">
                        <path d="M506.24 371.7l-96-80c-4.768-4-11.424-4.8-17.024-2.208A16.02 16.02 0 00384 303.988v48h-26.784c-22.208 0-42.496-11.264-54.272-30.08l-103.616-165.76c-23.52-37.664-64.096-60.16-108.544-60.16H0v64h90.784c22.208 0 42.496 11.264 54.272 30.08l103.616 165.76c23.552 37.664 64.128 60.16 108.544 60.16H384v48a16.02 16.02 0 009.216 14.496 16.232 16.232 0 006.784 1.504c3.68 0 7.328-1.248 10.24-3.712l96-80c3.68-3.04 5.76-7.552 5.76-12.288 0-4.736-2.08-9.248-5.76-12.288z"></path>
                        <path d="M506.24 115.7l-96-80c-4.768-3.968-11.424-4.8-17.024-2.176C387.584 36.116 384 41.78 384 47.988v48h-26.784c-44.448 0-85.024 22.496-108.544 60.16l-5.792 9.28 37.728 60.384 22.336-35.744c11.776-18.816 32.064-30.08 54.272-30.08H384v48c0 6.208 3.584 11.872 9.216 14.496a16.232 16.232 0 006.784 1.504c3.68 0 7.328-1.28 10.24-3.712l96-80c3.68-3.04 5.76-7.552 5.76-12.288 0-4.736-2.08-9.248-5.76-12.288zM167.392 286.164l-22.304 35.744c-11.776 18.816-32.096 30.08-54.304 30.08H0v64h90.784c44.416 0 84.992-22.496 108.544-60.16l5.792-9.28-37.728-60.384z"></path>
                      </svg>
                    </span>
                  )}
                  {currentTrack.repeat_state !== "off" && (
                    <span title="Repeat">
                      <svg
                        width="1.1rem"
                        height="1.1rem"
                        viewBox="0 0 511.991 511.991"
                        fill="white"
                      >
                        <path d="M465.45 279.263c-12.87 0-23.273 10.426-23.273 23.273 0 38.493-31.325 69.818-69.818 69.818H186.177v-69.818c0-8.937-5.143-17.105-13.172-20.969-8.122-3.863-17.641-2.793-24.646 2.793L31.995 377.451a23.29 23.29 0 000 36.352l116.364 93.091a23.368 23.368 0 0014.545 5.097c3.421 0 6.889-.768 10.1-2.304 8.029-3.863 13.172-12.032 13.172-20.969V418.9h186.182c64.163 0 116.364-52.201 116.364-116.364.001-12.847-10.402-23.273-23.272-23.273zM46.541 232.718c12.87 0 23.273-10.426 23.273-23.273 0-38.493 31.325-69.818 69.818-69.818h186.182v69.818c0 8.937 5.143 17.105 13.172 20.969 3.235 1.536 6.679 2.304 10.1 2.304a23.36 23.36 0 0014.545-5.097l116.364-93.091a23.29 23.29 0 000-36.352L363.632 5.087c-6.982-5.585-16.617-6.656-24.646-2.793s-13.172 12.032-13.172 20.969v69.818H139.632c-64.163 0-116.364 52.201-116.364 116.364 0 12.847 10.403 23.273 23.273 23.273z"></path>
                      </svg>
                    </span>
                  )}
                </div>
                <CurrentPlayingFeatures id={currentTrack.item.id} />
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-gray-600">
            <div
              className="h-2 bg-gray-200"
              style={{
                width: `${(currentTrack.progress_ms / currentTrack.item.duration_ms) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    );
  return null;
}

function CurrentPlayingFeatures({ id }) {
  const { data: currentTrackFeatures } = useSWR(`/api/spotify/track-features?id=${id}`);

  if (currentTrackFeatures)
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
        <span
          title="valence"
          className={`flex items-center justify-center gap-1 px-4 py-1 bg-white text-semibold text-${
            getValence(currentTrackFeatures.valence)[1]
          } rounded-full`}
        >
          {getValence(currentTrackFeatures.valence)[0]}
        </span>
        <span
          title="tempo"
          className="flex items-center justify-center gap-1 px-4 py-1 text-gray-700 bg-white rounded-full"
        >
          {Math.round(currentTrackFeatures.tempo)} BPM
        </span>
        <span
          title="danceability"
          className="flex items-center justify-center gap-1 px-4 py-1 text-gray-700 bg-white rounded-full"
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
            />
            <path d="M386.522 181.885l49.394-62.906c6.83-8.695 5.31-21.282-3.382-28.108-8.698-6.834-21.314-5.272-28.107 3.381l-.001.001-42.766 54.464-60.147-9.138a133.196 133.196 0 00-19.997-1.51h-60.957L156.888 93.04l-22.363-78.081c-2.99-10.436-13.65-17-24.185-14.383-11.061 2.746-17.55 14.083-14.439 24.945l24.434 85.311a20.022 20.022 0 007.686 10.832l58.867 41.632c-.091.921-.14 1.855-.14 2.8v134.542l-28.308 72.418a24.018 24.018 0 00-1.49 5.994l-12.188 105.698c-1.52 13.18 7.932 25.097 21.113 26.616 13.181 1.518 25.096-7.932 26.616-21.113l11.832-102.604 30.392-77.75h10.797l47.724 183.645c3.342 12.861 16.471 20.541 29.292 17.208 12.841-3.337 20.546-16.452 17.209-29.293l-46.952-180.674V179.446l76.408 10.032c6.518.517 12.831-2.064 17.329-7.593z" />
            <path d="M330.514 88.459c6.453 0 14.603-3.314 13.442-9.004V36.62l32.18-11.263v34.521c-6.4-.514-15.391 2.146-15.391 7.949 0 4.436 6.067 8.032 13.551 8.032s13.551-3.596 13.551-8.032h.206v-49.79c0-4.632-4.573-7.876-8.945-6.346l-42.291 14.802a7.135 7.135 0 00-4.778 6.734v39.222c-6.27-.419-15.076 2.25-15.076 7.978.001 4.436 6.067 8.032 13.551 8.032zM462.462 169.905l-28.571 10v44.284c-6.269-.418-15.076 2.25-15.076 7.978 0 4.436 6.067 8.032 13.551 8.032 6.453 0 14.603-3.313 13.442-9.004V188.36l9.344-3.27c6.211-2.175 9.484-8.974 7.31-15.185zM69.871 95.111l-28.571 10v44.283c-6.27-.415-15.076 2.25-15.076 7.978 0 4.436 6.067 8.032 13.551 8.032 6.453 0 14.602-3.313 13.442-9.004v-42.835l9.343-3.27c6.211-2.174 9.485-8.972 7.311-15.184zM437.333 36.821a21.513 21.513 0 018.59 8.59c.766 1.405 2.796 1.405 3.562 0a21.519 21.519 0 018.59-8.59c1.405-.766 1.405-2.796 0-3.562a21.506 21.506 0 01-8.59-8.59c-.766-1.405-2.796-1.405-3.562 0a21.525 21.525 0 01-8.59 8.59c-1.405.765-1.405 2.795 0 3.562zM28.987 93.041a21.519 21.519 0 018.59-8.59c1.405-.766 1.405-2.796 0-3.562a21.506 21.506 0 01-8.59-8.59c-.766-1.405-2.796-1.405-3.562 0a21.519 21.519 0 01-8.59 8.59c-1.405.766-1.405 2.796 0 3.562a21.506 21.506 0 018.59 8.59c.766 1.406 2.796 1.406 3.562 0zM481.692 80.468a16.847 16.847 0 01-6.727-6.727c-.6-1.1-2.19-1.1-2.789 0a16.841 16.841 0 01-6.727 6.727c-1.1.6-1.1 2.19 0 2.79a16.847 16.847 0 016.727 6.727c.6 1.1 2.19 1.1 2.789 0a16.854 16.854 0 016.727-6.727c1.1-.6 1.1-2.19 0-2.79zM82.498 55.995a16.841 16.841 0 01-6.727-6.727c-.6-1.1-2.19-1.1-2.789 0a16.847 16.847 0 01-6.727 6.727c-1.1.6-1.1 2.19 0 2.79a16.854 16.854 0 016.727 6.727c.6 1.1 2.19 1.1 2.789 0a16.854 16.854 0 016.727-6.727c1.1-.601 1.1-2.191 0-2.79zM495.16 41.623a11.998 11.998 0 01-4.792-4.792 1.133 1.133 0 00-1.987 0 12.004 12.004 0 01-4.792 4.792 1.133 1.133 0 000 1.987 11.998 11.998 0 014.792 4.792c.427.784 1.56.784 1.987 0a12.004 12.004 0 014.792-4.792 1.134 1.134 0 000-1.987zM28.331 42.452a11.998 11.998 0 014.792 4.792c.427.784 1.56.784 1.987 0a12.004 12.004 0 014.792-4.792 1.133 1.133 0 000-1.987 11.998 11.998 0 01-4.792-4.792 1.133 1.133 0 00-1.987 0 12.004 12.004 0 01-4.792 4.792 1.134 1.134 0 000 1.987z" />
          </svg>
          {Math.round(currentTrackFeatures.danceability * 100)}
        </span>
        <span
          title="energy"
          className="flex items-center justify-center gap-1 px-4 py-1 text-gray-700 bg-white rounded-full"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 511.999 511.999">
            <path d="M389.053 7.603A14.995 14.995 0 00376.001 0h-180a14.995 14.995 0 00-14.546 11.367l-60 241a14.951 14.951 0 002.725 12.861 14.986 14.986 0 0011.821 5.771h68.35l-82.397 220.727c-2.637 7.031.337 14.927 6.943 18.486 6.636 3.556 14.846 1.653 19.233-4.395l240-331c3.325-4.556 3.794-10.591 1.245-15.63a15.018 15.018 0 00-13.374-8.188H312.5l76.362-128.28a14.999 14.999 0 00.191-15.116z" />
          </svg>
          {Math.round(currentTrackFeatures.energy * 100)}
        </span>
        <span
          title="loudness"
          className="flex items-center justify-center gap-1 px-4 py-1 text-gray-700 bg-white rounded-full"
        >
          {Math.round(currentTrackFeatures.loudness)} dB
        </span>
        <span
          title="pitch"
          className="flex items-center justify-center gap-1 px-4 py-1 text-gray-700 bg-white rounded-full"
        >
          {
            ["C", "C♯, D♭", "D", "D♯, E♭", "E", "F", "F♯, G♭", "G", "G♯, A♭", "A", "A♯, B♭", "B"][
              currentTrackFeatures.key
            ]
          }
        </span>
      </div>
    );
  return null;
}

function UserProfile({ profile }) {
  return (
    <div>
      <a
        className="flex flex-col items-center justify-center"
        target="_blank"
        href={profile.external_urls.spotify}
        rel="noreferrer"
      >
        <img
          className="rounded-full"
          width="128"
          height="128"
          src={profile.images[0].url}
          alt="avatar"
        />
        <p className="mt-3 text-xl font-bold">{profile.display_name}</p>
      </a>
    </div>
  );
}

function TopTag({ top_genres }) {
  function getBg(index) {
    switch (index) {
      case 0:
        return "linear-gradient(127.09deg, rgb(228, 63, 63) 0%, rgb(228, 108, 63) 100%)";
      case 1:
        return "linear-gradient(134.4deg, rgb(32, 172, 154) 0%, rgb(29, 185, 84) 52%, rgb(145, 192, 64) 100%)";
      case 2:
        return "linear-gradient(134.4deg, rgb(32, 172, 154) 0%, rgb(29, 185, 84) 52%, rgb(145, 192, 64) 100%)";
      case 3:
        return "linear-gradient(268.81deg, rgb(63, 134, 228) 0%, rgb(27, 82, 223) 100%)";
      case 4:
        return "linear-gradient(268.81deg, rgb(63, 134, 228) 0%, rgb(27, 82, 223) 100%)";
      default:
        return "#1db954";
    }
  }
  return (
    <div>
      <div className="space-y-3 text-sm">
        {top_genres.slice(0, 5).map((e, i) => (
          <div
            title={e.name}
            className="relative flex items-center justify-between h-10 gap-5 px-4 overflow-hidden font-semibold text-gray-800 capitalize bg-gray-200 rounded dark:text-white dark:bg-gray-800"
            key={i}
          >
            <span className="z-10 flex-1 truncate ">{e.name}</span>
            <span className="z-10 text-gray-700 dark:text-gray-400">{Math.round(e.percent)}%</span>
            <div
              className="absolute top-0 left-0 z-0 h-full"
              style={{ width: e.percent + "%", background: getBg(i) }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Analysis({ stats_analysis }) {
  return (
    <table className="w-full table-auto">
      <thead>
        <tr>
          <th className="text-left">Attribute</th>
          <th className="text-right">Value</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stats_analysis).map((e, i) => (
          <tr key={i}>
            <td> {e[0]}</td>
            <td className="text-right">{e[1]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function TagAndAnalysis({ top_genres, stats_analysis }) {
  const [tab, settab] = useState(0);
  return (
    <div className="mt-4 space-y-3">
      <div className="flex justify-between gap-5 text-sm">
        <button
          type="button"
          onClick={() => settab(0)}
          className={`font-semibold duration-300 uppercase rounded-none ${
            tab == 0 ? "text-spotify" : "text-gray-500 dark:hover:text-white hover:text-black"
          }`}
        >
          Top Genres
        </button>
        <button
          type="button"
          onClick={() => settab(1)}
          className={`font-semibold duration-300 uppercase rounded-none ${
            tab == 1 ? "text-spotify" : "text-gray-500 dark:hover:text-white hover:text-black"
          }`}
        >
          Analysis
        </button>
      </div>
      {tab == 0 && <TopTag top_genres={top_genres} />}
      {tab == 1 && <Analysis stats_analysis={stats_analysis} />}
    </div>
  );
}

function TopArtists({ top_artists }) {
  const [time_range, settime_range] = useState("long_term");
  const [showMore, setshowMore] = useState(false);
  const ifImageHover = useRef(false);
  const [artistsHighlight, setartistsHighlight] = useState([]);
  useEffect(() => {
    setartistsHighlight(top_artists[time_range].items.filter((e) => e.images.length).slice(0, 9));
    const interval = setInterval(() => {
      if (!ifImageHover.current)
        setartistsHighlight(
          top_artists[time_range].items
            .filter((e) => e.images.length)
            .sort(() => 0.5 - Math.random())
            .slice(0, 9)
        );
    }, 5000);
    return () => clearInterval(interval);
  }, [time_range, top_artists]);
  function abbreviateNumber(value) {
    let newValue = value;
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixNum = 0;
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }

    newValue = newValue.toPrecision(3);

    newValue += suffixes[suffixNum];
    return newValue;
  }
  return (
    <div className="pt-5">
      <div className="flex flex-col justify-between gap-2 mb-3 md:gap-5 md:flex-row">
        <p className="text-2xl font-bold">Top Artists</p>
        <div className="flex gap-5 text-sm">
          <button
            type="button"
            onClick={() => settime_range("short_term")}
            className={`font-semibold duration-300 uppercase dark:hover:text-white hover:text-black rounded-none ${
              time_range == "short_term" ? "border-b-4 border-spotify" : "text-gray-500"
            }`}
          >
            4 week
          </button>
          <button
            type="button"
            onClick={() => settime_range("medium_term")}
            className={`font-semibold duration-300 uppercase dark:hover:text-white hover:text-black rounded-none ${
              time_range == "medium_term" ? "border-b-4 border-spotify" : "text-gray-500"
            }`}
          >
            6 months
          </button>
          <button
            type="button"
            onClick={() => settime_range("long_term")}
            className={`font-semibold duration-300 uppercase dark:hover:text-white hover:text-black rounded-none ${
              time_range == "long_term" ? "border-b-4 border-spotify" : "text-gray-500"
            }`}
          >
            all time
          </button>
        </div>
      </div>
      <div className="relative flex flex-col-reverse gap-5 md:justify-between md:flex-row">
        <table>
          <tbody>
            {top_artists[time_range].items.slice(0, showMore ? 50 : 10).map((e, i) => (
              <tr key={i} className="text-lg">
                <td className="py-1 font-bold text-center text-gray-500">{i + 1}</td>
                <td className="py-1 pl-3 font-semibold">
                  <a href={e.external_urls.spotify} target="_blank" rel="noreferrer">
                    {e.name}
                  </a>
                </td>
              </tr>
            ))}
            <tr>
              <td />
              <td className="pl-3">
                <button
                  className="text-lg underline text-spotify"
                  onClick={() => setshowMore(!showMore)}
                >
                  {!showMore ? "Show more ▼" : "Show less ▲"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="hidden md:block">
          <div className="sticky grid grid-cols-3 gap-4 mx-auto top-5 md:w-96">
            {artistsHighlight.map((e, i) => (
              <a
                className="overflow-hidden rounded-full aspect-w-1 aspect-h-1 hover:z-50 group hover:scale-110"
                target="_blank"
                href={e.external_urls.spotify}
                key={i}
                onMouseEnter={() => (ifImageHover.current = true)}
                onMouseLeave={() => (ifImageHover.current = false)}
                style={{
                  backgroundImage: `url(${e.images[2]?.url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  transition: "all 0.3s ease-in-out",
                }}
                rel="noreferrer"
              >
                <div className="flex flex-col items-center justify-center font-semibold text-center text-transparent transition-all duration-300 group-hover:text-white group-hover:bg-opacity-40 group-hover:bg-black">
                  <p className="text-sm ">{e.name}</p>
                  <p className="text-xs ">{abbreviateNumber(e.followers.total)} followers</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopTracks({ top_tracks }) {
  const [time_range, settime_range] = useState("long_term");
  const [showMore, setshowMore] = useState(false);
  const ifImageHover = useRef(false);
  const [artistsHighlight, setartistsHighlight] = useState([]);
  useEffect(() => {
    setartistsHighlight(
      top_tracks[time_range].items.filter((e) => e.album.images.length).slice(0, 9)
    );
    const interval = setInterval(() => {
      if (!ifImageHover.current)
        setartistsHighlight(
          top_tracks[time_range].items
            .filter((e) => e.album.images.length)
            .sort(() => 0.5 - Math.random())
            .slice(0, 9)
        );
    }, 5000);
    return () => clearInterval(interval);
  }, [time_range, top_tracks]);

  return (
    <div className="pt-5">
      <div className="flex flex-col justify-between gap-2 mb-3 md:gap-5 md:flex-row">
        <p className="text-2xl font-bold">Top Tracks</p>
        <div className="flex gap-5 text-sm">
          <button
            onClick={() => settime_range("short_term")}
            className={`font-semibold duration-300 uppercase dark:hover:text-white hover:text-black rounded-none ${
              time_range == "short_term" ? "border-b-4 border-spotify" : "text-gray-500"
            }`}
          >
            4 week
          </button>
          <button
            onClick={() => settime_range("medium_term")}
            className={`font-semibold duration-300 uppercase dark:hover:text-white hover:text-black rounded-none ${
              time_range == "medium_term" ? "border-b-4 border-spotify" : "text-gray-500"
            }`}
          >
            6 months
          </button>
          <button
            onClick={() => settime_range("long_term")}
            className={`font-semibold duration-300 uppercase dark:hover:text-white hover:text-black rounded-none ${
              time_range == "long_term" ? "border-b-4 border-spotify" : "text-gray-500"
            }`}
          >
            all time
          </button>
        </div>
      </div>
      <div className="relative flex flex-col gap-5 md:justify-between md:flex-row">
        <div className="hidden md:block">
          <div className="sticky grid grid-cols-3 gap-2 mx-auto top-5 w-96">
            {artistsHighlight.map((e, i) => (
              <a
                className="overflow-hidden aspect-w-1 aspect-h-1 hover:z-50 group hover:scale-110"
                target="_blank"
                href={e.external_urls.spotify}
                key={i}
                onMouseEnter={() => (ifImageHover.current = true)}
                onMouseLeave={() => (ifImageHover.current = false)}
                style={{
                  backgroundImage: `url(${e.album.images[1]?.url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  transition: "all 0.3s ease-in-out",
                }}
                rel="noreferrer"
              >
                <div className="flex flex-col items-center justify-center font-semibold text-center text-transparent transition-all duration-300 group-hover:text-white group-hover:bg-opacity-40 group-hover:bg-black">
                  <p className="text-sm ">{e.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <table>
          <tbody>
            {top_tracks[time_range].items.slice(0, showMore ? 50 : 10).map((e, i) => (
              <tr key={i} className="text-lg">
                <td className="flex py-1 font-bold text-center text-gray-500">{i + 1}</td>
                <td className="py-1 pl-3 font-semibold">
                  <a href={e.external_urls.spotify} target="_blank" rel="noreferrer">
                    {e.name}
                  </a>
                </td>
              </tr>
            ))}
            <tr>
              <td />
              <td className="pl-3">
                <button
                  className="text-lg underline text-spotify"
                  onClick={() => setshowMore(!showMore)}
                >
                  {!showMore ? "Show more ▼" : "Show less ▲"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const last_refresh_date = Date.now();
  const profile = await SpotifyApi.getMe();
  let [short_term, medium_term, long_term] = await Promise.all([
    SpotifyApi.getTop("artists", "short_term"),
    SpotifyApi.getTop("artists", "medium_term"),
    SpotifyApi.getTop("artists", "long_term"),
  ]);
  const top_artists = { long_term, short_term, medium_term };

  [short_term, medium_term, long_term] = await Promise.all([
    SpotifyApi.getTop("tracks", "short_term"),
    SpotifyApi.getTop("tracks", "medium_term"),
    SpotifyApi.getTop("tracks", "long_term"),
  ]);
  const top_tracks = { long_term, short_term, medium_term };

  //get by 4 months
  const artistsList = medium_term.items.map((e) => e.artists.map((e) => e.id)).flat();

  const top_artists_by_tracks = [];
  for (let i = 0; i < artistsList.length; i += 50) {
    let temp = await SpotifyApi.getArtists(artistsList.slice(i, i + 50));
    top_artists_by_tracks.push(...temp);
  }

  const obj = {};
  for (const e of top_artists_by_tracks) {
    for (const g of e.genres) {
      if (!obj[g]) obj[g] = 1;
      else obj[g] += 1;
    }
  }
  let top_genres = [];
  let total = 0;
  for (let [name, count] of Object.entries(obj)) {
    top_genres.push({ name, count });
    total += count;
  }
  top_genres = top_genres.map((e) => ({ ...e, percent: (e.count / total) * 100 }));
  top_genres.sort((a, b) => b.count - a.count);

  let stats_analysis = await SpotifyApi.getAudioFeatures(
    top_tracks.medium_term.items.map((e) => e.id)
  );
  stats_analysis = stats_analysis.reduce((previousV, currentV) => ({
    danceability: previousV.danceability + currentV.danceability,
    energy: previousV.energy + currentV.energy,
    valence: previousV.valence + currentV.valence,
    tempo: previousV.tempo + currentV.tempo,
    loudness: previousV.loudness + currentV.loudness,
    speechiness: previousV.speechiness + currentV.speechiness,
  }));
  stats_analysis.danceability = (stats_analysis.danceability * 2).toFixed(1);
  stats_analysis.energy = (stats_analysis.energy * 2).toFixed(1);
  stats_analysis.valence = (stats_analysis.valence * 2).toFixed(1);
  stats_analysis.tempo = Math.round(stats_analysis.tempo / 50);
  stats_analysis.loudness = (stats_analysis.loudness / 50).toFixed(1);
  stats_analysis.speechiness = (stats_analysis.speechiness * 2).toFixed(1);

  return {
    props: {
      profile,
      top_artists,
      top_tracks,
      last_refresh_date,
      top_artists_by_tracks,
      stats_analysis,
      top_genres,
    },
    revalidate: 60 * 60 * 24,
  };
}
