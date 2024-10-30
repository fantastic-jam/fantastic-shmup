export const config = {
  screenWidth: 400,
  screenHeight: 240,
};

love.conf = (config) => {
  config.identity = "data/saves";
  config.window.width = 1600;
  config.window.height = 960;
  config.window.title = "fantastic shmup";
  config.window.vsync = 1;
};
