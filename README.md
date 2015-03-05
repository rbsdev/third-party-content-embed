# Third Party Content Embed

Simple workaround to embed third party content inside articles, keeping everything neat and tidy! or in other words, ~~responsive~~ fluid.

It works as a proxy, creating a layer that will resize the content if needed to fit everything inside the available width. All modern browsers are supported and Internet Explorer 9+.

## Usage

Publish all the files within the `dist` project's folder, then add the following code wherever you want to embed something:

```html
<iframe src="path/to/tpce-v0.0.2.html?content=http%3A//example.com/&amp;width=800&amp;height=600"></iframe>
```

Make sure this `iframe` has proper styles to be fluid, otherwise the magic won't happen.

## Paramters

The `tpce-v0.0.2.html` has the following query string parameters:

* `content` url that is intented to be embeded.
* `width` the original width of the content.
* `height` the original height of the content, make sure to also set the same height in the `iframe`.
* `debug` set to true to see useful messages in the console.
