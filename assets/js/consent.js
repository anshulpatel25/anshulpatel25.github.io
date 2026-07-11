window.cookieconsent.initialise({
  palette: {
    popup: {
      background: "#eaf7f7",
      text: "#5c7291",
    },
    button: {
      background: "#56cbdb",
      text: "#ffffff",
    },
  },
  theme: "edgeless",
  type: "opt-in",
  content: {
    message: "By clicking accept, you confirm you are 18 or older and consent to basic traffic analytics.",
    allow: "Accept",
    deny: "Reject",
    href: "/privacy/",
    policy: "Privacy Policy"
  },
  revokeBtn: '<div class="cc-revoke {{classes}}" style="cursor: pointer; width: 48px; height: 48px; border-radius: 50%; display: flex; justify-content: center; align-items: center; background: #eaf7f7; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 0; box-sizing: border-box;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 24px; height: 24px; fill: #5c7291;"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM152.4 179.9c10.7-33 46.5-51 79.5-40.3s51 46.5 40.3 79.5c-10.7 33-46.5 51-79.5 40.3s-51-46.5-40.3-79.5zM327.8 332c13.5-26.6 46.1-37.3 72.8-23.8s37.3 46.1 23.8 72.8c-13.5 26.6-46.1 37.3-72.8 23.8s-37.3-46.1-23.8-72.8zM194 372.2c16.3-21.7 47.1-26.1 68.8-9.8s26.1 47.1 9.8 68.8c-16.3 21.7-47.1 26.1-68.8 9.8s-26.1-47.1-9.8-68.8zM358.5 161.4c21.8-16.1 52.6-11.5 68.8 10.3s11.5 52.6-10.3 68.8c-21.8 16.1-52.6 11.5-68.8-10.3s-11.5-52.6 10.3-68.8z"/></svg></div>',
  animateRevokable: false,
  onInitialise: function (status) {
    var type = this.options.type;
    var didConsent = this.hasConsented();
    if (type == 'opt-in' && didConsent) {
      if (typeof window.loadGTM === 'function') {
        window.loadGTM();
      }
    }
  },
  onStatusChange: function(status, chosenBefore) {
    var type = this.options.type;
    var didConsent = this.hasConsented();
    if (type == 'opt-in' && didConsent) {
      if (typeof window.loadGTM === 'function') {
        window.loadGTM();
      }
    } else {
      // User rejected, we can optionally reload to clear scripts, or simply rely on not calling loadGTM anymore.
      // But GTM might have already loaded if they previously accepted, so we might want to clear cookies or reload.
      // Reloading is a simple way to guarantee GTM stops.
      if (chosenBefore && status === 'deny') {
         window.location.reload();
      }
    }
  }
});
