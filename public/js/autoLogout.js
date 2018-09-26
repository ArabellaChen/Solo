class AutoLogout {
      constructor() {
        this.events = ['load', 'mousemove', 'mousedown',
                       'click', 'scroll', 'keypress','mousewheel','touchstart'];

        this.warn = this.warn.bind(this);
        this.logout = this.logout.bind(this);
        this.resetTimeout = this.resetTimeout.bind(this);

        for(var i in this.events) {
          window.addEventListener(this.events[i], this.resetTimeout);
        }

        this.setTimeout();
      }

      clearTimeout() {
        if(this.warnTimeout)
          clearTimeout(this.warnTimeout);

        if(this.logoutTimeout)
          clearTimeout(this.logoutTimeout);
      }

      setTimeout() {
        this.warnTimeout = setTimeout(this.warn, 25 * 60  * 1000);
        this.logoutTimeout = setTimeout(this.logout, 30 * 60 * 1000);
      }

      resetTimeout() {
        this.clearTimeout();
        this.setTimeout();
      }

      warn() {
        console.log('It is going to logout in 5 minute');
      }

      logout() {
        // Send a logout request to the API
        console.log('logout');
        this.destroy();  // Cleanup
        window.location.replace("/logout");
      }

      destroy() {
        this.clearTimeout();

        for(var i in this.events) {
          window.removeEventListener(this.events[i], this.resetTimeout);
        }
      }
}

var timer = new AutoLogout();
