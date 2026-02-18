import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PauseIcon from "./pause-icon.svg";
import PlayIcon from "./play-icon.svg";
import MuteIcon from "./mute-icon.svg";
import UnmuteIcon from "./unmute-icon.svg";
import FullSreenExitIcon from "./full-screen-exit.svg";
import RepeatIcon from "./repeat.svg";
import FullScreenIcon from "./full-screen.svg";
import SkipIcon from "./skip.svg";
import SettingIcon from "./settings.svg";
import CaptionIcon from "./subtitle.svg";
import PipIcon from "./pip.svg";
import type { Config as ReactPlayerConf } from "react-player/types";
import RangeSlider from "../RangeSider";
import ReactPlayer from "react-player";
import type { CaptionSettings, Cue, Font } from "./Caption";
import type { SettingsConf, SettingsTab } from "./Settings.type";
import Settings from "./Settings";
import Caption from "./Caption";
import type { Episode } from "@/app/feature/film";

type Props = {
  episode: Episode;
  className?: string;
  defaultLang?: string;
  Spinner?: React.FC;
};

type PlayerState = {
  isSettingsOpen: boolean;
  isHoveringControlItem: boolean;
  tabSettingsIdActive: string;
  qualitySourceActive: string;
  isThumbDisplayed: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  isMuted: boolean;
  isControlsShow: boolean;
  soundVol: number;
  loop: boolean;
  pip: boolean;
  playbackRate: number;
  error?: string;

  // subtitle
  subtitleText?: string;
  cues: Cue[];
  selectedTrackId?: string;
  captionSettings: CaptionSettings;
  isCaptionOn: boolean;
};

const fontOptions: { [key: string]: Font } = {
  proportionalSanSerif: {
    label: "Proportional sans-serif",
    fontFamily: "sans-serif",
  },
  monospacedSanSerif: {
    label: "Monospaced sans-serif",
    fontFamily: "monospace",
  },
  proportionalSerif: { label: "Proportional serif", fontFamily: "serif" },
  monospacedSerif: {
    label: "Monospaced serif",
    fontFamily: "'Courier New', monospace",
  },
  casual: {
    label: "Casual",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
  },
  cursive: { label: "Cursive", fontFamily: "cursive" },
  smallCapitals: {
    label: "Small capitals",
    fontFamily: "'Arial', sans-serif",
    isSmallCaps: true,
  },
};

const MOUSE_HIDE_TIME = 2500;
const SKIP_TIME = 90;
const MAX_VOLUME = 1;

const COLOR_PALLETE: { [key: string]: string } = {
  white: `255,255,255`,
  black: `0,0,0`,
  red: `255,0,0`,
  green: `0,255,0`,
  blue: `0,0,255`,
  yellow: `255,255,0`,
  magenta: `255,0,255`,
  cyan: `0,255,255`,
};

const reactPlayerConf: ReactPlayerConf = {
  youtube: {
    disablekb: 1,
    rel: 0,
    color: "white",
  },
};

const initialState: PlayerState = {
  isHoveringControlItem: false,
  isSettingsOpen: false,
  playbackRate: 1,
  isThumbDisplayed: true,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  isMuted: false,
  isControlsShow: false,
  soundVol: 1,
  loop: false,
  pip: false,
  tabSettingsIdActive: "menu",
  qualitySourceActive: "auto",
  selectedTrackId: undefined,
  cues: [],
  captionSettings: {
    font: fontOptions.casual,
    fontSize: 100,
    lineHeight: 1.2,
    color: "white",
    bgColor: "black",
    bgOpacity: 0.5,
    bottom: 100, // percent offset from bottom
    textAlign: "center",
    maxWidth: 85, // percent
    bgShadow: true,
  },
  isCaptionOn: false,
};

const VideoPlayer: React.FC<Props> = ({
  episode,
  Spinner,
  className = "",
  defaultLang = "vi",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<PlayerState>(initialState);

  const createColor = useCallback(
    (key: string, alpha: number = 1) => {
      return `rgba(${COLOR_PALLETE[key]},${alpha})`;
    },
    [setState],
  );

  // Debounced controls show/hide
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // helper: parse timestamp like 00:01:23.450 -> seconds
  const tsToSec = (ts: string) => {
    const parts = ts.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return Number(ts);
  };

  // Very lightweight WebVTT parser (works for common cases)
  const parseVTT = (text: string) => {
    const lines = text.replace("\r\n", "\n").split(/\n/);
    const cues = [];
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) {
        i++;
        continue;
      }
      // skip possible cue ID
      const timeLineIdx =
        i + 1 < lines.length && lines[i + 1].includes("-->")
          ? i + 1
          : line.includes("-->")
            ? i
            : -1;
      if (timeLineIdx === -1) {
        i++;
        continue;
      }
      const timeLine = lines[timeLineIdx].trim();
      const [startRaw, endRaw] = timeLine
        .split("-->")
        .map((s) => s.trim().split(" ")[0]);
      const start = tsToSec(startRaw.replace(",", "."));
      const end = tsToSec(endRaw.replace(",", "."));
      // cue text may span multiple lines
      let j = timeLineIdx + 1;
      const textLines = [];
      while (j < lines.length && lines[j].trim() !== "") {
        textLines.push(lines[j]);
        j++;
      }
      const cueText = textLines.join("\n");
      cues.push({ start, end, text: cueText });
      i = j + 1;
    }
    return cues;
  };

  const isPipDisable = useMemo(() => {
    return ReactPlayer.canEnablePIP
      ? !ReactPlayer.canEnablePIP(episode.sources.sourceType)
      : false;
  }, [episode.sources]);
  const togglePlay = () => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  };

  const handleToggleLoop = () => {
    setState((prev) => ({ ...prev, loop: !prev.loop }));
  };

  const handleTimeUpdate = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    const ct = e.currentTarget.currentTime;
    setState((prev) => ({ ...prev, currentTime: ct }));
  };

  const handleDurationChange = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    const d = e.currentTarget.duration;
    setState((prev) => ({ ...prev, duration: d }));
  };

  const handleLoadMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>,
  ) => {
    const d = e.currentTarget.duration;
    setState((prev) => ({ ...prev, duration: d }));
  };

  const handleChangePlaybackRate = (e: React.MouseEvent, n: number) => {
    e.stopPropagation();
    setState((prev) => ({
      ...prev,
      playbackRate: n,
      tabSettingsIdActive: "menu",
    }));
  };
  const handleChangePlaybackRateRange = (n: number) => {
    setState((prev) => ({ ...prev, playbackRate: n }));
  };

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      setState((prev) => ({ ...prev, currentTime: time }));
      videoRef.current.currentTime = time;
    }
  };

  const toggleMute = () => {
    setState((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
      soundVol: prev.soundVol == 0 ? MAX_VOLUME : prev.soundVol,
    }));
  };

  const toggleFullScreen = () => {
    if (videoWrapperRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoWrapperRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!document.fullscreenElement) {
      videoWrapperRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleVolChange = (val: number) => {
    setState((prev) => ({ ...prev, soundVol: val }));
  };

  const handleSeekMouseDown = () => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  };

  const handleSeekMouseUp = () => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  };

  const handleReady = () => {
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleSeeking = () => {
    setState((prev) => ({ ...prev, isLoading: true }));
  };

  const handleSeeked = () => {
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleError = (e: any) => {
    console.error("Player error", e);
    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: "unable to loading video",
    }));
  };

  const handleWaiting = () => {
    setState((prev) => ({ ...prev, isLoading: true }));
  };

  const handlePlaying = () => {
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleSkip = () => {
    handleSeek(state.currentTime + SKIP_TIME);
  };

  const handleEnd = () => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  };

  const handlePreviewClick = () => {
    setState((prev) => ({ ...prev, isThumbDisplayed: false, isPlaying: true }));
  };

  const handleEnterPictureInPicture = () => {
    setState((prevState) => ({ ...prevState, pip: true }));
  };

  const handleLeavePictureInPicture = () => {
    setState((prevState) => ({ ...prevState, pip: false }));
  };

  const toggleSettings = (e: React.MouseEvent) => {
    e.stopPropagation();

    setState((prevState) => ({
      ...prevState,
      isSettingsOpen: !prevState.isSettingsOpen,
    }));
  };

  const handleQualitySrcTypeChange = (
    e: React.MouseEvent,
    sourceType: string,
  ) => {
    e.stopPropagation();
    setState((prev) => ({
      ...prev,
      qualitySourceActive: sourceType,
      tabSettingsIdActive: "menu",
    }));
  };

  const handleCaptionChangeSelected = (
    e: React.MouseEvent,
    key: keyof CaptionSettings,
    value: any,
  ) => {
    e.stopPropagation();
    setState((prev) => ({
      ...prev,
      captionSettings: { ...prev.captionSettings, [key]: value },
      tabSettingsIdActive: "menu",
    }));
  };

  const handleCaptionOff = () => {
    setState((prev) => ({ ...prev, isCaptionOn: false }));
  };

  const toggleCaption = () => {
    setState((prev) => ({ ...prev, isCaptionOn: !prev.isCaptionOn }));
  };

  const handleSelectedTrackId = (e: React.MouseEvent, trackId: string) => {
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;
    if (episode.tracks && episode.tracks[trackId]) {
      setState((prev) => ({
        ...prev,
        selectedTrackId: trackId,
        isCaptionOn: true,
        tabSettingsIdActive: "menu",
      }));
    }
  };

  const handleTabSettingsSwitch = (
    e: React.MouseEvent,
    tabId: string = "menu",
  ) => {
    e.stopPropagation();
    setState((prevState) => ({ ...prevState, tabSettingsIdActive: tabId }));
  };

  const convertTrackToSettingConfArr = () => {
    const { tracks } = episode;
    if (!tracks) return [];
    return Object.values(tracks).map<SettingsTab>(({ id, title }) => ({
      id: id,
      title: title,
      type: "select",
      value: id,
      isSelected: id === state.selectedTrackId && state.isCaptionOn === true,
      eventHandle: handleSelectedTrackId,
    }));
  };

  const menuSettingsConf = useMemo<SettingsTab>(() => {
    return {
      id: "menu",
      title: undefined,
      items: [
        {
          title: `Speed`,
          id: "speed",
          type: "list",
          eventHandle: handleTabSettingsSwitch,
          valTitle: state.playbackRate.toString() + "x",
          value: "speed",
        },
        {
          title: "Quality",
          id: "quality",
          type: "list",
          eventHandle: handleTabSettingsSwitch,
          valTitle: state.qualitySourceActive,
          value: "quality",
        },
        {
          title: "Subtitle",
          id: "subtitle",
          type: "list",
          eventHandle: handleTabSettingsSwitch,
          valTitle: state.isCaptionOn
            ? state.selectedTrackId !== undefined &&
              episode.tracks &&
              episode.tracks[state.selectedTrackId] !== undefined
              ? episode.tracks[state.selectedTrackId].title
              : "off"
            : "off",
          value: "subtitle",
        },
      ],
    };
  }, [
    state.tabSettingsIdActive,
    state.playbackRate,
    state.qualitySourceActive,
    state.selectedTrackId,
    state.isCaptionOn,
  ]);
  const speedSettingsConf = useMemo<SettingsTab>(() => {
    return {
      id: "speed",
      parentId: "menu",
      title: "Speed",
      eventHandle: handleTabSettingsSwitch,
      items: [
        {
          id: "option",
          title: state.playbackRate + "x",
          type: "range",
          value: state.playbackRate,
          min: 0,
          max: 2,
          step: 0.05,
          eventHandle: handleChangePlaybackRateRange,
        },
        {
          id: "0.25x",
          title: "0.25x",
          value: 0.25,
          type: "select",

          eventHandle: handleChangePlaybackRate,
          isSelected: 0.25 === state.playbackRate,
        },
        {
          id: "0.5x",
          title: "0.5x",
          value: 0.5,

          eventHandle: handleChangePlaybackRate,
          isSelected: 0.25 === state.playbackRate,
          type: "select",
        },
        {
          id: "0.75x",
          type: "select",
          title: "0.75x",
          value: 0.75,

          isSelected: 0.75 === state.playbackRate,

          eventHandle: handleChangePlaybackRate,
        },
        {
          id: "1x",
          type: "select",
          title: "1",
          value: 1,

          isSelected: 1 === state.playbackRate,
          eventHandle: handleChangePlaybackRate,
        },
        {
          id: "1.25x",
          type: "select",
          title: "1.25x",
          value: 1.25,

          isSelected: 0.25 === state.playbackRate,

          eventHandle: handleChangePlaybackRate,
        },
        {
          id: "1.5x",
          type: "select",
          title: "1.5x",

          value: 1.5,
          isSelected: 1.5 === state.playbackRate,
          eventHandle: handleChangePlaybackRate,
        },
        {
          id: "1.75x",
          type: "select",
          title: "1.75x",
          value: 1.75,

          isSelected: 1.75 === state.playbackRate,
          eventHandle: handleChangePlaybackRate,
        },
        {
          id: "2x",
          type: "select",
          title: "2x",
          value: 2,

          isSelected: 2 === state.playbackRate,
          eventHandle: handleChangePlaybackRate,
        },
      ],
    };
  }, [state.playbackRate]);
  const qualitySettingsConf = useMemo<SettingsTab>(() => {
    return {
      id: "quality",
      parentId: "menu",
      title: "Quality",
      eventHandle: handleTabSettingsSwitch,
      items: [
        // {
        //   id: "auto",
        //   title: "auto",
        //   type: "select",
        //   value: "auto",
        //   eventHandle: () => {},
        // },
        {
          id: "360p",
          title: "360p",
          type: "select",
          value: "360p",

          eventHandle: handleQualitySrcTypeChange,
          isSelected: "360p" === state.qualitySourceActive,
        },
        {
          id: "720p",
          title: "720p",
          type: "select",
          value: "720p",

          eventHandle: handleQualitySrcTypeChange,
          isSelected: "720p" === state.qualitySourceActive,
        },
        {
          id: "1080p",
          title: "1080p",
          type: "select",
          value: "1080p",

          eventHandle: handleQualitySrcTypeChange,
          isSelected: "1080p" === state.qualitySourceActive,
        },
      ],
    };
  }, [state.qualitySourceActive]);

  // ----- Settings Configuration Caption -------
  const captionSettingsConf = useMemo<
    SettingsTab<void, CaptionSettings>
  >(() => {
    return {
      id: "options-caption-menu",
      parentId: "subtitle",
      type: "list",
      title: "Options",
      eventHandle: handleTabSettingsSwitch,
      items: [
        {
          id: "fontSize",
          type: "list",
          value: "fontSize",
          title: "Font Size",
          valTitle: state.captionSettings.fontSize.toString() + "%",
          eventHandle: handleTabSettingsSwitch,
        },
        {
          id: "font",
          type: "list",
          value: "font",
          title: "Font",
          valTitle: state.captionSettings.font.label,
          eventHandle: handleTabSettingsSwitch,
        },
        {
          id: "textAlign",
          type: "list",
          value: "textAlign",
          title: "Text Align",
          valTitle: state.captionSettings.textAlign,
          eventHandle: handleTabSettingsSwitch,
        },
        {
          id: "textColor",
          type: "list",
          value: "textColor",
          title: "Text Color",
          valTitle: state.captionSettings.color,
          eventHandle: handleTabSettingsSwitch,
        },
        {
          id: "bgColor",
          type: "list",
          value: "bgColor",
          title: "Background Color",
          valTitle: state.captionSettings.bgColor,
          eventHandle: handleTabSettingsSwitch,
        },
        {
          id: "bgOpacity",
          type: "list",
          value: "bgOpacity",
          title: "Background Opacity",
          valTitle:
            ((state.captionSettings.bgOpacity * 100) | 0).toString() + "%",
          eventHandle: handleTabSettingsSwitch,
        },
        {
          id: "bgShadow",
          type: "list",
          value: "bgShadow",
          title: "Background Shadow",
          valTitle: state.captionSettings.bgShadow ? "On" : "Off",
          eventHandle: handleTabSettingsSwitch,
        },
      ],
    };
  }, [state.captionSettings]);

  const textColorSettingsConf = useMemo<
    SettingsTab<void, CaptionSettings>
  >(() => {
    return {
      id: "color",
      parentId: "customCaption",
      title: "Text Color",
      eventHandle: handleTabSettingsSwitch,
      items: [
        ...Object.keys(COLOR_PALLETE).map<SettingsTab<CaptionSettings>>(
          (c) => ({
            id: c,
            title: c,
            type: "select",
            value: c,
            targetProperty: "color",
            eventHandle: handleCaptionChangeSelected,
            isSelected: c === state.captionSettings.color,
          }),
        ),
      ],
    };
  }, [state.captionSettings.color]);

  const fontSettingsConf = useMemo<SettingsTab<void, CaptionSettings>>(() => {
    return {
      id: "font",
      parentId: "customCaption",
      title: "Font",
      eventHandle: handleTabSettingsSwitch,
      items: Object.keys(fontOptions).map((item) => {
        const font = fontOptions[item];
        return {
          id: font.label,
          title: font.label,
          type: "select",
          value: font,
          eventHandle: handleCaptionChangeSelected,
          targetProperty: "font",
          isSelected: font.label == state.captionSettings.font.label,
        };
      }),
    };
  }, [state.captionSettings.font]);

  const bgColorSettingsConf = useMemo<
    SettingsTab<void, CaptionSettings>
  >(() => {
    return {
      id: "color",
      parentId: "customCaption",
      title: "Background Color",
      eventHandle: handleTabSettingsSwitch,
      items: [
        ...Object.keys(COLOR_PALLETE).map<SettingsTab<CaptionSettings>>(
          (c) => ({
            id: c,
            title: c,
            type: "select",
            value: c,
            targetProperty: "bgColor",
            eventHandle: handleCaptionChangeSelected,
            isSelected: c === state.captionSettings.bgColor,
          }),
        ),
      ],
    };
  }, [state.captionSettings.bgColor]);

  const bgOpacitySettingsConf = useMemo<
    SettingsTab<void, CaptionSettings>
  >(() => {
    return {
      id: "bgOpacity",
      parentId: "customCaption",
      title: "Background Opacity",
      eventHandle: handleTabSettingsSwitch,
      items: [
        {
          id: "0",
          title: "0%",
          type: "select",
          value: 0,
          eventHandle: handleCaptionChangeSelected,
          targetProperty: "bgOpacity",
          isSelected: 0 === state.captionSettings.bgOpacity,
        },
        {
          id: "25",
          title: "25%",
          type: "select",
          value: 0.25,
          eventHandle: handleCaptionChangeSelected,
          targetProperty: "bgOpacity",
          isSelected: 0.25 === state.captionSettings.bgOpacity,
        },
        {
          id: "50",
          title: "50%",
          type: "select",
          value: 0.5,
          eventHandle: handleCaptionChangeSelected,
          targetProperty: "bgOpacity",
          isSelected: 0.5 === state.captionSettings.bgOpacity,
        },
        {
          id: "75",
          title: "75%",
          type: "select",
          value: 0.75,

          eventHandle: handleCaptionChangeSelected,
          targetProperty: "bgOpacity",
          isSelected: 0.75 === state.captionSettings.bgOpacity,
        },
        {
          id: "100",
          title: "100%",
          type: "select",
          eventHandle: handleCaptionChangeSelected,
          targetProperty: "bgOpacity",
          value: 1,
          isSelected: 1 === state.captionSettings.bgOpacity,
        },
      ],
    };
  }, [state.captionSettings.bgOpacity]);

  const textAlignSettingsConf = useMemo<
    SettingsTab<void, CaptionSettings>
  >(() => {
    return {
      id: "textAlign",
      parentId: "customCaption",
      title: "Text Align",
      eventHandle: handleTabSettingsSwitch,
      items: [
        {
          id: "center",
          title: "Center",
          type: "select",
          value: "center",
          eventHandle: handleCaptionChangeSelected,
          targetProperty: "textAlign",
          isSelected: "center" === state.captionSettings.textAlign,
        },
        {
          id: "left",
          title: "Left",
          type: "select",
          value: "left",
          targetProperty: "textAlign",
          eventHandle: handleCaptionChangeSelected,
          isSelected: "left" === state.captionSettings.textAlign,
        },
        {
          id: "right",
          title: "Right",
          type: "select",
          value: "right",
          targetProperty: "textAlign",
          eventHandle: handleCaptionChangeSelected,
          isSelected: "right" === state.captionSettings.textAlign,
        },
        {
          id: "justify",
          title: "Justify",
          type: "select",
          value: "justify",
          targetProperty: "textAlign",
          eventHandle: handleCaptionChangeSelected,
          isSelected: "justify" === state.captionSettings.textAlign,
        },
      ],
    };
  }, [state.captionSettings.textAlign]);

  const bgShadowSettingsConf = useMemo<
    SettingsTab<void, CaptionSettings>
  >(() => {
    return {
      id: "bgShadow",
      parentId: "customCaption",
      title: "Background Shadow",
      eventHandle: handleTabSettingsSwitch,
      items: [
        {
          id: "on",
          title: "On",
          type: "select",
          value: true,
          targetProperty: "bgShadow",
          eventHandle: handleCaptionChangeSelected,
          isSelected: state.captionSettings.bgShadow,
        },
        {
          id: "off",
          title: "Off",
          type: "select",
          value: false,
          targetProperty: "bgShadow",
          eventHandle: handleCaptionChangeSelected,
          isSelected: !state.captionSettings.bgShadow,
        },
      ],
    };
  }, [state.captionSettings.bgShadow]);

  const overlayStyle = useMemo<React.CSSProperties>(() => {
    const {
      bottom,
      maxWidth,
      textAlign,
      fontSize,
      lineHeight,
      color,
      bgColor,
      bgOpacity,
      bgShadow,
      font,
    } = state.captionSettings;
    return {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      bottom: `${bottom}%`,
      maxWidth: `${maxWidth}%`,
      width: "auto",
      textAlign: textAlign,
      fontSize: `clamp(8px, ${fontSize / 100}vw, 64px)`,
      lineHeight: lineHeight,
      color: createColor(color),
      padding: "0.35rem 0.6rem",
      background: createColor(bgColor, bgOpacity),
      borderRadius: 6,
      pointerEvents: "none", // clicks pass through overlay
      whiteSpace: "pre-line",
      fontFamily: font.fontFamily,
      fontVariant: font.isSmallCaps ? "small-caps" : "none",
      boxShadow: bgShadow ? "0 6px 20px rgba(0,0,0,0.6)" : "none",
    };
  }, [state.captionSettings]);

  const fontSizeSettingsConf = useMemo((): SettingsTab<
    void,
    CaptionSettings
  > => {
    return {
      id: "fontSize",
      title: "Font Size",
      parentId: "customCaption",
      eventHandle: handleTabSettingsSwitch,
      items: [
        {
          id: "50",
          title: "50%",
          value: 50,
          type: "select",
          targetProperty: "fontSize",
          eventHandle: handleCaptionChangeSelected,
          isSelected: 50 == state.captionSettings.fontSize,
        },
        {
          id: "75",
          title: "75%",
          value: 75,
          type: "select",
          targetProperty: "fontSize",
          eventHandle: handleCaptionChangeSelected,
          isSelected: 75 == state.captionSettings.fontSize,
        },
        {
          id: "100",
          title: "100%",
          value: 100,
          type: "select",
          targetProperty: "fontSize",
          eventHandle: handleCaptionChangeSelected,
          isSelected: 100 == state.captionSettings.fontSize,
        },
        {
          id: "150",
          title: "150%",
          value: 150,
          type: "select",
          targetProperty: "fontSize",
          eventHandle: handleCaptionChangeSelected,
          isSelected: 150 == state.captionSettings.fontSize,
        },
        {
          id: "200",
          title: "200%",
          value: 200,
          type: "select",
          targetProperty: "fontSize",
          eventHandle: handleCaptionChangeSelected,
          isSelected: 200 == state.captionSettings.fontSize,
        },
        {
          id: "300",
          title: "300%",
          value: 300,
          type: "select",
          targetProperty: "fontSize",
          eventHandle: handleCaptionChangeSelected,
          isSelected: 300 == state.captionSettings.fontSize,
        },
        {
          id: "400",
          title: "400%",
          value: 400,
          type: "select",
          eventHandle: handleCaptionChangeSelected,
          targetProperty: "fontSize",
          isSelected: 400 == state.captionSettings.fontSize,
        },
      ],
    };
  }, [state.captionSettings.fontSize]);

  // ----------------------------------------------

  const subtitleSettingsConf = useMemo<SettingsTab>(() => {
    return {
      id: "subtitle",
      parentId: "menu",
      title: "Subtitle",
      eventHandle: handleTabSettingsSwitch,
      headerAdditionalButton: {
        type: "header-list",
        title: "Custom",
        eventHandle: handleTabSettingsSwitch,
        value: "customCaption",
        id: "custom-caption",
      },
      items: [
        {
          id: "off",
          title: "off",
          type: "select",
          isSelected: !state.isCaptionOn,
          eventHandle: handleCaptionOff,
        },
        ...convertTrackToSettingConfArr(),
      ],
    };
  }, [state.selectedTrackId, state.isCaptionOn]);

  const settingsConf: SettingsConf = useMemo<SettingsConf>(
    () => ({
      menu: menuSettingsConf,
      speed: speedSettingsConf,
      quality: qualitySettingsConf,
      subtitle: subtitleSettingsConf,
      customCaption: captionSettingsConf,
      fontSize: fontSizeSettingsConf,
      textAlign: textAlignSettingsConf,
      textColor: textColorSettingsConf,
      bgColor: bgColorSettingsConf,
      bgOpacity: bgOpacitySettingsConf,
      bgShadow: bgShadowSettingsConf,
      font: fontSettingsConf,
    }),
    [
      state.captionSettings,
      state.tabSettingsIdActive,
      state.qualitySourceActive,
      state.playbackRate,
      state.isCaptionOn,
    ],
  );

  const handleMouseMove = useCallback(() => {
    setState((prev) => {
      if (!prev.isControlsShow) {
        return { ...prev, isControlsShow: true };
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (prev.isHoveringControlItem || !prev.isPlaying) {
        return { ...prev, isControlsShow: true };
      }

      timeoutRef.current = setTimeout(() => {
        setState((prev2) => ({
          ...prev2,
          isControlsShow: false,
        }));
      }, MOUSE_HIDE_TIME);

      return prev;
    });
  }, [setState]);

  const handleMouseEnter = useCallback(() => {
    setState((prev) => ({ ...prev, isControlsShow: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => {
      if (prev.isHoveringControlItem || !prev.isPlaying) {
        return { ...prev, isControlsShow: true };
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setState((prev2) => ({
        ...prev2,
        isControlsShow: false,
      }));

      return prev;
    });
  }, []);

  useEffect(() => {
    // Setup selected track.
    if (episode.tracks) {
      const k = Object.keys(episode.tracks).find(
        (v) =>
          episode.tracks &&
          episode.tracks[v].srcLang &&
          episode.tracks[v].srcLang === defaultLang,
      );
      if (k) {
        setState((prev) => ({
          ...prev,
          selectedTrackId: k,
          isCaptionOn: true,
        }));
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!state.selectedTrackId) {
      setState((s) => ({ ...s, cues: [], subtitleText: "" }));
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        if (episode.tracks && state.selectedTrackId) {
          const res = await fetch(
            episode.tracks[state.selectedTrackId].src ?? "",
          );
          const txt = await res.text();

          if (cancelled) return;
          const parsed = parseVTT(txt);
          setState((s) => ({ ...s, cues: parsed, subtitleText: "" }));
        }
      } catch (e) {
        console.error("Failed to load VTT", e);
        setState((s) => ({ ...s, cues: [], subtitleText: "" }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [state.selectedTrackId]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const v = videoRef.current;
      if (v && state.cues.length) {
        const t = v.currentTime || 0;
        // find the first cue that matches (cues are usually small, O(n) ok)
        const c = state.cues.find((c) => t >= c.start && t <= c.end);
        const txt = c ? c.text : "";
        // only update when changed
        if (txt !== state.subtitleText) {
          setState((s) => ({ ...s, subtitleText: txt }));
        }
      } else if (!state.cues.length && state.subtitleText) {
        setState((s) => ({ ...s, subtitleText: "" }));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state.cues, state.subtitleText]);

  const {
    error,
    isMuted,
    isPlaying,
    isLoading,
    soundVol,
    isControlsShow,
    currentTime,
    duration,
    isThumbDisplayed,
    loop,
    pip,
    playbackRate,
    isSettingsOpen,
    tabSettingsIdActive,
    subtitleText,
    isCaptionOn,
  } = state;
  return (
    <div
      ref={videoWrapperRef}
      className={`w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="player-wrapper relative aspect-video group"
        id="player-wrapper"
      >
        <ReactPlayer
          ref={videoRef}
          src={episode.sources.sourceUrls}
          muted={isMuted}
          playing={isPlaying}
          width={"100%"}
          height={"100%"}
          fallback={<div>...loading</div>}
          volume={soundVol}
          onTimeUpdate={(e) => handleTimeUpdate(e)}
          config={reactPlayerConf}
          pip={pip}
          controls={false}
          loop={loop}
          playbackRate={playbackRate}
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onReady={handleReady}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onError={handleError}
          onEnded={handleEnd}
          disablePictureInPicture={isPipDisable}
          crossOrigin="anonymous"
          onLoadedMetadata={(e) => handleLoadMetadata(e)}
          onDurationChange={(e) => {
            handleDurationChange(e);
          }}
          onLeavePictureInPicture={handleLeavePictureInPicture}
        ></ReactPlayer>

        <div
          className={`absolute size-full top-0 left-0 group ${
            isThumbDisplayed ? "" : "hidden"
          }`}
        >
          <img
            src={episode.thumbnailUrl}
            className={`absolute top-0 left-0 size-full cursor-pointer`}
          />
          <PlayIcon
            className="absolute top-[50%] left-[50%] -translate-[50%] fill-orange-500 size-20 stroke-orange-500 shadow-2xs hidden group-hover:block transition cursor-pointer"
            onClick={handlePreviewClick}
          />
          <div className="absolute bg-gradient-to-b group-hover:from-black/30 trainsition top-0 left-0 w-full h-1/6" />
          <div className="absolute bg-gradient-to-t group-hover:from-black/30 bottom-0 transition left-0 w-full h-1/6" />
        </div>

        {/* Overlay hide youtube screen */}
        <div
          className={`flex flex-col w-full h-full cursor-pointer ${
            !isThumbDisplayed ? "absolute top-0 left-0" : "hidden"
          }`}
        >
          <div
            className="absolute top-[50%] left-[50%] -translate-[50%] w-full h-full flex justify-center items-center"
            onClick={togglePlay}
            onDoubleClick={(e) => handleDoubleClick(e)}
          >
            {Spinner && isLoading ? (
              !error ? (
                <Spinner />
              ) : (
                <p>{error}</p>
              )
            ) : (
              <></>
            )}
          </div>

          {/* Settings */}
          <div
            className={`absolute z-10 gap-2 left-2 top-2 font-semibold text-orange-white items-start transition ${
              isControlsShow ? "flex flex-row" : "hidden"
            }`}
          >
            <SettingIcon
              className={`fill-orange-400 duration-600 size-6 transition ${
                isSettingsOpen ? "rotate-180" : ""
              }`}
              onClick={(e: React.MouseEvent) => toggleSettings(e)}
              onMouseEnter={() =>
                setState((prev) => ({ ...prev, isHoveringControlItem: true }))
              }
              onMouseLeave={() =>
                setState((prev) => ({ ...prev, isHoveringControlItem: false }))
              }
            />

            <Settings
              settingId={tabSettingsIdActive}
              settingsConf={settingsConf}
              isSettingsOpen={isSettingsOpen}
            />
          </div>
          {/* Controls */}
          <div className={"absolute flex flex-col bottom-0 left-0 w-full"}>
            <Caption
              isCaptionOn={isCaptionOn}
              overlayStyle={overlayStyle}
              subtitleText={subtitleText}
            />
            <div
              className={`px-3 py-3 bg-gray-900
              transition ease-in flex flex-col gap-2 items-center duration-600 origin-bottom ${
                duration != 0 && isControlsShow
                  ? "opacity-100 h-auto"
                  : "scale-0 opacity-0 pointer-events-none h-0"
              }`}
            >
              <div
                className="w-4/5"
                onMouseEnter={() =>
                  setState((prev) => ({ ...prev, isHoveringControlItem: true }))
                }
                onMouseLeave={() =>
                  setState((prev) => ({
                    ...prev,
                    isHoveringControlItem: false,
                  }))
                }
              >
                <RangeSlider
                  min={0}
                  max={duration}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  trackColor="var(--color-orange-500)"
                  foregroundColor="var(--color-gray-500)"
                  thumbColor="var(--color-orange-500)"
                  thumbHoverColor="var(--color-orange-600)"
                  onMouseDown={handleSeekMouseDown}
                  onMouseUp={handleSeekMouseUp}
                />
              </div>
              <div className="flex w-full items-center flex-row gap-2 justify-between">
                <div className="flex flex-row gap-2 basis-1/3 items-center">
                  <button
                    type="button"
                    onClick={() => togglePlay()}
                    className="text-white focus:outline-none cursor-pointer transition"
                    aria-label={isPlaying ? "Pause" : "Play"}
                    title={isPlaying ? "Pause" : "Play"}
                    onMouseEnter={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: true,
                      }))
                    }
                    onMouseLeave={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: false,
                      }))
                    }
                  >
                    {isPlaying ? (
                      <PauseIcon className="size-5 fill-orange-500 stroke-orange-500 hover:fill-orange-600 hover:scale-120 hover:storke-orange-600 stroke-0" />
                    ) : (
                      <PlayIcon className="size-5 fill-orange-500 stroke-orange-500 hover:fill-orange-600 hover:storke-orange-600 hover:scale-120 stroke-0" />
                    )}
                  </button>
                  <div className="flex flex-row">
                    <button
                      onClick={() => toggleMute()}
                      className="cursor-pointer focus:outline-none transition"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      title={isMuted ? "Unmute" : "Mute"}
                      onMouseEnter={() =>
                        setState((prev) => ({
                          ...prev,
                          isHoveringControlItem: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setState((prev) => ({
                          ...prev,
                          isHoveringControlItem: false,
                        }))
                      }
                    >
                      {isMuted ? (
                        <MuteIcon className="size-5 text-orange-500 hover:text-orange-600 stroke-2 transition hover:scale-120" />
                      ) : (
                        <UnmuteIcon className="size-5 text-orange-500 hover:text-orange-600 transition hover:scale-120" />
                      )}
                    </button>
                    <div
                      className="flex w-12 items-center"
                      title="volume"
                      onMouseEnter={() =>
                        setState((prev) => ({
                          ...prev,
                          isHoveringControlItem: true,
                        }))
                      }
                      onMouseLeave={() =>
                        setState((prev) => ({
                          ...prev,
                          isHoveringControlItem: false,
                        }))
                      }
                    >
                      <RangeSlider
                        min={0}
                        max={1}
                        value={soundVol}
                        onChange={handleVolChange}
                        step={0.1}
                        trackColor="var(--color-orange-500)"
                        foregroundColor="var(--color-gray-500)"
                        thumbColor="var(--color-orange-500)"
                        thumbHoverColor="var(--color-orange-600)"
                      />
                    </div>
                  </div>

                  <RepeatIcon
                    className={`size-5 ${
                      loop
                        ? "fill-orange-600 scale-120"
                        : "fill-orange-500 hover:fill-orange-600 hover:scale-120"
                    } transition `}
                    title="loop"
                    onClick={handleToggleLoop}
                    onMouseEnter={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: true,
                      }))
                    }
                    onMouseLeave={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: false,
                      }))
                    }
                  />

                  <SkipIcon
                    className="size-5 font-normal fill-orange-500 hover:fill-orange-600 transition hover:scale-120 cursor-pointer"
                    title="Skip OP/ED"
                    onClick={handleSkip}
                    onMouseEnter={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: true,
                      }))
                    }
                    onMouseLeave={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: false,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <span className="text-orange-500 font-semibold text-xs cursor-default">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                  {episode.tracks && (
                    <div className="flex flex-col items-center justify-center mt-1">
                      <CaptionIcon
                        title="subtitle(on/off)"
                        onClick={toggleCaption}
                        onMouseEnter={() =>
                          setState((prev) => ({
                            ...prev,
                            isHoveringControlItem: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setState((prev) => ({
                            ...prev,
                            isHoveringControlItem: false,
                          }))
                        }
                        className={`size-6 cursor-pointer transition fill-orange-500 hover:scale-120`}
                      />
                      <div
                        className={`bg-orange-500 rounded-full transition-[width] origin-center h-1 ease-in ${
                          isCaptionOn ? "w-4/5" : "w-0"
                        }`}
                      ></div>
                    </div>
                  )}
                  <PipIcon
                    className={`size-6 cursor-pointer transition fill-orange-500 hover:fill-orange-600 hover:scale-120 ${
                      isPipDisable || document.fullscreenElement ? "hidden" : ""
                    }`}
                    onClick={handleEnterPictureInPicture}
                  />
                  <button
                    className="cursor-pointer focus:outline-none transition"
                    onClick={toggleFullScreen}
                    onMouseEnter={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: true,
                      }))
                    }
                    onMouseLeave={() =>
                      setState((prev) => ({
                        ...prev,
                        isHoveringControlItem: false,
                      }))
                    }
                    aria-label={`${
                      document.fullscreenElement
                        ? "minimize mode"
                        : "fullscreen mode"
                    }`}
                  >
                    {document.fullscreenElement ? (
                      <FullSreenExitIcon className="stroke-0 fill-orange-500 size-5 hover:scale-120 hover:fill-orange-600" />
                    ) : (
                      <FullScreenIcon className="stroke-0 fill-orange-500 hover:scale-120 hover:fill-orange-600 size-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
