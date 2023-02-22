// Minimalist Media Player for web

class MMP4W {
  constructor() {
    this.container = document.querySelector("#mmp4w_container");
    this.video = document.querySelector("#mmp4w_video");
    this.SEEK_TIME = 5;
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
      if (e.key === "p") {
        this.play_pause();
      } else if (e.key === "s") {
        this.stop();
      } else if (e.key === "m") {
        this.mute();
      } else if (e.key === "k") {
        this.volume_up();
      } else if (e.key === "j") {
        this.volume_down();
      } else if (e.key === "h") {
        this.seek_behind();
      } else if (e.key === "l") {
        this.seek_front();
      } else if (e.key === "f") {
        this.full_screen();
      } else if (e.key === "a") {
        this.change_vide_layout();
      }
    });
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

  change_vide_layout() {
    const layout = ["contain", "cover", "none", "scale-down"];
    this.layout_index + 1 >= layout.length
      ? (this.layout_index = 0)
      : this.layout_index++;
    this.video.style.objectFit = layout[this.layout_index];
  }
}

const player = new MMP4W();
