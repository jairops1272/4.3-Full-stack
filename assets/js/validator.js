/**
 * assets/js/validator.js
 * Validación de formularios con mensajes inline
 */
export class Validator {

  static #rules = {
    nombre:   [
      [v => v.trim().length > 0,   'El nombre es obligatorio.'],
      [v => v.trim().length >= 2,  'Mínimo 2 caracteres.'],
      [v => v.trim().length <= 80, 'Máximo 80 caracteres.'],
    ],
    apellido: [
      [v => v.trim().length > 0,   'El apellido es obligatorio.'],
      [v => v.trim().length >= 2,  'Mínimo 2 caracteres.'],
      [v => v.trim().length <= 80, 'Máximo 80 caracteres.'],
    ],
    email: [
      [v => v.trim().length > 0,                  'El email es obligatorio.'],
      [v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Formato de email inválido.'],
      [v => v.length <= 120,                        'Máximo 120 caracteres.'],
    ],
    telefono: [
      [v => v.trim().length > 0,             'El teléfono es obligatorio.'],
      [v => /^[\d\s\-+().]{7,20}$/.test(v), 'Teléfono inválido (7–20 caracteres).'],
    ],
  };

  /** Valida el form y pinta errores inline. @returns {boolean} */
  static run(form) {
    this.clear(form);
    let ok = true;
    for (const [field, checks] of Object.entries(this.#rules)) {
      const input = form.querySelector(`[name="${field}"]`);
      const errEl = form.querySelector(`[data-err="${field}"]`);
      if (!input) continue;
      for (const [fn, msg] of checks) {
        if (!fn(input.value)) {
          input.classList.add('has-error');
          if (errEl) { errEl.textContent = msg; errEl.classList.add('show'); }
          ok = false;
          break;
        }
      }
    }
    return ok;
  }

  /** Limpia todos los errores del form */
  static clear(form) {
    form.querySelectorAll('.field-input').forEach(i => i.classList.remove('has-error'));
    form.querySelectorAll('.field-error').forEach(e => { e.classList.remove('show'); e.textContent = ''; });
  }
}