class MMP4W {
    constructor() {
        this.container = document.querySelector("#mmp4w_container");
        this.video = document.querySelector("#mmp4w_video");
        this.image = document.querySelector("#mmp4w_image") || undefined;

        this.playlist = [];

        this.index = 0;

        this.SEEK_TIME = 5;

        this.KEY_PLAY_PAUSE = "p";
        this.STOP = "s";
        this.MUTE = "m";
        this.VOLUME_UP = "k";
        this.VOLUME_DOWN = "j";
        this.LOOP = "r";
        this.SEEK_BEHIND = "h";
        this.SEEK_FRONT = "l";
        this.FULL_SCREEN = "f";
        this.CHANGE_FIT = "o";
        this.SHOW_INFO = "i";
        this.SHOW_CONTROLS = "c";
        this.NEXT = "l";
        this.PREV = "h";

        this.layout_index = 0;

        this.set_container_style();
        this.set_video_style();
        this.set_image_style();
        this.set_event_listener();
        this.set_others();

        this.feedback_element = document.createElement("div");
        this.feedback_element.textContent = "feedback";
        this.feedback_element.classList.add("feedback_div");
        this.feedback_element.style.background = "#fff";
        this.feedback_element.style.position = "absolute";
        this.feedback_element.style.top = "0";
        this.feedback_element.style.left = "0";
        this.feedback_element.style.right = "0";
        this.container.appendChild(this.feedback_element);
    }

    set_container_style() {
        this.container.style.margin = 0;
        this.container.style.boxSizing = "border-box";
        this.container.style.position = "relative";
        this.container.setAttribute("tabindex", "0");
        this.container.style.backgroundColor = "#222226";
        this.container.focus();
    }

    set_video_style() {
        this.video.style.display = "block";
        this.video.style.width = "100%";
        this.video.style.height = "100%";
        this.video.style.objectFit = "scale-down";
        this.video.style.objectPosition = "center";
        this.video.controls = true;
    }

    set_image_style() {
        this.image.style.display = "none";
        this.image.style.width = "100%";
        this.image.style.height = "100%";
        this.image.style.objectFit = "scale-down";
        this.image.style.objectPosition = "center";
    }

    set_others() {
        let styles = new CSSStyleSheet();
        document.adoptedStyleSheets = [styles];
    }

    set_playlist(data) {
        this.index = 0;
        this.playlist = data;
        this.set_source();
    }

    set_source() {
        const url = this.playlist[this.index].url;
        const type = this.get_media_type(url);

        if (type === "video") {
            this.image.style.display = "none";
            this.video.style.display = "block";
            this.video.src = url;
            this.video.play();
        } else if (type === "image") {
            this.video.style.display = "none";
            this.video.pause();
            this.image.style.display = "block";
            this.image.src = url;
        }
        console.log(document.activeElement)
        this.container.focus();
        console.log(document.activeElement)
    }

    get_media_type(url = this.playlist[this.index].url) {
        if (
            url.endsWith(".jpg") ||
            url.endsWith(".jpeg") ||
            url.endsWith(".png") ||
            url.endsWith(".webp") ||
            url.endsWith(".gif")
        )
            return "image";
        else if (
            url.endsWith(".webm") ||
            url.endsWith(".mp4") ||
            url.endsWith(".mkv") ||
            url.endsWith(".avi")
        )
            return "video";
        else return "unknown";
    }

    get_playlist() {
        return this.playlist;
    }

    give_feedback(text) {
        this.feedback_element.textContent = text;
    }

    set_event_listener() {
        this.container.addEventListener("keydown", (e) => {
            console.log(e);
            if (e.key === this.KEY_PLAY_PAUSE) {
                this.play_pause();
                this.give_feedback(this.video.paused);
                ani.cancel();
                ani.play();
            } else if (e.key === this.STOP) {
                this.stop();
            } else if (e.key === this.MUTE) {
                this.mute();
            } else if (e.key === this.VOLUME_UP) {
                this.volume_up();
            } else if (e.key === this.LOOP) {
                this.video.loop = !this.video.loop;
            } else if (e.key === this.VOLUME_DOWN) {
                this.volume_down();
            } else if (e.key === this.SEEK_BEHIND && e.ctrlKey) {
                e.preventDefault();
                this.seek_behind();
            } else if (e.key === this.SEEK_FRONT && e.ctrlKey) {
                e.preventDefault();
                this.seek_front();
            } else if (e.key === this.FULL_SCREEN) {
                this.full_screen();
            } else if (e.key === this.CHANGE_FIT) {
                this.change_fit();
            } else if (e.key === this.SHOW_CONTROLS) {
                this.show_controls();
            } else if (e.key === this.NEXT) {
                this.next();
            } else if (e.key === this.PREV) {
                this.previous();
            }
        });
        console.log("done event");
    }

    next() {
        this.index + 1 < this.playlist.length ? this.index++ : (this.index = 0);
        console.log("ide", this.index);
        this.set_source();
    }

    previous() {
        this.index - 1 > -1
            ? this.index--
            : (this.index = this.playlist.length - 1);
        this.set_source();
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

    get_media_element() {
        const type = this.get_media_type();
        if (type === "video") return this.video;
        else return this.image;
    }

    change_fit() {
        const layout = ["contain", "cover", "none", "scale-down"];
        const media_element = this.get_media_element();
        console.log(media_element);
        this.layout_index + 1 >= layout.length
            ? (this.layout_index = 0)
            : this.layout_index++;
        media_element.style.objectFit = layout[this.layout_index];
    }
}

const mmp4w = new MMP4W();

const keyframe = new KeyframeEffect(
    mmp4w.feedback_element,
    [{ opacity: 1 }, { opacity: 0, display: "none" }],
    {
        duration: 1000,
        fill: "forwards",
    }
);

const ani = new Animation(keyframe, document.timeline);

export { mmp4w };