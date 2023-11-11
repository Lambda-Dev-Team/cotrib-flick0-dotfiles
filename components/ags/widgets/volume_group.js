import { Widget, App, Audio, Utils, Variable } from "../imports.js";
import { NierButtonGroup, NierButton } from "../nier/buttons.js";
import { NierSliderButton } from "../nier/slider.js";
import { SCREEN_WIDTH, arradd, arrremove } from "../util.js";

const { Window, Label, EventBox, Box, Icon, Revealer } = Widget;
const { execAsync } = Utils;

let volume_slider = ({ volume_ratio = 0, type = "speaker", stream = null }) =>
  NierSliderButton({
    label: stream ? stream.description : type,
    boxes: 20,
    font_size: 30,
    ratio: volume_ratio,
    connections: [
      [
        Audio,
        (self) => {
          volume_ratio.setValue(
            stream ? stream.volume || 0 : Audio[type]?.volume || 0
          );
        },
        `${type}-changed`,
      ],
      [
        volume_ratio,
        (self) => {
          if (
            Math.round(
              stream ? stream.volume || 0 : Audio[type].volume * 100
            ) == Math.round(volume_ratio.value * 100)
          ) {
            return;
          }
          if (stream) {
            stream.volume = volume_ratio.value;
          } else {
            Audio[type].volume = volume_ratio.value;
          }
        },
      ],
    ],
  });

export const VolumeGroup = (
  go_to = async (buttons, parent_button) => {},
  volume_ratio = Variable(0.0, {}),
  mic_volume_ratio = Variable(0.0, {})
) => {
  return [
    Label({ halign: "start", label: "VOLUME", className: ["heading"] }),
    volume_slider({ type: "speaker", volume_ratio: volume_ratio }),
    volume_slider({ type: "microphone", volume_ratio: mic_volume_ratio }),
    NierButton({
      container_style: "padding-top: 40px;",
      label: "Applications",
      font_size: 30,
      valign: "end",
      handleClick: async (self, event) => {
        await go_to(
          [
            Label({ halign: "start", label: "APPS", className: ["heading"] }),
            ...Array.from(Audio.apps).map((stream) => {
              console.log(stream);
              return volume_slider({
                stream: stream,
                volume_ratio: Variable(stream.volume || 0, {}),
              });
            }),
          ],

          self
        );
      },
    }),
    Label({ halign: "start", label: "OUTPUT", className: ["heading"] }),
    ...Array.from(Audio.speakers).map((stream) => {
      console.log(stream);
      return volume_slider({
        stream: stream,
        volume_ratio: Variable(stream.volume || 0, {}),
      });
    }),

    Label({ halign: "start", label: "INPUT", className: ["heading"] }),
    ...Array.from(Audio.microphones).map((stream) => {
      console.log(stream);
      return volume_slider({
        stream: stream,
        volume_ratio: Variable(stream.volume || 0, {}),
      });
    }),
    // Label({ halign: "start", label: "", className: ["heading"] }),
  ];
};