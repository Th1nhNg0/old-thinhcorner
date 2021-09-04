import React, { useEffect, useState } from "react";
import { PageSEO } from "@/components/SEO";
import siteMetadata from "@/data/siteMetadata";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import moment from "moment";
import useAudio from "@/lib/useAudio";

export default function spotify() {
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
        <div className="md:sticky md:top-5 md:w-60">
          <UserProfile />
          <FellingNow />
          <TopTag />
        </div>
        <div className="flex-1 space-y-5">
          <CurrentPlaying />
          <RecentlyTrack />
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

function FellingNow() {
  const { data: currentTrack } = useSWR("/api/spotify/current-playing", { refreshInterval: 5000 });
  const { data } = useSWR("/api/spotify/my-feeling");
  if (data && currentTrack)
    return (
      <p className="text-center text-gray-700 dark:text-gray-300">
        I'm feeling{" "}
        <span className={`font-bold text-${getValence(data.feeling)[1]}`}>
          {getValence(data.feeling)[0]}
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
    const [playingReview, toggle] = useAudio(track.preview_url);
    function getTime() {
      let minutes = moment.duration(track.duration_ms).minutes();
      let seconds = "0" + moment.duration(track.duration_ms).seconds();
      seconds = seconds.substr(seconds.length - 2);
      return `${minutes}:${seconds}`;
    }
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="relative w-16" onClick={() => toggle()}>
          <img src={track.album.images[2].url} alt="track-image" />
          <div
            title="Preview track"
            className="absolute top-0 left-0 flex items-center justify-center w-full h-full"
          >
            <svg className="cursor-pointer w-7 h-7 opacity-80" viewBox="0 0 20 20" fill="white">
              {!playingReview ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <a
            target="_blank"
            href={track.external_urls.spotify}
            className="font-semibold md:text-lg"
          >
            {track.name}
          </a>
          <p className="flex text-sm text-gray-700 dark:text-gray-300 md:text-base ">
            {track.artists.map((e2, i) => (
              <span key={i}>
                {i != 0 && ", "}
                <a target="_blank" href={e2.external_urls.spotify}>
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

  if (data)
    return (
      <div>
        <p className="mb-2 text-xl font-bold">Recently played track</p>
        <div className="relative px-5 py-3 bg-gray-100 dark:bg-gray-800">
          <div className="mb-5 divide-y-2 dark:divide-gray-700">
            {data.items.slice(0, showMore ? 10 : 5).map((e, i) => (
              <TrackItem key={i} {...e} />
            ))}
          </div>
          <button className="absolute left-0 w-full -bottom-5">
            <svg
              onClick={() => setshowMore(!showMore)}
              className="w-10 h-10 p-2 mx-auto bg-green-500 rounded-full"
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
        </div>
      </div>
    );
  return null;
}

function CurrentPlaying() {
  const { data: currentTrack } = useSWR("/api/spotify/current-playing", { refreshInterval: 5000 });
  const { mutate } = useSWRConfig();
  const [playingReview, toggle] = useAudio(
    currentTrack?.item.preview_url || currentTrack?.item.audio_preview_url
  );
  useEffect(() => {
    mutate("/api/spotify/recently-track?limit=10");
    mutate("/api/spotify/my-feeling");
  }, [currentTrack?.item.name]);

  if (currentTrack?.item)
    return (
      <div>
        <p className="mb-2 text-xl font-bold">Currently listening to</p>
        <div className="flex flex-col flex-1 w-full gap-3 p-5 bg-gray-100 shadow-md dark:bg-gray-800 md:flex-row">
          <div className="relative" onClick={() => toggle()}>
            <img
              className="object-cover w-full md:w-32 md:h-32"
              src={currentTrack.item.album?.images[1].url || currentTrack.item?.images[1].url}
              alt="listen-track-cover"
            />
            <div
              title="Preview track"
              className="absolute top-0 left-0 flex items-center justify-center w-full h-full"
            >
              <svg className="w-10 h-10 cursor-pointer opacity-80" viewBox="0 0 20 20" fill="white">
                {!playingReview ? (
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                )}
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <a
              target="_blank"
              href={currentTrack.item.external_urls.spotify}
              className="text-xl font-semibold"
            >
              {currentTrack.item.name}
            </a>
            <div className="flex text-gray-700 dark:text-gray-300">
              {currentTrack.item?.artists ? (
                currentTrack.item.artists.map((e, i) => (
                  <a target="_blank" href={e.external_urls.spotify} key={i}>
                    {i != 0 && ", "}
                    {e.name}
                  </a>
                ))
              ) : (
                <div>
                  <a target="_blank" href={currentTrack.item.show.external_urls.spotify}>
                    {currentTrack.item.show.name} • {currentTrack.item.show.publisher}
                  </a>
                </div>
              )}
            </div>
            <div className="flex items-end flex-1">
              <CurrentPlayingFeatures id={currentTrack.item.id} />
            </div>
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

  if (currentTrackFeatures)
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
        <span
          title="valence"
          className={`flex items-center justify-center gap-1 px-4 py-1 text-white bg-${
            getValence(currentTrackFeatures.valence)[1]
          } rounded-full`}
        >
          {getValence(currentTrackFeatures.valence)[0]}
        </span>
        <span
          title="tempo"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-blue-500 rounded-full"
        >
          {Math.round(currentTrackFeatures.tempo)} BPM
        </span>
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
          title="pitch"
          className="flex items-center justify-center gap-1 px-4 py-1 text-white bg-pink-500 rounded-full"
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
function UserProfile() {
  const { data } = useSWR("/api/spotify/me");
  if (data)
    return (
      <div>
        <a
          className="flex flex-col items-center justify-center"
          target="_blank"
          href={data.external_urls.spotify}
        >
          <img className="w-32 rounded-full" src={data.images[0].url} alt="avatar" />
          <p className="mt-3 text-xl font-bold">{data.display_name}</p>
        </a>
      </div>
    );
  return "loading";
}
function TopTag() {
  const { data } = useSWR("/api/spotify/top?type=artists&time_range=long_term");
  const [genres, setgenres] = useState([]);
  useEffect(() => {
    if (data) {
      let obj = {};
      for (let e of data.items) {
        for (let g of e.genres) {
          if (!obj[g]) obj[g] = 1;
          else obj[g] += 1;
        }
      }
      let myList = [];
      myList = Object.entries(obj).map((e) => ({ name: e[0], count: e[1] }));
      myList.sort((a, b) => b.count - a.count);
      setgenres(myList);
    }
  }, [data]);
  if (data)
    return (
      <div className="mt-5">
        <p className="text-lg font-semibold">Top Genres</p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-sm">
          {genres
            .slice(0, 10)
            .sort((a, b) => a.name.length - b.name.length)
            .map((e, i) => (
              <div className="px-4 py-1 bg-gray-100 rounded-full dark:bg-gray-800" key={i}>
                {e.name}
              </div>
            ))}
        </div>
      </div>
    );
  return null;
}
