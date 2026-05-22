/**
 * assets/js/toast.js
 * Sistema de notificaciones animadas
 */
export class Toast {
  static #stack = null;

  static #mount() {
    if (this.#stack) return;
    this.#stack = Object.assign(document.createElement('div'), { className: 'toast-stack' });
    document.body.appendChild(this.#stack);
  }

  static show(type, msg) {
    this.#mount();
    const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `<i class="toast-ico fa-solid ${icons[type] ?? icons.info}"></i><span class="toast-txt">${msg}</span>`;
    this.#stack.appendChild(el);
    const dismiss = () => {
      el.classList.add('out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };
    const t = setTimeout(dismiss, 3600);
    el.addEventListener('click', () => { clearTimeout(t); dismiss(); });
  }

  static success(m) { this.show('success', m); }
  static error(m)   { this.show('error',   m); }
  static info(m)    { this.show('info',    m); }
}