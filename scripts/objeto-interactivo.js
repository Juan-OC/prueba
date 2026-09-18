/* ============================================================
   objeto-interactivo.js
   Componentes reutilizables para cualquier escena A-Frame:
   1) objeto-interactivo   -> click en el objeto, emite evento
   2) hud-panel            -> panel fijo a cámara, muestra texto+imagen
   3) contorno-interactivo -> contorno (outline) para señalar objetos clicables
   ============================================================ */

/* ---------- 1) OBJETO INTERACTIVO ---------- */
AFRAME.registerComponent('objeto-interactivo', {
  schema: {
    titulo: {type: 'string', default: ''},
    texto: {type: 'string', default: ''},
    imagen: {type: 'string', default: ''}
  },
  init: function () {
    this.el.classList.add('raycastable');
    this.onClick = this.onClick.bind(this);
    this.el.addEventListener('click', this.onClick);
  },
  onClick: function () {
    this.el.sceneEl.emit('hud-toggle', {
      id: this.el.id,
      titulo: this.data.titulo,
      texto: this.data.texto,
      imagen: this.data.imagen
    });
  }
});

/* ---------- 2) PANEL HUD ---------- */
AFRAME.registerComponent('hud-panel', {
  init: function () {
    this.activeId = null;
    this.tituloEl = this.el.querySelector('.hud-titulo');
    this.textoEl  = this.el.querySelector('.hud-texto');
    this.imagenEl = this.el.querySelector('.hud-imagen');

    this.onToggle = this.onToggle.bind(this);
    this.el.sceneEl.addEventListener('hud-toggle', this.onToggle);
  },

  onToggle: function (evt) {
    var data = evt.detail;

    if (this.activeId === data.id) {
      this.ocultar();
      return;
    }
    this.mostrar(data);
  },

  mostrar: function (data) {
    this.activeId = data.id;

    if (this.tituloEl) this.tituloEl.setAttribute('text', 'value', data.titulo || '');
    if (this.textoEl)  this.textoEl.setAttribute('text', 'value', data.texto || '');

    if (this.imagenEl) {
      if (data.imagen) {
        this.imagenEl.setAttribute('visible', true);
        this.imagenEl.setAttribute('material', 'src', data.imagen);
      } else {
        this.imagenEl.setAttribute('visible', false);
      }
    }

    this.el.setAttribute('visible', true);
  },

  ocultar: function () {
    this.activeId = null;
    this.el.setAttribute('visible', false);
  }
});

/* ---------- 3) CONTORNO INTERACTIVO ---------- */
AFRAME.registerComponent('contorno-interactivo', {
  schema: {
    color: {type: 'color', default: '#FFD700'},
    grosor: {type: 'number', default: 1.03}
  },

  init: function () {
    this.outlineRoot = null;
    this.crearContorno = this.crearContorno.bind(this);
    this.el.addEventListener('model-loaded', this.crearContorno);
  },

  crearContorno: function () {
    var mesh = this.el.getObject3D('mesh');
    if (!mesh || this.outlineRoot) return;

    var color = this.data.color;
    var outline = mesh.clone(true);

    outline.traverse(function (nodo) {
      if (nodo.isMesh) {
        nodo.material = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.BackSide
        });
      }
    });

    outline.scale.multiplyScalar(this.data.grosor);
    this.el.object3D.add(outline);
    this.outlineRoot = outline;
  },

  tick: function (time) {
    if (!this.outlineRoot) return;
    var s = this.data.grosor + Math.sin(time / 400) * 0.01;
    this.outlineRoot.scale.set(s, s, s);
  },

  remove: function () {
    if (this.outlineRoot) {
      this.el.object3D.remove(this.outlineRoot);
      this.outlineRoot = null;
    }
  }
});
