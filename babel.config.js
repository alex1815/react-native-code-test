module.exports = function (api) {
  api.cache(true);

  const presets = [ "react-native", "@babel/preset-flow", "@babel/preset-env" ];

  return {
    presets,
  };
}