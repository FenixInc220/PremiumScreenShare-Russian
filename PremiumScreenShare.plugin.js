/**
 * @name PremiumScreenShare
 * @author Ahlawat
 * @authorId 1025214794766221384
 * @translator FenixInc
 * @translatorId 718104012590940162
 * @version 2.3.1
 * @invite SgKSKyh9gY
 * @description Сделайте вашу демонстацию экрана в высоком качестве и в высоких FPS без Disocrd Nitro.
 * @website https://tharki-god.github.io/
 * @source https://github.com/Tharki-God/BetterDiscordPlugins/blob/master/PremiumScreenShare
 * @updateUrl https://tharki-god.github.io/BetterDiscordPlugins/PremiumScreenShare.plugin.js
 */
/*@cc_on
@if (@_jscript)
var shell = WScript.CreateObject("WScript.Shell");
var fs = new ActiveXObject("Scripting.FileSystemObject");
var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
var pathSelf = WScript.ScriptFullName;
shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
} else if (!fs.FolderExists(pathPlugins)) {
shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
} else if (shell.Popup("Should I move myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
fs.MoveFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)));
shell.Exec("explorer " + pathPlugins);
shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
}
WScript.Quit();
@else@*/
module.exports = (() => {
  const config = {
    info: {
      name: "PremiumScreenShare",
      authors: [
        {
          name: "Ahlawat",
          discord_id: "1025214794766221384",
          github_username: "Tharki-God",
        },
      ],
      version: "2.3.1",
      description: "Сделайте вашу демонстацию экрана в высоком качестве и в высоких FPS без Disocrd Nitro.",
      github: "https://github.com/Tharki-God/BetterDiscordPlugins",
      github_raw:
        "https://tharki-god.github.io/BetterDiscordPlugins/PremiumScreenShare.plugin.js",
    },
    changelog: [
      {
        title: "v0.0.1",
        items: ["Идея в уме"],
      },
      {
        title: "v0.0.5",
        items: ["Базовая модель"],
      },
      {
        title: "Первоначальный выпуск v1.0.0",
        items: [
          "Это первоначальный релиз плагина :)",
        ],
      },
      {
        title: "v1.0.1",
        items: ["Обработчик библиотеки"],
      },
      {
        title: "v1.0.3",
        items: ["Рефрактор"],
      },
      {
        title: "v1.0.4",
        items: ["Имя модуля"],
      },
      {
        title: "v1.0.5",
        items: ["Добавлена опция для большего количества кадров в секунду"],
      },
      {
        title: "v2.0.0",
        items: ["Действительно премиальный и содержит функцию, которой нет нитро."],
      },
      {
        title: "v2.0.1",
        items: ["Удален бесполезный код"],
      },
      {
        title: "v2.0.2",
        items: ["Оптимизация"],
      },
      {
        title: "v2.0.6",
        items: ["Заменены выпадающие списки на RadioGroup, потому что Zlib сломан"],
      },
      {
        title: "v2.2.1",
        items: ["Рефрактор и исправлены некоторые ошибки"],
      },
      {
        title: "v2.2.3",
        items: ["Исправленный текст"],
      },
    ],
    main: "PremiumScreenShare.plugin.js",
  };
  const RequiredLibs = [{
    window: "ZeresPluginLibrary",
    filename: "0PluginLibrary.plugin.js",
    external: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
    downloadUrl: "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js"
  },
  {
    window: "BunnyLib",
    filename: "1BunnyLib.plugin.js",
    external: "https://github.com/Tharki-God/BetterDiscordPlugins",
    downloadUrl: "https://tharki-god.github.io/BetterDiscordPlugins/1BunnyLib.plugin.js"
  },
  ];
  class handleMissingLibrarys {
    load() {
      for (const Lib of RequiredLibs.filter(lib => !window.hasOwnProperty(lib.window)))
        BdApi.showConfirmationModal(
          "Библиотека отсутствует",
          `Отсутствует подключаемый модуль библиотеки (${Lib.window}), необходимый для ${config.info.name}. Нажмите «Загрузить сейчас», чтобы установить его.`,
          {
            confirmText: "Скачать сейчас",
            cancelText: "Закрыть",
            onConfirm: () => this.downloadLib(Lib),
          }
        );
    }
    async downloadLib(Lib) {
      const fs = require("fs");
      const path = require("path");
      const { Plugins } = BdApi;
      const LibFetch = await fetch(
        Lib.downloadUrl
      );
      if (!LibFetch.ok) return this.errorDownloadLib(Lib);
      const LibContent = await LibFetch.text();
      try {
        await fs.writeFile(
          path.join(Plugins.folder, Lib.filename),
          LibContent,
          (err) => {
            if (err) return this.errorDownloadLib(Lib);
          }
        );
      } catch (err) {
        return this.errorDownloadLib(Lib);
      }
    }
    errorDownloadZLib(Lib) {
      const { shell } = require("electron");
      BdApi.showConfirmationModal(
        "Ошибка загрузки",
        [
          `${Lib.window} Загрузка не удалась. Вручную установите библиотеку плагинов по ссылке ниже.`,
        ],
        {
          confirmText: "Скачать",
          cancelText: "Закрыть",
          onConfirm: () => {
            shell.openExternal(
              Lib.external
            );
          },
        }
      );
    }
    start() { }
    stop() { }
  }
  return RequiredLibs.some(m => !window.hasOwnProperty(m.window))
    ? handleMissingLibrarys
    : (([Plugin, ZLibrary]) => {
      const {
        PluginUpdater,
        Logger,
        Utilities,
        Patcher,
        Settings: {
          SettingPanel,
          SettingGroup,
          RadioGroup,
          Dropdown, //scrolling issues
        },
      } = ZLibrary;
      const {
        LibraryUtils,
        LibraryModules: {
          ApplicationStreamingOptionStore,
          WebRTCUtils,
          TextTags
        }
      } = BunnyLib.build(config);
      const fpsOptions = [
        {
          name: "5 FPS",
          value: 5,
        },
        {
          name: "10 FPS",
          value: 10,
        },
        {
          name: "15 FPS",
          value: 15,
        },
        {
          name: "30 FPS",
          value: 30,
        },
        {
          name: "45 FPS",
          value: 45,
        },
        {
          name: "60 FPS",
          value: 60,
        },
        {
          name: "120 FPS",
          value: 120,
        },
        {
          name: "144 FPS",
          value: 144,
        },
        {
          name: "240 FPS",
          value: 240,
        },
        {
          name: "360 FPS",
          value: 360,
        },
      ];
      const resoOptions = [
        {
          name: "144p",
          value: 144,
        },
        {
          name: "240p",
          value: 240,
        },
        {
          name: "360p",
          value: 360,
        },
        {
          name: "480p",
          value: 480,
        },
        {
          name: "720p",
          value: 720,
        },
        {
          name: "1080p",
          value: 1080,
        },
        {
          name: "1440p",
          value: 1440,
        },
        {
          name: "2160p",
          value: 2160,
        },
      ];
      const resoWithSource = [
        {
          name: "Source",
          value: 0,
        },
        ...resoOptions,
      ];
      const defaultSettings = {
        fps: {
          1: 15,
          2: 30,
          3: 60,
        },
        resolution: {
          1: 480,
          2: 720,
          3: 1080,
        },
        smoothVideo: {
          resolution: 720,
          fps: 60,
        },
        betterReadability: {
          resolution: 0,
          fps: 60,
        },
      };
      return class PremiumScreenShare extends Plugin {
        constructor() {
          super();
          this.settings = Utilities.loadData(
            config.info.name,
            "settings",
            defaultSettings
          );
        }
        checkForUpdates() {
          try {
            PluginUpdater.checkForUpdate(
              config.info.name,
              config.info.version,
              config.info.github_raw
            );
          } catch (err) {
            Logger.err("Не удалось связаться с программой обновления плагинов.", err);
          }
        }
        start() {
          this.checkForUpdates();
          this.saveDefault();
          this.initialize();
          this.patchQualityStore();
          this.fixBetterReadablityText();
        }
        saveDefault() {
          if (!this.defaultParameters)
            this.defaultParameters = Object.freeze({
              LY: Object.freeze(Object.assign({}, ApplicationStreamingOptionStore?.LY)),
              ND: Object.freeze(
                ApplicationStreamingOptionStore?.ND?.map((n) => Object.freeze(n))
              ),
              WC: Object.freeze(
                ApplicationStreamingOptionStore?.WC?.map((n) => Object.freeze(n))
              ),
              af: Object.freeze(
                ApplicationStreamingOptionStore?.af?.map((n) => Object.freeze(n))
              ),
              k0: Object.freeze(
                ApplicationStreamingOptionStore?.k0?.map((n) => Object.freeze(n))
              ),
              km: Object.freeze(
                ApplicationStreamingOptionStore?.km?.map((n) => Object.freeze(n))
              ),
              no: Object.freeze(Object.assign({}, ApplicationStreamingOptionStore?.no)),
              ws: Object.freeze(Object.assign({}, ApplicationStreamingOptionStore?.ws)),
            });
        }

        initialize() {
          this.constants = {
            settings: this.settings,
            get fps() {
              return Object.values(this.settings["fps"])
                .sort(LibraryUtils.ascending)
                .filter((item, pos, self) => LibraryUtils.removeDuplicate(item, pos, self));
            },
            get fpsWithPresets() {
              return [
                this.settings["betterReadability"].fps,
                this.settings["smoothVideo"].fps,
                ...this.fps,
              ];
            },
            get resolution() {
              return [
                ...Object.values(this.settings["resolution"])
                  .sort(LibraryUtils.ascending)
                  .filter((item, pos, self) => LibraryUtils.removeDuplicate(item, pos, self)),
                0,
              ];
            },
            get resolutionWithPresets() {
              return [
                this.settings["smoothVideo"].resolution,
                this.settings["betterReadability"].resolution,
                ...this.resolution,
              ];
            }
          };
          const customParameters = {
            LY: Object.assign(
              {},
              ...this.constants["resolution"].map((resolution) => {
                const label = `RESOLUTION_${resolution == 0 ? "SOURCE" : resolution}`;
                return { [resolution]: label, [label]: resolution };
              })
            ),
            ND: this.constants["resolutionWithPresets"].map(
              (resolution) => this.constants["fpsWithPresets"].map(
                (fps) => ({ resolution, fps })
              )
            ).flat(Infinity),
            WC: this.constants["resolution"]
              .filter((resolution) => resolution !== this.settings["resolution"][1])
              .map((resolution) => ({ value: resolution, label: resolution == 0 ? "Source" : resolution })),
            af: this.constants["fps"].map(
              (fps) => ({ value: fps, label: `${fps} FPS` })
            ),
            k0: this.constants["fps"].map(
              (fps) => ({ value: fps, label: fps })
            ),
            km: this.constants["resolution"].map(
              (res) => ({ value: res, label: res == 0 ? "Source" : `${res}p` })
            ),
            no: {
              1: [this.settings["smoothVideo"]],
              2: [this.settings["betterReadability"]],
              3: [],
            },
            ws: Object.assign(
              {},
              ...this.constants["fps"].map((res) => {
                const label = `FPS_${res}`;
                return { [res]: label, [label]: res };
              })
            ),
          };
          this.setStreamParameters(customParameters);
        }
        patchQualityStore() {
          const maxResolution = Math.max(
            ...this.constants["resolutionWithPresets"]
          );
          const maxFPS = Math.max(
            ...this.constants["fpsWithPresets"]
          );
          const maxVideoQuality = Object.freeze({
            width: maxResolution * (16 / 9),
            height: maxResolution,
            framerate: maxFPS,
          });
          Patcher.before(
            WebRTCUtils,
            "updateVideoQuality",
            (instance, args) => {
              instance.videoQualityManager.options.videoBudget =
                maxVideoQuality;
              instance.videoQualityManager.options.videoCapture =
                maxVideoQuality;
              for (const ladder in instance.videoQualityManager.ladder
                .ladder) {
                instance.videoQualityManager.ladder.ladder[ladder].framerate =
                  maxVideoQuality.framerate;
                instance.videoQualityManager.ladder.ladder[
                  ladder
                ].mutedFramerate = maxVideoQuality.framerate / 2;
              }
              for (const ladder of instance.videoQualityManager.ladder
                .orderedLadder) {
                ladder.framerate = maxVideoQuality.framerate;
                ladder.mutedFramerate = maxVideoQuality.framerate / 2;
              }
            }
          );
        }
        fixBetterReadablityText() {
          Patcher.before(TextTags, "render", (_, [args]) => {
            if (args?.title !== "Resolution" || !args?.children?.props?.children) return;
            const {
              children: { props },
            } = args;
            if (props?.children)
              props.children = props.children.replace(
                "(Source)",
                `(${this.settings["betterReadability"].resolution == 0
                  ? "Source"
                  : `${this.settings["betterReadability"].resolution}P`
                })`
              );
          });
        }
        setStreamParameters(Parameters) {
          for (const key in Parameters) {
            Object.defineProperty(ApplicationStreamingOptionStore, key, {
              value: Parameters[key],
              writable: true,
            });
          }
        }
        onStop() {
          this.setStreamParameters(this.defaultParameters);
          Patcher.unpatchAll();
        }
        getSettingsPanel() {
          return SettingPanel.build(
            this.saveSettings.bind(this),
            new SettingGroup("FPS (Зависит от FPS вашего экрана)", {
              collapsible: true,
              shown: false,
            }).append(
              new RadioGroup(
                "15 FPS",
                "Замените 15 FPS на пользовательский FPS.",
                this.settings["fps"][1],
                fpsOptions,
                (e) => {
                  this.settings["fps"][1] = e;
                }
              ),
              new RadioGroup(
                "30 FPS",
                "Замените 30 FPS на пользовательский FPS.",
                this.settings["fps"][2],
                fpsOptions,
                (e) => {
                  this.settings["fps"][2] = e;
                }
              ),
              new RadioGroup(
                "60 FPS",
                "Замените 60 FPS на пользовательский FPS.",
                this.settings["fps"][3],
                fpsOptions,
                (e) => {
                  this.settings["fps"][3] = e;
                }
              )
            ),
            new SettingGroup(
              "Разрешение (зависит от разрешения экрана)",
              {
                collapsible: true,
                shown: false,
              }
            ).append(
              new RadioGroup(
                "480p",
                "Замените 480p на пользовательское разрешение",
                this.settings["resolution"][1],
                resoOptions,
                (e) => {
                  this.settings["resolution"][1] = e;
                }
              ),
              new RadioGroup(
                "720p",
                "Замените 720p на пользовательское разрешение",
                this.settings["resolution"][2],
                resoOptions,
                (e) => {
                  this.settings["resolution"][2] = e;
                }
              ),
              new RadioGroup(
                "1080p",
                "Замените 1080p на пользовательское разрешение",
                this.settings["resolution"][3],
                resoOptions,
                (e) => {
                  this.settings["resolution"][3] = e;
                }
              )
            ),
            new SettingGroup("Предустановленное плавное видео", {
              collapsible: true,
              shown: false,
            }).append(
              new RadioGroup(
                "Разрешение",
                "Изменить предустановленное разрешение для плавного видео",
                this.settings["smoothVideo"]["resolution"],
                resoWithSource,
                (e) => {
                  this.settings["smoothVideo"]["resolution"] = e;
                }
              ),
              new RadioGroup(
                "FPS",
                "Изменить более плавную предустановку FPS для видео",
                this.settings["smoothVideo"]["fps"],
                fpsOptions,
                (e) => {
                  this.settings["smoothVideo"]["fps"] = e;
                }
              )
            ),
            new SettingGroup("Предустановленная лучшая читаемость", {
              collapsible: true,
              shown: false,
            }).append(
              new RadioGroup(
                "Разрешение",
                "Изменить предустановленное разрешение лучшей читаемости",
                this.settings["betterReadability"]["resolution"],
                resoWithSource,
                (e) => {
                  this.settings["betterReadability"]["resolution"] = e;
                }
              ),
              new RadioGroup(
                "FPS",
                "Изменить предустановленное значение FPS лучшей читаемости",
                this.settings["betterReadability"]["fps"],
                fpsOptions,
                (e) => {
                  this.settings["betterReadability"]["fps"] = e;
                }
              )
            )
          );
        }
        saveSettings() {
          Utilities.saveData(config.info.name, "settings", this.settings);
          this.initialize();
        }
      };
    })(ZLibrary.buildPlugin(config));
})();
/*@end@*/
