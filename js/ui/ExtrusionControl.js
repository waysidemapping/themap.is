import { state } from "../stateController.js";
import { createElement } from "../utils.js";

export class ExtrusionControl {
  options;
  _map;
  _container;
  _terrainButton;

  constructor(options) {
    this.options = options;
  }
  onAdd(map) {
    this._map = map;
    this._container = createElement('div')
      .setAttribute('class', 'maplibregl-ctrl maplibregl-ctrl-group')
      .append(
        this._terrainButton = createElement('button')
          .setAttribute('class', 'maplibregl-ctrl-terrain')
          .addEventListener('click', this._toggleTerrain)
          .append(
            createElement('span')
              .setAttribute('class', 'maplibregl-ctrl-icon')
              .setAttribute('aria-hidden', 'true')
          )
      );
    this._terrainButton.type = 'button';
    this._terrainButton

    this._updateTerrainIcon();
    this._map.on('terrain', this._updateTerrainIcon);
    return this._container;
  }

  onRemove() {
    document.remove(this._container);
    this._map.off('terrain', this._updateTerrainIcon);
    this._map = undefined;
  }

  _toggleTerrain = () => {
    state.toggle('render3d');
    this._updateTerrainIcon();
  };

  _updateTerrainIcon = () => {
    this._terrainButton.classList.remove('maplibregl-ctrl-terrain');
    this._terrainButton.classList.remove('maplibregl-ctrl-terrain-enabled');
    if (this._map.terrain) {
      this._terrainButton.classList.add('maplibregl-ctrl-terrain-enabled');
      this._terrainButton.title = this._map._getUIString('TerrainControl.Disable');
    } else {
      this._terrainButton.classList.add('maplibregl-ctrl-terrain');
      this._terrainButton.title = this._map._getUIString('TerrainControl.Enable');
    }
  };
}