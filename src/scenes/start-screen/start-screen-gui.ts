import { ActionCallback } from "urutora";
import { config } from "../../conf";
import { u } from "../../gui";

export const startScreenGui = (
  options: {
    onStartAction?: ActionCallback;
    onHostAction?: ActionCallback;
    onJoinAction?: ActionCallback;
  } = {}
) => {
  const panel = u.panel({
    tag: "start-screen-gui",
    rows: 7,
    cols: 3,
    // w: config.screenWidth * 1,
    // h: config.screenHeight * 1,
  });
  (panel as any).horizontalScale = 2;
  (panel as any).verticalScale = 2;
  panel.w = config.screenWidth;
  panel.h = config.screenHeight;

  const startButton = u.button({
    tag: "start-button",
    text: "Start",
    // w: 200,
    // h: 30,
  });
  startButton.center();
  startButton.action((e: any) => {
    if (options.onStartAction) {
      options.onStartAction(e);
    }
  });

  const hostButton = u.button({
    tag: "host",
    text: "Host",
    // w: 200,
    // h: 30,
  });
  hostButton.action((e: any) => {
    if (options.onHostAction) {
      options.onHostAction(e);
    }
    hostButton.visible = false;
    hostButton.enabled = false;
    joinButton.visible = false;
    joinButton.enabled = false;
  });
  const joinButton = u.button({
    text: "Join",
    // w: 200,
    // h: 30,
  });
  joinButton.action((e: any) => {
    if (options.onJoinAction) {
      options.onJoinAction(e);
    }
    startButton.disable();
    startButton.text = "Waiting for host";
    hostButton.visible = false;
    hostButton.enabled = false;
    joinButton.visible = false;
    joinButton.enabled = false;
  });
  const text = u.text({
    text: "host",
  });
  const titleLabel = u.label({ text: "Fantastic Shmup" });
  titleLabel.center();
  titleLabel.setStyle({
    font: love.graphics.newFont("/assets/fonts/proggy/ProggyTiny.ttf", 32),
  });
  panel.colspanAt(2, 1, 3);
  panel.addAt(2, 1, titleLabel);
  panel.addAt(3, 2, startButton);
  panel.addAt(4, 2, hostButton);
  panel.addAt(5, 2, joinButton);

  return panel;
};
