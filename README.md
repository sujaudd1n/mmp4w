# mmp4w

Minimalist media player for web.

## Documentaion

### Setup

- Add a script tag with ```defer``` attribute in ```head``` tag of html document.
```js
<script src="https://cdn.jsdelivr.net/gh/sujaudd1n/mmp4w/assets/scripts/mmp4w.min.js" defer></script>
```
- Add ```mmp4w_container``` as value of ```id``` attribute of video container element.
- Add ```mmp4w_video``` as value of ```id``` attribute of video element.
```html
    <figure id="mmp4w_container">
        <video id="mmp4w_video" controls>
            <source src="./video.mp4" type="video/mp4">
        </video>
   </figure> 
```
- Set width and height for the video container. The inside video element takes full width and height
of its parent.
```css
#mmp4w_container
{
    /* example */
    width: 900px;
    height: 450px;
}
```
The setup is complete.


## CDN link(s)

- **JSDelivr**: <https://cdn.jsdelivr.net/gh/sujaudd1n/mmp4w/assets/scripts/mmp4w.min.js>
