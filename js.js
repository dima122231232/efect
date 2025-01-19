const index = window.innerWidth / 100 + window.innerHeight / 100;
let isAnimating = true;

function updateBlur() {
    var width = window.innerWidth, blurValue = Math.max(15, width / 40);
    document.getElementById('blur-effect').setAttribute('stdDeviation', blurValue);
}
window.addEventListener('resize', updateBlur);
window.addEventListener('load', updateBlur);

const circless = document.querySelectorAll('.circle');
function getRandomScale() { return 1 + Math.random() * 1; }
function getRandomMargin() { return (Math.random() - 0.5) * index * 35; }
circless.forEach((circle, index) => {
    function animate() {
        gsap.to(circle, { scale: getRandomScale(), marginRight: getRandomMargin() + "px", marginTop: getRandomMargin() + "px", duration: 1 + index * 0.1, repeat: 0, ease: "power1.inOut", onComplete: animate });
    }
    animate();
});

document.addEventListener('mousemove', function (event) {
    const cursor = document.getElementById('cursor');
    cursor.style.left = `${event.pageX}px`;
    cursor.style.top = `${event.pageY}px`;
});

const circles = [
    { circle: document.querySelector('.circle1'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle2'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle3'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle4'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle5'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle6'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle7'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle8'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle9'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
    { circle: document.querySelector('.circle10'), flag: true, cord: null, distancex: 0, distancey: 0, plusKvadro: 0, canUpdatePlusKvadro: true },
];

let speed = .75;
let cursorX = 0,
    cursorY = 0;

const moveCircleAway = (e, circleData) => {
    const { circle, cord } = circleData;
    const centerX = e.clientX;
    const centerY = e.clientY;

    const offsetX = circle.getBoundingClientRect().left + circle.offsetWidth / 2 - centerX;
    const offsetY = circle.getBoundingClientRect().top + circle.offsetHeight / 2 - centerY;
    const angle = Math.atan2(offsetY, offsetX);

    circleData.distancex += (centerX - cord.clientX);
    circleData.distancey += (centerY - cord.clientY);

    const screenWidth = window.innerWidth;
    const limit = screenWidth < 991 ? index * 50 : index * 35;
    circleData.distancex = Math.max(-limit, Math.min(limit, circleData.distancex));
    circleData.distancey = Math.max(-limit, Math.min(limit, circleData.distancey));

    circleData.plusKvadro = 0;

    gsap.to(circle, {
        duration: speed,
        x: circleData.distancex,
        y: circleData.distancey,
        ease: 'linear',
    });
};

let canUpdatePlusKvadro = true;

const returnCircle = (circleData) => {
    const { circle } = circleData;

    ['distancex', 'distancey'].forEach((axis) => {
        if (Math.abs(circleData[axis]) <= index) {
            circleData[axis] = 0;
        } else {
            circleData[axis] += circleData[axis] > 0
                ? -index * circleData.plusKvadro
                : index * circleData.plusKvadro;

            if (circleData.canUpdatePlusKvadro) {
                circleData.plusKvadro += 0.025;
                circleData.canUpdatePlusKvadro = false;
                setTimeout(() => {
                    circleData.canUpdatePlusKvadro = true;
                }, 100);
            }
        }
    });

    gsap.to(circle, {
        duration: speed,
        x: circleData.distancex,
        y: circleData.distancey,
        ease: 'none',
    });
};

let oo = true;

const checkCursorInsideAnyCircle = (e) => {
    let cursorOnCircles = [];
    circles.forEach(({ circle }, index) => {
        const rect = circle.getBoundingClientRect();
        const cursorRect = document.getElementById('cur').getBoundingClientRect();
        const isCursorInside =
            cursorRect.right >= rect.left &&
            cursorRect.left <= rect.right &&
            cursorRect.bottom >= rect.top &&
            cursorRect.top <= rect.bottom;

        if (isCursorInside && oo) {
            cursorOnCircles.push(index);
        }
    });

    return cursorOnCircles;
};

const checkCursorInRed = (e) => {
    let cursorOnCirclesRed = [];
    circles.forEach(({ circle }, index) => {
        const rect = circle.getBoundingClientRect();
        const cursorRect2 = document.getElementById('cursor').getBoundingClientRect();
        const isCursorInside2 =
            cursorRect2.right >= rect.left &&
            cursorRect2.left <= rect.right &&
            cursorRect2.bottom >= rect.top &&
            cursorRect2.top <= rect.bottom;

        if (isCursorInside2 && oo) {
            cursorOnCirclesRed.push(index);
        }
    });

    return cursorOnCirclesRed;
};

let moveTimeout;

document.addEventListener('mousemove', (e) => {
    clearTimeout(moveTimeout);
    oo = true;
    if (!navigator.platform.toUpperCase().includes('MAC')) {
        moveTimeout = setTimeout(() => {
            oo = false;
        }, 10);
    }
    const cursor = document.getElementById('cursor');
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
});

document.addEventListener('touchmove', (e) => {
    oo = true;
    e.preventDefault();
    const cursor = document.getElementById('cursor');
    cursorX = e.touches[0].clientX;
    cursorY = e.touches[0].clientY;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
}, { passive: false });

document.addEventListener('touchend', () => {
  oo = false;
});

document.body.style.overflowX = 'hidden';

setInterval(() => {
    const e = { clientX: cursorX, clientY: cursorY };
    const cursorOnCircles = checkCursorInsideAnyCircle(e);
    const checkCursorInRed2 = checkCursorInRed(e);
    circles.forEach((circleData, index) => {
        const { circle, flag, cord } = circleData;

        const rect = circle.getBoundingClientRect();
        const cursorNearby = (
            e.clientX >= rect.left - index * 1 && e.clientX <= rect.right + index * 1 &&
            e.clientY >= rect.top - index * 1 && e.clientY <= rect.bottom + index * 1
        );

        if (cursorOnCircles.includes(index)) {
            if (flag && oo) {
                circleData.cord = { clientX: e.clientX, clientY: e.clientY };
                circleData.flag = false;
                moveCircleAway(e, circleData);
            } else if (cord && oo) {
                moveCircleAway(e, circleData);
            }
        } else if (cursorNearby && oo) {
            circleData.cord = { clientX: e.clientX, clientY: e.clientY };
            circleData.flag = false;
            moveCircleAway(e, circleData);
        } else {
            circleData.flag = true;
            circleData.cord = null;
            const screenWidth = window.innerWidth;
            if (screenWidth < 911) {
                returnCircle(circleData);
            } else {
                if (checkCursorInRed2.includes(index)) {
                    // No action for this condition
                } else {
                    returnCircle(circleData);
                }
            }
        }
    });
}, 1);
