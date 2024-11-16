import * as urutora from "urutora";
import { Urutora } from "urutora";

export const u: Urutora = urutora.build();
urutora.utils.style = {
  ...urutora.utils.style,
  ...{
    outline: true,
    lineStyle: "rough",
    cornerRadius: 0.1, // percent
    lineWidth: 1,

    bgColor: love.math.colorFromBytes(203, 196, 180),
    fgColor: love.math.colorFromBytes(203, 196, 180),
    hoverBgColor: love.math.colorFromBytes(176, 82, 80),
    pressedFgColor: love.math.colorFromBytes(176, 82, 80),
    pressedBgColor: love.math.colorFromBytes(176, 82, 80),
    // disableFgColor: [0.5, 0.5, 0.5],
  },
};
