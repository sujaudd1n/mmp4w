// Minimalist Media Player for web

class MMP4W {
  constructor() {
    this.container = document.querySelector("#mmp4w_container");
    this.video = document.querySelector("#mmp4w_video");

    this.SEEK_TIME = 5;

    this.KEY_PLAY_PAUSE = "p";
    this.STOP = "s";
    this.MUTE = "m";
    this.VOLUME_UP = "k";
    this.VOLUME_DOWN = "j";
    this.SEEK_BEHIND = "h";
    this.SEEK_FRONT = "l";
    this.FULL_SCREEN = "f";
    this.CHANGE_FIT = "o";
    this.SHOW_INFO = "i";
    this.SHOW_CONTROLS = "c";

    this.layout_index = 0;

    this.set_container_style();
    this.set_video_style();
    this.set_event_listener();
  }

  set_container_style() {
    this.container.style.margin = 0;
    this.container.style.boxSizing = "border-box";
    this.container.style.position = "relative";
    // this.container.style.border = "2px solid red";
    this.container.style.backgroundColor = "#111111";
  }

  set_video_style() {
    this.video.style.display = "block";
    this.video.style.width = "100%";
    this.video.style.height = "100%";
    this.video.style.objectFit = "scale-down";
    this.video.style.objectPosition = "center";
    this.video.controls = false;
  }

  set_event_listener() {
    document.addEventListener("keydown", (e) => {
      if (e.key === this.KEY_PLAY_PAUSE) {
        this.play_pause();
      } else if (e.key === this.STOP) {
        this.stop();
      } else if (e.key === this.MUTE) {
        this.mute();
      } else if (e.key === this.VOLUME_UP) {
        this.volume_up();
      } else if (e.key === this.VOLUME_DOWN) {
        this.volume_down();
      } else if (e.key === this.SEEK_BEHIND) {
        this.seek_behind();
      } else if (e.key === this.SEEK_FRONT) {
        this.seek_front();
      } else if (e.key === this.FULL_SCREEN) {
        this.full_screen();
      } else if (e.key === this.CHANGE_FIT) {
        this.change_fit();
      } else if (e.key === this.SHOW_INFO) {
        this.show_info();
      } else if (e.key === this.SHOW_CONTROLS) {
        this.show_controls();
      }
    });
  }

  show_controls() {
    this.video.controls = !this.video.controls;
  }

  play_pause() {
    if (this.video.ended || this.video.paused) this.video.play();
    else this.video.pause();
  }

  stop() {
    this.video.pause();
    this.video.currentTime = 0;
  }

  mute() {
    this.video.muted = !this.video.muted;
  }

  volume_up() {
    this.video.volume = Math.min(1, this.video.volume + 0.1);
  }

  volume_down() {
    this.video.volume = Math.max(0, this.video.volume - 0.1);
  }

  seek_behind() {
    this.video.currentTime = Math.max(
      0,
      this.video.currentTime - this.SEEK_TIME
    );
  }

  seek_front() {
    this.video.currentTime = Math.min(
      this.video.duration,
      this.video.currentTime + this.SEEK_TIME
    );
  }

  full_screen() {
    if (!document.fullscreenElement) {
      this.container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  change_fit() {
    const layout = ["contain", "cover", "none", "scale-down"];
    this.layout_index + 1 >= layout.length
      ? (this.layout_index = 0)
      : this.layout_index++;
    this.video.style.objectFit = layout[this.layout_index];
  }

  get_info_element() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    const box_width = (width * 10) / 100;
    const box_height = (height * 10) / 100;
    const blur = box_width;
    const shadow = `inset 0 -${box_height}px #ffffff33`;
    console.log(shadow);
    const info = document.createElement("div");
    info.style.boxShadow = shadow;
    info.style.position = "absolute";
    info.style.bottom = "0";
    info.style.left = "0";
    info.style.right = "0";
    info.style.opacity = 0;
    info.style.height = "50px";
    info.style.transition = "opacity 100ms linear";
    info.style.fontSize = "30px";
    info.style.textAlign = "center";

    info.textContent = `${Math.floor(
      (this.video.currentTime / this.video.duration) * 100
    )} %`;
    return info;
  }

  async show_info() {
    // if (this.container.children.length >= 2) return;

    const info = this.get_info_element();
    this.container.appendChild(info);
    info.style.opacity = 1;
    this.video.addEventListener("timeupdate", (e) => {
      info.textContent = `${Math.floor(
        (this.video.currentTime / this.video.duration) * 100
      )} %`;
    });
    await new Promise((r) => setTimeout(r, 2500));

    info.style.opacity = 0;
    await new Promise((r) => setTimeout(r, 100));

    info.remove();
  }
}

const player = new MMP4W();
