import React, { useEffect, useRef, useState } from "react";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import moment from "moment";
import { PageSEO } from "@/components/SEO";
import siteMetadata from "@/data/siteMetadata";
import Modal from "react-modal";

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
    currentTrack?.item?.id ? `/api/spotify/track-features?id=${currentTrack.item.id}` : null
  );
  const { data } = useSWR("/api/spotify/my-feeling");
  if (data?.feeling && currentTrack.item && currentTrackFeatures)
    return (
      <p className="text-center text-gray-700 dark:text-gray-300">
        I'm feeling{" "}
        <span
          className={`font-bold text-${
            getValence(
              data.feeling.reduce((a, b) => a + b, currentTrackFeatures.valence) /
                (data.feeling.length + 1)
            )[1]
          }`}
        >
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
                  className="object-cover w-full rounded-lg md:w-32 md:h-32"
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
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
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
            className="relative flex items-center justify-between h-10 gap-5 px-4 overflow-hidden font-semibold text-gray-800 capitalize bg-gray-200 rounded-md dark:text-white dark:bg-gray-800"
            key={i}
          >
            <div
              className="absolute top-0 left-0 z-0 h-full rounded-md"
              style={{ width: e.percent + "%", background: getBg(i) }}
            />
            <span className="relative flex-1 truncate ">{e.name}</span>
            <span className="relative text-gray-700 dark:text-gray-400">
              {Math.round(e.percent)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analysis({ stats_analysis }) {
  function Icon({ name }) {
    switch (name) {
      case "danceability":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
          </svg>
        );
      case "speechiness":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        );
      case "valence":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "loudness":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "energy":
        return (
          <svg className="w-full h-full fill-current" viewBox="0 0 511.999 511.999">
            <path d="M389.053 7.603A14.995 14.995 0 00376.001 0h-180a14.995 14.995 0 00-14.546 11.367l-60 241a14.951 14.951 0 002.725 12.861 14.986 14.986 0 0011.821 5.771h68.35l-82.397 220.727c-2.637 7.031.337 14.927 6.943 18.486 6.636 3.556 14.846 1.653 19.233-4.395l240-331c3.325-4.556 3.794-10.591 1.245-15.63a15.018 15.018 0 00-13.374-8.188H312.5l76.362-128.28a14.999 14.999 0 00.191-15.116z" />
          </svg>
        );
      case "tempo":
        return (
          <svg className="w-full h-full fill-current" viewBox="0 0 512 512">
            <path d="M468.363 399.132l-6.171-22.452C454.8 349.785 430.156 331 402.263 331H109.495c-27.894 0-52.537 18.785-59.93 45.681l-5.9 21.468c-7.505 27.308-1.963 55.887 15.205 78.41S102.127 512 130.447 512h251.884c28.076 0 53.939-12.806 70.959-35.135s22.514-50.661 15.073-77.733zm-46.886 53.485C412.089 464.935 397.82 472 382.331 472H130.447c-15.733 0-30.228-7.176-39.765-19.689-9.538-12.513-12.617-28.39-8.447-43.561l5.9-21.468C90.77 377.695 99.554 371 109.495 371h292.768c9.941 0 18.725 6.695 21.359 16.281l6.171 22.452c4.105 14.935 1.074 30.566-8.316 42.884zM105.753 248.715c10.65 2.927 16.911 13.935 13.984 24.585l-5.497 20c-2.44 8.877-10.493 14.705-19.273 14.705-1.755 0-3.538-.232-5.313-.72-10.65-2.927-16.911-13.935-13.984-24.585l5.497-20c2.929-10.652 13.932-16.913 24.586-13.985zm37.961-199.964C161.658 18.681 194.564 0 229.592 0h52.574c44.88 0 84.531 30.224 96.425 73.499L436.088 282.7c2.927 10.651-3.334 21.658-13.984 24.585-1.773.487-3.558.72-5.313.72-8.781 0-16.833-5.827-19.273-14.705L340.02 84.099C332.885 58.134 309.094 40 282.166 40h-52.574c-21.019 0-40.763 11.208-51.528 29.249-5.66 9.486-17.938 12.586-27.423 6.926-9.486-5.66-12.587-17.938-6.927-27.424zm-87.629 78.166l16.907 15.099A59.658 59.658 0 0068.407 165c0 33.084 26.916 60 60 60a59.616 59.616 0 0029.068-7.536l85.609 76.453a19.994 19.994 0 0021.494 3.337A20 20 0 00276.406 279v-33h20c11.046 0 20-8.954 20-20s-8.954-20-20-20h-20v-40h20c11.046 0 20-8.954 20-20s-8.954-20-20-20h-20v-26c0-11.046-8.954-20-20-20s-20 8.954-20 20v134.325l-52.404-46.799a59.645 59.645 0 004.404-22.525c0-33.084-26.916-60-60-60a59.628 59.628 0 00-28.646 7.293l-17.032-15.21c-8.239-7.356-20.882-6.644-28.239 1.596-7.356 8.237-6.642 20.88 1.596 28.237zM148.407 165c0 11.028-8.972 20-20 20s-20-8.972-20-20 8.972-20 20-20 20 8.972 20 20z"></path>
          </svg>
        );
      default:
        return null;
    }
  }
  function getBg(index) {
    switch (index) {
      case 0:
        return "linear-gradient(127.09deg, rgb(228, 63, 63) 0%, rgb(228, 108, 63) 100%)";
      case 1:
        return "linear-gradient(127.09deg, rgb(228, 63, 63) 0%, rgb(228, 108, 63) 100%)";
      case 2:
        return "linear-gradient(134.4deg, rgb(32, 172, 154) 0%, rgb(29, 185, 84) 52%, rgb(145, 192, 64) 100%)";
      case 3:
        return "linear-gradient(134.4deg, rgb(32, 172, 154) 0%, rgb(29, 185, 84) 52%, rgb(145, 192, 64) 100%)";
      case 4:
        return "linear-gradient(268.81deg, rgb(63, 134, 228) 0%, rgb(27, 82, 223) 100%)";
      case 5:
        return "linear-gradient(268.81deg, rgb(63, 134, 228) 0%, rgb(27, 82, 223) 100%)";
      default:
        return "#1db954";
    }
  }
  function getUnit(name) {
    switch (name) {
      case "loudness":
        return " dB";
      case "tempo":
        return " BPM";
      default:
        return "%";
    }
  }
  function mapValue(value, in_min, in_max, out_min, out_max) {
    return ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }
  function getPercent([name, value]) {
    switch (name) {
      case "loudness":
        return Math.round(mapValue(value, -20, 0, 0, 100));
      case "tempo":
        return Math.round(mapValue(value, 60, 170, 0, 100));
      default:
        return Math.round(value);
    }
  }
  function getData(name) {
    switch (name) {
      case "danceability":
        return "Danceability describes how danceable a track is, based on its beat and rhythm.";
      case "speechiness":
        return "Speechiness defines how many spoken words exist on a track.";
      case "valence":
        return "Valence defines the musical positiveness conveyed by a track.";
      case "loudness":
        return "Loudness describes the subjective perception of sound pressure in a track.";
      case "energy":
        return "Loudness describes the subjective perception of sound pressure in a track.";
      case "tempo":
        return "Loudness describes the subjective perception of sound pressure in a track.";
      default:
        return null;
    }
  }
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="w-full space-y-3">
      <Modal
        isOpen={showInfo !== false}
        onRequestClose={() => setShowInfo(false)}
        className="absolute w-auto h-auto duration-300 -translate-x-1/2 -translate-y-1/2 outline-none left-1/2 top-1/2"
        overlayClassName="bg-black duration-300 bg-opacity-50 fixed left-0 top-0 right-0 bottom-0"
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex flex-col items-center justify-center w-[calc(100vw-30px)] p-5 text-center bg-white rounded-lg dark:bg-gray-800 md:w-96">
            <button className="absolute -top-3 -right-3" onClick={() => setShowInfo(false)}>
              <svg
                className="w-10 h-10 p-2 text-white rounded-full bg-spotify"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="w-16 h-16 p-4 mb-5 text-white rounded-full bg-spotify">
              <Icon name={showInfo} />
            </div>
            <h3 className="mb-2 text-xl font-semibold capitalize">{showInfo}</h3>
            <p>{getData(showInfo)}</p>
          </div>
        </div>
      </Modal>
      {Object.entries(stats_analysis)
        .sort((a, b) => getPercent(b) - getPercent(a))
        .map((e, i) => (
          <div
            className="relative flex items-center justify-between h-10 gap-5 px-4 overflow-hidden text-sm font-semibold text-gray-800 capitalize bg-gray-200 rounded-md dark:text-white dark:bg-gray-800"
            key={i}
          >
            <div
              className="absolute top-0 left-0 z-0 h-full rounded-md"
              style={{ width: getPercent(e) + "%", background: getBg(i) }}
            />
            <div className="relative flex items-center flex-1 gap-2 truncate">
              <span>{e[0]}</span>
              <svg
                onClick={() => setShowInfo(e[0])}
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block w-5 h-5 cursor-pointer"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="relative text-gray-700 dark:text-gray-400">
              {Math.round(e[1])}
              {getUnit(e[0])}
            </span>
          </div>
        ))}
    </div>
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
