# Startpage #

A custom startpage I made for myself.

It downloads the most recent image for a twitter account, (I chose Archillect as an example, it's a really cool bot that posts and finds images based on social media response). It then grabs the two dominant colors from the image via the ColorThief npm module and styles the page with it.

Here's an [animated example](https://gyazo.com/102265021521cdc1bcc4596cc5983abb) of it in action. It's really low quality but it shows the general idea.

As for the title text, it was a fun little experiment with canvas. It takes in a few font styles and does some interesting things with them.

```jsx
<TextCanvas
  text={"Hello world"}  // Can be anything, e.g. a clock
  padding={10}
  interval={150}        // Time between changes
  fontStyle {
    size: 34,
    font: "Droid Sans", // Uses Google fonts and downloads it on the fly
    style: ["bold"],    // bold and or italic
    stroke: 6,          // The text stroke
    segments: 5,        // How many sections to split the extrusion gradient in
    thickness: 10,      // How thick each segment will be
  }
  src={this.state.src}  // Source of the image/video
  isVideo={this.state.isVideo}
/>
```

Take a look here if you're interested in seeing the inner workings of the [TextCanvas](https://github.com/alexharri/startpage/blob/master/src/js/components/TextCanvas.js) component.

It also features a fun little custom search bar I made. It has a few different modes which search different websites.
* !g for Google  
* !r for Reddit  
* !y for YouTube  
* etc

And then in each one you have some commands to customize the search. For example when in Google you have the option to pick a few commands.  
* -i to search for images  
* -m to search Google Maps  
* -n for News

The searchbar is far less complete and sophisticated than the text canvas, but when I find the time this is \#1 on the list of things to fix

Here are some examples of how it looks live

![alt tag](https://raw.githubusercontent.com/alexharri/startpage/master/examples/example-1.jpg)
![alt tag](https://raw.githubusercontent.com/alexharri/startpage/master/examples/example-2.jpg)
![alt tag](https://raw.githubusercontent.com/alexharri/startpage/master/examples/example-3.jpg)
![alt tag](https://raw.githubusercontent.com/alexharri/startpage/master/examples/example-4.jpg)
![alt tag](https://raw.githubusercontent.com/alexharri/startpage/master/examples/example-5.jpg)
