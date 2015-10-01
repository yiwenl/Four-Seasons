// app.js
window.bongiovi = require("./libs/bongiovi.js");
window.Sono     = require("./libs/sono.min.js");
var dat = require("dat-gui");

window.params = {
	skipCount:3,
	numParticles:128*2,
	windSpeed:.25,
	noiseOffset:.02,
	maxRadius:700
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	}

	var p = App.prototype;

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		document.body.appendChild(this.canvas);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		this.gui = new dat.GUI({width:300});
		this.gui.add(params, "skipCount", 1, 100);
		this.gui.add(params, "windSpeed", 0, 1);
		this.gui.add(params, "noiseOffset", 0.01, 0.05);
		this.gui.add(params, "maxRadius", 500.0, 700.0);
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();