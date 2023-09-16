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

        /**
         * valid_event contains all the keys whose keydown event is
         * handled. It maps from key to an object which contains
         * information about the actions and description of what to
         * do when the event is fired.
         */
        this.valid_events = new Map([
            [
                "p",
                {
                    name: "p",
                    description: "Play or pause",
                    handler_function: this.play_pause.bind(this),
                    feedback_function: this.play_pause_feedback.bind(this),
                },
            ],
            [
                "s",
                {
                    name: "s",
                    description: "Stop",
                    handler_function: this.stop.bind(this),
                    feedback_function: this.stop_feedback.bind(this),
                },
            ],
            [
                "l",
                {
                    name: "l",
                    description: "Next",
                    handler_function: this.next.bind(this),
                    feedback_function: this.next_feedback.bind(this),
                },
            ],
        ]);

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
        this.feedback_element.style.opacity = "0";
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
        console.log(document.activeElement);
        this.container.focus();
        console.log(document.activeElement);
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

    /**
     * Depending on what the user typed it gives a vasual feedback
     * to the uesr.
     * @param {event} e Keydown event
     */
    give_feedback(e) {
        const feedback_text = this.valid_events.get(e.key).feedback_function();
        this.feedback_element.textContent = feedback_text;
        ani.cancel();
        ani.play();
    }

    stop() {
        this.video.pause();
        this.video.currentTime = 0;
    }
    stop_feedback(e) {
        return "Stopped";
    }
    mute_feedback() {
        return this.video.muted ? "Muted: true" : "Muted: false";
    }
    mute() {
        this.video.muted = !this.video.muted;
    }

    loop_feedback() {
        return this.video.loop ? "Loop: true" : "Loop: false";
    }
    volume_down() {
        this.video.volume = Math.max(0, this.video.volume - 0.1);
    }
    volume_down_feedback() {
        return Math.round(this.video.volume * 10);
    }
    volume_up() {
        this.video.volume = Math.min(1, this.video.volume + 0.1);
    }
    volume_up_feedback() {
        return Math.round(this.video.volume * 10);
    }
    seek_behind() {
        this.video.currentTime = Math.max(
            0,
            this.video.currentTime - this.SEEK_TIME
        );
    }

    seek_behind_feedback() {
        return Math.round(this.video.currentTime);
    }
    seek_front() {
        this.video.currentTime = Math.min(
            this.video.duration,
            this.video.currentTime + this.SEEK_TIME
        );
    }

    seek_front_feedback() {
        return Math.round(this.video.currentTime);
    }
    async full_screen() {
        if (!document.fullscreenElement) {
            await this.container.requestFullscreen();
        } else {
            await document.exitFullscreen();
        }
    }

    fullscreen_feedback() {
        return document.fullscreenElement
            ? "Fullscreed: enabled"
            : "Fullscreen: disabled";
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
    change_fit_feedback() {
        return this.get_media_element().style.objectFit;
    }
    show_controls() {
        this.video.controls = !this.video.controls;
    }

    show_controls_feedback() {
        return this.video.controls ? "Controls: enabled" : "Controls: disabled";
    }
    previous() {
        this.index - 1 > -1
            ? this.index--
            : (this.index = this.playlist.length - 1);
        this.set_source();
    }

    prev_feedback() {
        return "Previous";
    }
    play_pause() {
        console.log(this.video);
        if (this.video.ended || this.video.paused) this.video.play();
        else this.video.pause();
    }

    play_pause_feedback() {
        return this.video.paused ? "Paused" : "Playing";
    }
    next(isctrl) {
        if (!isctrl) {
            this.index + 1 < this.playlist.length
                ? this.index++
                : (this.index = 0);
            console.log("ide", this.index);
            this.set_source();
        } else {
            this.seek_front();
        }
    }

    next_feedback(isctrl) {
        console.log(isctrl);
        let status;
        if (!isctrl) status = "Next";
        else status = Math.round(this.video.currentTime);
    }

    set_event_listener() {
        this.container.addEventListener("keydown", async (e) => {
            if (this.valid_events.has(e.key)) {
                if (e.ctrlKey) e.preventDefault();

                this.valid_events.get(e.key).handler_function(e.ctrlKey);
                this.give_feedback(e);
            }
        });
    }

    get_media_element() {
        const type = this.get_media_type();
        if (type === "video") return this.video;
        else return this.image;
    }
}

const mmp4w = new MMP4W();

const keyframe = new KeyframeEffect(
    mmp4w.feedback_element,
    [{ opacity: 1 }, { opacity: 0 }],
    {
        duration: 1000,
        fill: "forwards",
    }
);

const ani = new Animation(keyframe, document.timeline);

export { mmp4w };
