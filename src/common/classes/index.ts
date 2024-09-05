export { AnimationsManager, CustomFrame, Mark, VideoDetails };

const AnimationsManager = function () {
    const animations = [];

    this.add = function add(id) {
        animations.push(id);
    };

    this.stopAll = function stopAll() {
        const promise = new Promise((resolve) => {
            animations.forEach((frame) => cancelAnimationFrame(frame));
            animations.length = 0;
            resolve({ finished: true });
        });

        return promise;
    };
};

const CustomFrame = function (id, blob) {
    this.id = id;
    this.blob = blob;
};

const Mark = function Mark() {
    const tempMarkWrapper = document.createElement('div');
    tempMarkWrapper.classList.add('temp-mark-wrapper');

    const tempMarkWrapperStyle = tempMarkWrapper.style;
    tempMarkWrapperStyle.setProperty('position', 'absolute');

    const tempMarkContent = document.createElement('div');
    tempMarkContent.classList.add('temp-mark-content');

    const img = new Image();
    img.classList.add('mark-curr-image');

    tempMarkContent.appendChild(img);
    tempMarkWrapper.appendChild(tempMarkContent);

    this.contains = function (root) {
        root = root || document.body;

        if (!(root instanceof HTMLElement)) {
            throw new TypeError('The root elements must be a valid DOM element.');
        }

        const bitmaskRes = tempMarkWrapper.compareDocumentPosition(root) & Node.DOCUMENT_POSITION_CONTAINS;

        return bitmaskRes === 8;
    };

    this.updateCoords = function (x, y) {
        const markStyle = tempMarkWrapper.style;

        markStyle.setProperty('left', `${x}px`);
        markStyle.setProperty('top', `${y}px`);

        return tempMarkWrapper;
    };

    this.updateImage = function (src) {
        const element = this.addIntoDOM();
        const imageFound = element.querySelector('.mark-curr-image');
        if (!imageFound) {
            return;
        }

        imageFound.src = src;
    };

    this.addIntoDOM = function () {
        if (this.contains()) {
            return tempMarkWrapper;
        }

        const videoVisualizer = document.querySelector('.video-visualizer');
        videoVisualizer.insertAdjacentElement('afterbegin', tempMarkWrapper);

        return tempMarkWrapper;
    };

    this.remove = function () {
        if (!this.contains()) {
            return;
        }

        tempMarkWrapper.remove();
    };
};

const VideoDetails = function (video) {
    this.id = video.currentTime.toFixed(1);
    this.currentTime = video.currentTime;
    this.currentSrc = video.currentSrc;
};
