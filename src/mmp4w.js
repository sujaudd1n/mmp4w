class MMP4W {
    constructor() {
        this.container = document.querySelector("#mmp4w_container");
        this.event_element = document.body;


        this.playlist = [];

        this.index = 0;

        this.SEEK_TIME = 5;

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
                    handler_function: (e) => { this.play_pause() },
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
            [
                "h",
                {
                    name: "h",
                    description: "Prev",
                    handler_function: this.h_key_event_hander.bind(this),
                    feedback_function: this.h_key_feedback.bind(this),
                },
            ],
            [
                "m",
                {
                    name: "m",
                    description: "Mute",
                    handler_function: this.mute.bind(this),
                    feedback_function: this.mute_feedback.bind(this),
                },
            ],
            [
                "k",
                {
                    name: "k",
                    description: "Volume up",
                    handler_function: this.volume_up.bind(this),
                    feedback_function: this.volume_up_feedback.bind(this),
                },
            ],
            [
                "j",
                {
                    name: "j",
                    description: "Volume down",
                    handler_function: this.volume_down.bind(this),
                    feedback_function: this.volume_down_feedback.bind(this),
                },
            ],
            [
                "r",
                {
                    name: "r",
                    description: "Loop",
                    handler_function: this.loop.bind(this),
                    feedback_function: this.loop_feedback.bind(this),
                },
            ],
            [
                "f",
                {
                    name: "f",
                    description: "Fullscreen",
                    handler_function: this.full_screen.bind(this),
                    feedback_function: this.fullscreen_feedback.bind(this),
                },
            ],
            [
                "o",
                {
                    name: "o",
                    description: "Object fit",
                    handler_function: this.change_fit.bind(this),
                    feedback_function: this.change_fit_feedback.bind(this),
                },
            ],
            [
                "c",
                {
                    name: "c",
                    description: "Show controls",
                    handler_function: this.show_controls.bind(this),
                    feedback_function: this.show_controls_feedback.bind(this),
                },
            ],
        ]);

        this.layout_index = 0;

    }

    // Setup methods
    setup_mmp4w() {
        this.set_media_elements();
        this.set_container_style();
        this.set_video_style();
        this.set_image_style();
        this.set_event_listener();
        this.set_others();
        this.set_feedback_element();
    }
    set_media_elements() {
        this.video_element = document.createElement("video");
        this.video_element.setAttribute("id", "mmp4w_video")
        this.container.appendChild(this.video_element);

        this.image_element = document.createElement("img");
        this.image_element.setAttribute("id", "mmp4w_image")
        this.container.appendChild(this.image_element);
    }
    set_feedback_element() {
        this.feedback_element = document.createElement("div");
        this.feedback_element.textContent = "feedback";
        this.feedback_element.classList.add("feedback_div");
        this.container.appendChild(this.feedback_element);
    }

    set_container_style() {
        this.container.style.margin = 0;
        this.container.style.boxSizing = "border-box";
        this.container.style.position = "relative";
        this.container.setAttribute("tabindex", "0");
        this.container.style.backgroundColor = "#000";
        this.container.focus();
    }

    set_video_style() {
        this.video_element.style.display = "block";
        this.video_element.style.width = "100%";
        this.video_element.style.height = "100%";
        this.video_element.style.objectFit = "scale-down";
        this.video_element.style.objectPosition = "center";
        this.video_element.controls = true;
    }

    set_image_style() {
        this.image_element.style.display = "none";
        this.image_element.style.width = "100%";
        this.image_element.style.height = "100%";
        this.image_element.style.objectFit = "scale-down";
        this.image_element.style.objectPosition = "center";
    }

    set_others() {
        let styles = new CSSStyleSheet();
        document.adoptedStyleSheets = [styles];
    }

    set_playlist(playlist) {
        this.index = 0;
        this.playlist = playlist;
        this.set_source();
    }

    set_source() {
        const url = this.playlist[this.index].url;
        const type = this.get_media_type(url);

        if (type === "video") {
            this.image_element.style.display = "none";
            this.video_element.style.display = "block";
            this.video_element.src = url;
            this.video_element.play();
        } else if (type === "image") {
            this.video_element.style.display = "none";
            this.video_element.pause();
            this.image_element.style.display = "block";
            this.image_element.src = url;
        }
        console.log(document.activeElement);
        this.container.focus();
        console.log(document.activeElement);

        this.preload_media();
    }

    preload_media() {
        for (let i = 1; i < 4; ++i) {
            const url = this.playlist[(this.index + i) % this.playlist.length].url;
            const type = this.get_media_type(url);

            const v = document.createElement("link");
            v.rel = "preload";
            v.href = url;

            if (type === "video") {
                v.as = "video";
            } else {
                v.as = "image";
            }
            document.head.appendChild(v);
        }
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

    set_event_listener() {
        this.event_element.addEventListener("keydown", (e) => { this.handle_all_keydown_events(e) })
        this.video_element.addEventListener("ended", () => {
            this.next({ ctrlKey: false });
        });
    }

    async handle_all_keydown_events(e) {
        if (
            this.valid_events.has(e.key) &&
            document.activeElement.tagName != "INPUT"
        ) {
            const event_description = this.valid_events.get(e.key);
            await event_description.handler_function(e);
            this.give_feedback(e);
        }
    }

    /**
     * Depending on what the user typed it gives a vasual feedback
     * to the uesr.
     * @param {e} Keydown event
     */
    give_feedback(e) {
        if (this.valid_events.get(e.key).feedback_function) {
            const feedback_text = this.valid_events
                .get(e.key)
                .feedback_function(e);
            this.feedback_element.textContent = feedback_text;
            ani.cancel();
            ani.play();
        }
    }

    stop(e) {
        if (e.ctrlKey) return;
        this.video_element.pause();
        this.video_element.currentTime = 0;
    }

    stop_feedback(e) {
        if (e.ctrlKey) return;
        return "Stopped";
    }

    mute() {
        this.video_element.muted = !this.video_element.muted;
    }

    mute_feedback() {
        return this.video_element.muted ? "Muted: true" : "Muted: false";
    }

    loop(e) {
        if (!e.ctrlKey)
            this.video_element.loop = !this.video_element.loop;
    }

    loop_feedback(e) {
        if (!e.ctrlKey)
            return this.video_element.loop ? "Loop: true" : "Loop: false";
    }

    volume_down() {
        this.video_element.volume = Math.max(0, this.video_element.volume - 0.1);
    }

    volume_down_feedback() {
        return Math.round(this.video_element.volume * 10);
    }

    volume_up() {
        this.video_element.volume = Math.min(1, this.video_element.volume + 0.1);
    }

    volume_up_feedback() {
        return Math.round(this.video_element.volume * 10);
    }

    seek_behind() {
        this.video_element.currentTime = Math.max(
            0,
            this.video_element.currentTime - this.SEEK_TIME
        );
    }

    seek_behind_feedback() {
        return Math.round(this.video_element.currentTime);
    }

    seek_front() {
        this.video_element.currentTime = Math.min(
            this.video_element.duration,
            this.video_element.currentTime + this.SEEK_TIME
        );
    }

    seek_front_feedback() {
        return Math.round(this.video_element.currentTime);
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
        this.video_element.controls = !this.video_element.controls;
    }

    show_controls_feedback() {
        return this.video_element.controls ? "Controls: enabled" : "Controls: disabled";
    }

    play_pause(e, feedback) {
        console.log(e, feedback)
        if (this.video_element.ended || this.video_element.paused) this.video_element.play();
        else this.video_element.pause();
    }

    play_pause_feedback() {
        return this.video_element.paused ? "Paused" : "Playing";
    }

    next(e) {
        if (!e.ctrlKey) {
            this.next_playback();
        } else {
            e.preventDefault();
            this.seek_front();
        }
    }
    next_playback() {
        this.index + 1 < this.playlist.length ? this.index++ : (this.index = 0);
        this.set_source();
    }

    next_feedback(e) {
        if (!e.ctrlKey) return "Next";
        else return Math.round(this.video_element.currentTime);
    }

    h_key_event_hander(e) {
        if (!e.ctrlKey) {
            this.previous_play();
        } else {
            e.preventDefault();
            this.seek_behind();
        }
    }

    h_key_feedback(e) {
        if (!e.ctrlKey) return this.previous_play_feedback();
        else return this.seek_behind_feedback();
    }

    previous_play() {
        this.index - 1 > -1
            ? this.index--
            : (this.index = this.playlist.length - 1);
        this.set_source();
    }

    previous_play_feedback() {
        return "Previous";
    }

    seek_behind() {
        this.video_element.currentTime = Math.max(
            0,
            this.video_element.currentTime - this.SEEK_TIME
        );
    }

    seek_behind_feedback() {
        return Math.round(this.video_element.currentTime);
    }

    get_media_element() {
        const type = this.get_media_type();
        if (type === "video") return this.video_element;
        else return this.image_element;
    }
}

const mmp4w = new MMP4W();
mmp4w.setup_mmp4w()

const keyframe = new KeyframeEffect(
    mmp4w.feedback_element,
    [{ opacity: 1 }, { opacity: 0 }],
    {
        duration: 1000,
        fill: "forwards",
    }
);
const ani = new Animation(keyframe, document.timeline);

const feedback_element_style = new CSSStyleSheet();
const feedback_element_style_string = [
    "background: #222226",
    "color: #eee",
    "opacity: 0",
    "text-align: center",
    "padding: 5px",
    "position: absolute",
    "bottom: 40px",
    "right: 10px",
]
feedback_element_style_string.forEach((e) => {
    feedback_element_style.insertRule(`.feedback_div{${e}}`)
})

document.adoptedStyleSheets = [...document.adoptedStyleSheets, feedback_element_style]


export { mmp4w };
