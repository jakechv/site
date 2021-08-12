// final goal:
// mimic how this one works! https://mtg-interieur.fr/
// - small circle leading large cursor
// - maybe inversion of text under? maybe covering the text?
// - 'absorbed' into larger bubbles that react when about to click on them!

const styles = `
    #invertedcursor {
      position: absolute;
      width: 50px;
      height: 50px;
      background: gray;
      border-radius: 50%;
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
      z-index: -100;
      transition: transform .2s;
      pointer-events: none;
    }
    #funcircle {
      position: absolute;
      width: 750px;
      height: 2200px;
      background: #fff;
      border-radius: 50%;
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
      z-index: 2;
      mix-blend-mode: difference;
      transition: transform .2s;
      pointer-events: none;
    }
`

let mousedOverCircle = false;
let circleX = 0;
let circleY = 0;
let circleWidth = 0;
let circleHeight = 0;

// enable controls that allow disabling css rules across the document: eg disable all shadows on the page
// (tracks a 'virtual' index of css rules, then uses these to determine what real css rules to remove, where, and when)
function mouseOverCircle() {
  const mouseover = `
    #mouseover-circle {
      position: fixed;
      width: 80px;
      height: 80px;
      background: #000;
      border-radius: 50%;
      bottom: 20px;
      right: 20px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      z-index: 5;
    }
    `;

  UI.css(mouseover);
  const circ = UI.create("div", {
    id: "mouseover-circle",
    events: {
      mouseenter: (e) => {
        const rect = circ.getBoundingClientRect();
        const xPos = (rect.right + rect.left) / 2;
        const yPos = (rect.bottom + rect.top) / 2;
        const height = rect.bottom - rect.top;
        const width = rect.right - rect.left;
        mousedOverCircle = true;
        circleX = xPos;
        circleY = yPos;
        circleWidth = width;
        circleHeight = height;
      },
      mouseleave: e => { mousedOverCircle = false; }
    },
  }
  )();
}

// circle that keeps expanding after mouseover until it colors the foreground!!!
function circularCursor() {
  UI.css(styles);
  const ball = UI.create("div", {id: "invertedcursor"})();
  UI.create("div", {id: "funcircle"})();

  let mouseX = 0;
  let mouseY = 0;

  let ballX = 0;
  let ballY = 0;

  const defaultWidth = 50;
  const defaultHeight = 50;

  let ballWidth = defaultWidth;
  let ballHeight = defaultHeight;

  const moveSpeed = 0.08;
  const growDecSpeed = 0.02;

  // should finish growing right when the ball gets to the destination!

  function followCursor() {
    let distX = (mousedOverCircle ? circleX : mouseX) - ballX;
    let distY = (mousedOverCircle ? circleY : mouseY) - ballY;

    ballX = ballX + (distX * moveSpeed);
    ballY = ballY + (distY * moveSpeed);

    const growSpeed = moveSpeed / distX * 5;

    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    if(mousedOverCircle) {
      const maxWidth = (circleWidth + 20);
      const maxHeight = (circleHeight + 20);
      if(ballWidth < maxWidth && ballHeight < maxHeight) {
        ballWidth += (maxWidth * growSpeed);
        ballHeight += (maxHeight * growSpeed);

        ball.style.width = ballWidth + "px";
        ball.style.height = ballHeight + "px";
      }
    } else if(ballWidth > defaultWidth && ballHeight > defaultHeight) {
      ballWidth -= (circleWidth * growDecSpeed);
      ballHeight -= (circleHeight * growDecSpeed);

      ball.style.width = ballWidth + "px";
      ball.style.height = ballHeight + "px";
    }

    requestAnimationFrame(followCursor);
  }

  followCursor();

  // document and window can both listen for this event;
  // document is higher in the listener hierarchy so it triggers first,
  // though either can perform either functionality
  window.addEventListener("mousemove", (e) => {
    mouseX = event.pageX;
    mouseY = event.pageY;
  });
}

mouseOverCircle();
if(!Utils.isMobile()) circularCursor();
