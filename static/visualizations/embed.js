// Tells the blog post how tall this page is, so its iframe can fit it without an inner scrollbar.
(() => {
    if (window.parent === window) return;
    // body, not documentElement: documentElement.scrollHeight never drops below the iframe's own height
    const send = () => parent.postMessage({ algoDemoHeight: Math.ceil(document.body.getBoundingClientRect().height) }, "*");
    new ResizeObserver(send).observe(document.body);
    window.addEventListener("load", send);
})();
