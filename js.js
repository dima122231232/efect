const index = window.innerWidth / 100 + window.innerHeight / 100;

function updateBlur() {
    var width = window.innerWidth;
    var blurValue = Math.max(15, width / 40);
    document.getElementById('blur-effect').setAttribute('stdDeviation', blurValue);
}
window.addEventListener('resize', updateBlur);
window.addEventListener('load', updateBlur);

const circless = document.querySelectorAll('.circle');
function getRandomPosition() {
    return (Math.random() - 0.5) * 6 * index;
}
function getRandomScale() {
    return 1 + Math.random() * 1.5;
}
circless.forEach((circle, index) => {
    const innerDiv = circle.querySelector('div');

    function animate() {
        gsap.to(innerDiv, {
            x: getRandomPosition(),
            y: getRandomPosition(),
            duration: 1.5 + index * 0.1,
            repeat: 0,
            ease: "power1.inOut",
            onComplete: animate
        });

        gsap.to(circle, {
            scale: getRandomScale(),
            duration: 1.5 + index * 0.1,
            repeat: 0,
            ease: "power1.inOut"
        });
    }

    animate();
});

document.addEventListener('mousemove', function (event) {
    const cursor = document.getElementById('cursor');
    cursor.style.left = `${event.pageX}px`;
    cursor.style.top = `${event.pageY}px`;
});

const circles = [
    { circle: document.querySelector('.circle1'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle2'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle3'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle4'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle5'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle6'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle7'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle8'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle9'), flag: true, cord: null, distancex: 0, distancey: 0 },
    { circle: document.querySelector('.circle10'), flag: true, cord: null, distancex: 0, distancey: 0 },
];

let speed = 1.5;
let cursorX = 0,
    cursorY = 0;

const moveCircleAway = (e, circleData) => {
    const { circle, cord } = circleData;
    const centerX = e.clientX;
    const centerY = e.clientY;

    const offsetX = circle.getBoundingClientRect().left + circle.offsetWidth / 2 - centerX;
    const offsetY = circle.getBoundingClientRect().top + circle.offsetHeight / 2 - centerY;
    const angle = Math.atan2(offsetY, offsetX);

    if (Math.cos(angle) > 0.5) {
        circleData.distancex += centerX - cord.clientX;
        circleData.distancey -= index * 0.8;
    } else {
        circleData.distancex += centerX - cord.clientX;
        circleData.distancey += index * 0.2;
    }

    if (Math.sin(angle) > 0.5) {
        circleData.distancey += centerY - cord.clientY;
        circleData.distancex -= index * 0.8;
    } else {
        circleData.distancey += centerY - cord.clientY;
        circleData.distancex -= index * 0.2;
    }
    const screenWidth = window.innerWidth;
    const limit = screenWidth < 991 ? index * 85 : index * 65;
    circleData.distancex = Math.max(-limit, Math.min(limit, circleData.distancex));
    circleData.distancey = Math.max(-limit, Math.min(limit, circleData.distancey));

    gsap.to(circle, {
        duration: speed,
        x: circleData.distancex,
        y: circleData.distancey,
        ease: 'linear',
    });
};

const returnCircle = (circleData) => {
    const { circle } = circleData;

    if (circleData.distancex > 0) {
        circleData.distancex -= index * 0.8;
    } else if (circleData.distancex < 0) {
        circleData.distancex += index * 0.8;
    }
    if (circleData.distancey > 0) {
        circleData.distancey -= index * 0.8;
    } else if (circleData.distancey < 0) {
        circleData.distancey += index * 0.8;
    }

    gsap.to(circle, {
        duration: speed,
        x: circleData.distancex,
        y: circleData.distancey,
        ease: 'linear'
    });
};
let oo = true;
const checkCursorInsideAnyCircle = (e) => {
    let cursorOnCircles = [];
    circles.forEach(({ circle }, index) => {
        const rect = circle.getBoundingClientRect();
        const cursorRect = document.getElementById('cursor').getBoundingClientRect();

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

let moveTimeout;

document.addEventListener('mousemove', (e) => {
    clearTimeout(moveTimeout);
    oo = true;
    moveTimeout = setTimeout(() => {
        oo = false;
    }, 200);

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
            returnCircle(circleData);
        }
    });
}, 0);
