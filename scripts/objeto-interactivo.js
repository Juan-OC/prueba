AFRAME.registerComponent('objeto-interactivo', {
  schema: {
    texto: {type: 'string', default: 'Texto de ejemplo'}
  },

  init: function () {
    var el = this.el;
    var data = this.data;

    el.classList.add('raycastable');

    var escalaOriginal = el.getAttribute('scale') || {x: 1, y: 1, z: 1};

    // Recentramos el modelo cuando termine de cargar, para que el
    // pivote de escalado quede en su centro real y no "se mueva" al crecer.
    el.addEventListener('model-loaded', function (e) {
      var mesh = e.detail.model;
      var bbox = new THREE.Box3().setFromObject(mesh);
      var centro = bbox.getCenter(new THREE.Vector3());
      mesh.position.sub(centro);
    });

    el.setAttribute('animation__hover', {
      property: 'scale',
      to: (escalaOriginal.x * 1.2) + ' ' + (escalaOriginal.y * 1.2) + ' ' + (escalaOriginal.z * 1.2),
      dur: 200,
      startEvents: 'mouseenter'
    });
    el.setAttribute('animation__unhover', {
      property: 'scale',
      to: escalaOriginal.x + ' ' + escalaOriginal.y + ' ' + escalaOriginal.z,
      dur: 200,
      startEvents: 'mouseleave'
    });

    el.addEventListener('click', function () {
      var panel = document.querySelector('#panelTexto');
      var textoEl = panel.querySelector('[text]');

      textoEl.setAttribute('text', 'value', data.texto);
      panel.setAttribute('visible', true);
    });
  }
});