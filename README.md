
# MMP4W

Minimalist media player for web. Control volume, current time, play-pause easily from keyboard. Supports both videos and images.

## CDN

<https://cdn.jsdelivr.net/gh/sujaudd1n/mmp4w/src/mmp4w.min.js>

## Setup

-   Create a container element and set id as `mmp4w_container`.
-   Create a video element and set id as `mmp4w_video`.
-   Create a img element and set id as `mmp4w_image` (even if you won't be using images).

```html
<figure id="mmp4w_container">
    <video id="mmp4w_video"></video>
    <img id="mmp4w_image" />
</figure>
```

-   Set width and height for the container element. Video element takes full width
    and height of its parent.

```css
/* example */
#mmp4w_container {
    width: 900px;
    height: 450px;
}
```

-   Add a script tag with `defer` attribute and `type="module"` in `head` tag of html document.

```js
<script src="./script.js" type="module" defer></script>
```

Inside `script.js` import the `mmp4w` object.

```js
import { mmp4w } from "./src/mmp4w.js";
// or from cdn
//import { mmp4w } from "https://cdn.jsdelivr.net/gh/sujaudd1n/mmp4w/src/mmp4w.min.js";

// Create an array of object. Each object represents a video element.

const videos = [
    { url: "<videourl>" },
    { url: "<videourl>" },
    { url: "<videourl>" },
    { url: "<videourl>" },
];

mmp4w.set_playlist(videos);
```

The setup is complete.

## Keybindings

-   `p` - Play/pause the video.
-   `s` - Stop the video.
-   `m` - Mute.
-   `k` - Volume up.
-   `j` - Volume down.
-   `r` - Enable loop.
-   `h` - Previous.
-   `l` - Next.
-   `ctrl-h` - Seek behind.
-   `ctrl-l` - Seek front.
-   `f` - Fullscreen.
-   `o` - Chage video fit.
-   `c` - Show/hide video controls.
