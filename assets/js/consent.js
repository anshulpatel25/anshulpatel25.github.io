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
  revokeBtn: '<div class="cc-revoke {{classes}}" style="cursor: pointer; font-size: 24px; border-radius: 50%; padding: 10px; background: #eaf7f7; color: #5c7291; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"><i class="fa fa-cookie" aria-hidden="true"></i></div>',
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
