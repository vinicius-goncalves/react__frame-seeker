export function createDOMVideo(src: string) {
    const v = document.createElement('video');
    v.src = src;
    v.style.display = 'none';
    v.muted = true;
    v.preload = 'auto';
    document.documentElement.appendChild(v);
    return v;
}
