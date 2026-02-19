import type { SettingsConf } from "./Settings.type";
import ArrowBackIcon from "./arrow-back.svg?react";
import RangeSlider from "../RangeSider";

interface Props {
    settingId: string;
    settingsConf: SettingsConf
    isSettingsOpen: boolean,
}

export default function Settings ({settingId, settingsConf, isSettingsOpen}: Props){
    const tab = settingsConf[settingId] ?? settingsConf["menu"];
    if (tab) {
      return (
        <div
          className={`text-orange-400 flex flex-col overflow-hidden h-auto bg-gray-900/60 min-w-34 rounded max-h-44 transition origin-top-left ${
            isSettingsOpen ? "" : "scale-0"
          }`}
        >
          {tab.parentId != undefined && tab.title != undefined && (
            <div className="relative p-2 w-full flex fex-row text-xs items-center justify-between border-b-1 tracking-tighter gap-4">
              <ArrowBackIcon
                className="size-4 fill-orange-500"
                onClick={(e) => {
                  tab.eventHandle && tab.eventHandle(e, tab.parentId);
                }}
              />

              <div className="text-xs">{tab.title}</div>

              {tab.headerAdditionalButton ? (
                <div
                  className="text-xs underline underline-offset-1"
                  onClick={(e) =>
                    tab.headerAdditionalButton?.eventHandle?.(
                      e,
                      tab.headerAdditionalButton.value
                    )
                  }
                >
                  {tab.headerAdditionalButton.title}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          )}
          <div className="overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-900/30 [&::-webkit-scrollbar-thumb]:bg-orange-400 [&::-webkit-scrollbar-thumb]:rounded-full">
            {tab.items &&
              tab.items.map((it) => {
                switch (it.type) {
                  case "range":
                    if (
                      it.min != undefined &&
                      it.max != undefined &&
                      it.step != undefined &&
                      it.value != undefined &&
                      it.eventHandle != undefined
                    ) {
                      return (
                        <div className="text-xs p-3 mx-auto w-32" key={it.id}>
                          {it.title && <label>{it.title}</label>}
                          <RangeSlider
                            value={it.value}
                            min={it.min}
                            max={it.max}
                            step={it.step}
                            onChange={it.eventHandle}
                            trackColor="var(--color-orange-500)"
                            foregroundColor="var(--color-gray-500)"
                            thumbColor="var(--color-orange-500)"
                            thumbHoverColor="var(--color-orange-600)"
                          />
                        </div>
                      );
                    }
                    break;

                  case "list":
                    return (
                      it.title && (
                        <div
                          key={it.id}
                          className="text-xs -mr-1 px-2 py-1 hover:bg-gray-900/70 h-8 w-44 items-center flex justify-between"
                          onClick={(e) => {
                            it.eventHandle?.(e, it.value);
                          }}
                        >
                          <div>{it.title}</div>
                          <div>{it.valTitle || "off"}</div>
                        </div>
                      )
                    );
                  case "select":
                    return (
                      it.title && (
                        <div
                          key={it.id}
                          className=" flex flex-row p-2 hover:bg-gray-900/70 h-8 items-center justify-between"
                          onClick={(e) => {
                            if (it.eventHandle) {
                              it.targetProperty
                                ? it.eventHandle(e, it.targetProperty, it.value)
                                : it.eventHandle(e, it.value);
                            }
                          }}
                        >
                          <div
                            className={`font-medium ${
                              it.isSelected ? "visible" : "invisible"
                            }`}
                          >
                            &#10003;
                          </div>
                          <div className="text-xs ">{it.title}</div>
                        </div>
                      )
                    );
                  default:
                    return <></>;
                }
              })}
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  };