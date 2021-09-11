/*!
 * Splide.js
 * Version  : 3.0.0
 * License  : MIT
 * Copyright: 2021 Naotoshi Fujita
 */
const PROJECT_CODE = "splide";
const DATA_ATTRIBUTE = `data-${PROJECT_CODE}`;

const CREATED = 1;
const MOUNTED = 2;
const IDLE = 3;
const MOVING = 4;
const DESTROYED = 5;
const STATES = {
  CREATED,
  MOUNTED,
  IDLE,
  MOVING,
  DESTROYED
};

function empty(array) {
  array.length = 0;
}

function isObject(subject) {
  return !isNull(subject) && typeof subject === "object";
}
function isArray(subject) {
  return Array.isArray(subject);
}
function isFunction(subject) {
  return typeof subject === "function";
}
function isString(subject) {
  return typeof subject === "string";
}
function isUndefined(subject) {
  return typeof subject === "undefined";
}
function isNull(subject) {
  return subject === null;
}
function isHTMLElement(subject) {
  return subject instanceof HTMLElement;
}
function isHTMLButtonElement(subject) {
  return subject instanceof HTMLButtonElement;
}

function toArray(value) {
  return isArray(value) ? value : [value];
}

function forEach(values, iteratee) {
  toArray(values).forEach(iteratee);
}

function includes(array, value) {
  return array.indexOf(value) > -1;
}

function push(array, items) {
  array.push(...toArray(items));
  return array;
}

const arrayProto = Array.prototype;

function slice(arrayLike, start, end) {
  return arrayProto.slice.call(arrayLike, start, end);
}

function find(arrayLike, predicate) {
  return slice(arrayLike).filter(predicate)[0];
}

function toggleClass(elm, classes, add) {
  if (elm) {
    forEach(classes, (name) => {
      if (name) {
        elm.classList[add ? "add" : "remove"](name);
      }
    });
  }
}

function addClass(elm, classes) {
  toggleClass(elm, classes, true);
}

function append(parent, children) {
  forEach(children, parent.appendChild.bind(parent));
}

function before(nodes, ref) {
  forEach(nodes, (node) => {
    const parent = ref.parentNode;
    if (parent) {
      parent.insertBefore(node, ref);
    }
  });
}

function matches(elm, selector) {
  return (elm["msMatchesSelector"] || elm.matches).call(elm, selector);
}

function children(parent, selector) {
  return parent ? slice(parent.children).filter((child) => matches(child, selector)) : [];
}

function child(parent, selector) {
  return selector ? children(parent, selector)[0] : parent.firstElementChild;
}

function forOwn(object, iteratee) {
  if (object) {
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== "__proto__") {
        if (iteratee(object[key], key) === false) {
          break;
        }
      }
    }
  }
  return object;
}

function assign(object, ...sources) {
  sources.forEach((source) => {
    forOwn(source, (value, key) => {
      object[key] = source[key];
    });
  });
  return object;
}

function merge(object, source) {
  forOwn(source, (value, key) => {
    if (isArray(value)) {
      object[key] = value.slice();
    } else if (isObject(value)) {
      object[key] = merge(isObject(object[key]) ? object[key] : {}, value);
    } else {
      object[key] = value;
    }
  });
  return object;
}

function removeAttribute(elm, attrs) {
  if (elm) {
    forEach(attrs, (attr) => {
      elm.removeAttribute(attr);
    });
  }
}

function setAttribute(elm, attrs, value) {
  if (isObject(attrs)) {
    forOwn(attrs, (value2, name) => {
      setAttribute(elm, name, value2);
    });
  } else {
    isNull(value) ? removeAttribute(elm, attrs) : elm.setAttribute(attrs, String(value));
  }
}

function create(tag, attrs, parent) {
  const elm = document.createElement(tag);
  if (attrs) {
    if (isString(attrs) || isArray(attrs)) {
      addClass(elm, attrs);
    } else {
      setAttribute(elm, attrs);
    }
  }
  if (parent) {
    append(parent, elm);
  }
  return elm;
}

function style(elms, styles) {
  if (isString(styles)) {
    return isArray(elms) ? null : getComputedStyle(elms)[styles];
  }
  forOwn(styles, (value, key) => {
    if (!isNull(value)) {
      forEach(elms, (elm) => {
        if (elm) {
          elm.style[key] = `${value}`;
        }
      });
    }
  });
}

function display(elm, display2) {
  style(elm, { display: display2 });
}

function getAttribute(elm, attr) {
  return elm.getAttribute(attr);
}

function hasClass(elm, className) {
  return elm && elm.classList.contains(className);
}

function parseHtml(html) {
  return child(new DOMParser().parseFromString(html, "text/html").body);
}

function prevent(e, stopPropagation) {
  e.preventDefault();
  if (stopPropagation) {
    e.stopPropagation();
    e.stopImmediatePropagation();
  }
}

function query(parent, selector) {
  return parent && parent.querySelector(selector);
}

function queryAll(parent, selector) {
  return slice(parent.querySelectorAll(selector));
}

function rect(target) {
  return target.getBoundingClientRect();
}

function remove(nodes) {
  forEach(nodes, (node) => {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  });
}

function removeClass(elm, classes) {
  toggleClass(elm, classes, false);
}

function unit(value) {
  return isString(value) ? value : value ? `${value}px` : "";
}

function assert(condition, message = "") {
  if (!condition) {
    throw new Error(`[${PROJECT_CODE}] ${message}`);
  }
}

function nextTick(callback) {
  setTimeout(callback);
}

const noop = () => {
};

function raf(func) {
  return requestAnimationFrame(func);
}

function between(number, minOrMax, maxOrMin, exclusive) {
  const min = Math.min(minOrMax, maxOrMin);
  const max = Math.max(minOrMax, maxOrMin);
  return exclusive ? min < number && number < max : min <= number && number <= max;
}

const { max: max$1, min: min$1 } = Math;
function clamp(number, x, y) {
  const minimum = min$1(x, y);
  const maximum = max$1(x, y);
  return min$1(max$1(minimum, number), maximum);
}

function sign(x) {
  return +(x > 0) - +(x < 0);
}

const { min, max, floor, ceil, abs, round } = Math;

function format(string, replacements) {
  forEach(replacements, (replacement) => {
    string = string.replace("%s", `${replacement}`);
  });
  return string;
}

function pad(number) {
  return number < 10 ? `0${number}` : `${number}`;
}

const ids = {};
function uniqueId(prefix) {
  return `${prefix}${pad(ids[prefix] = (ids[prefix] || 0) + 1)}`;
}

function Options(Splide2, Components2, options) {
  let initialOptions;
  let points;
  let currPoint;
  function setup() {
    try {
      merge(options, JSON.parse(getAttribute(Splide2.root, DATA_ATTRIBUTE)));
    } catch (e) {
      assert(false, e.message);
    }
    initialOptions = merge({}, options);
  }
  function mount() {
    const { breakpoints } = options;
    if (breakpoints) {
      points = Object.keys(breakpoints).sort((n, m) => +n - +m).map((point) => [
        point,
        matchMedia(`(${options.mediaQuery || "max"}-width:${point}px)`)
      ]);
      addEventListener("resize", observe);
      observe();
    }
  }
  function destroy(completely) {
    if (completely) {
      removeEventListener("resize", observe);
    }
  }
  function observe() {
    const item = find(points, (item2) => item2[1].matches) || [];
    if (item[0] !== currPoint) {
      onMatch(currPoint = item[0]);
    }
  }
  function onMatch(point) {
    const newOptions = options.breakpoints[point] || initialOptions;
    if (newOptions.destroy) {
      Splide2.options = initialOptions;
      Splide2.destroy(newOptions.destroy === "completely");
    } else {
      if (Splide2.state.is(DESTROYED)) {
        destroy(true);
        Splide2.mount();
      }
      Splide2.options = newOptions;
    }
  }
  return {
    setup,
    mount,
    destroy
  };
}

const RTL = "rtl";
const TTB = "ttb";

const ORIENTATION_MAP = {
  marginRight: ["marginBottom", "marginLeft"],
  width: ["height"],
  autoWidth: ["autoHeight"],
  fixedWidth: ["fixedHeight"],
  paddingLeft: ["paddingTop", "paddingRight"],
  paddingRight: ["paddingBottom", "paddingLeft"],
  left: ["top", "right"],
  right: ["bottom", "left"],
  x: ["y"],
  X: ["Y"],
  pageX: ["pageY"],
  ArrowLeft: ["ArrowUp", "ArrowRight"],
  ArrowRight: ["ArrowDown", "ArrowLeft"]
};
function Direction(Splide2, Components2, options) {
  function resolve(prop, axisOnly) {
    const { direction } = options;
    const index = direction === RTL && !axisOnly ? 1 : direction === TTB ? 0 : -1;
    return ORIENTATION_MAP[prop][index] || prop;
  }
  function orient(value) {
    return value * (options.direction === RTL ? 1 : -1);
  }
  return {
    resolve,
    orient
  };
}

const CLASS_ROOT = PROJECT_CODE;
const CLASS_SLIDER = `${PROJECT_CODE}__slider`;
const CLASS_TRACK = `${PROJECT_CODE}__track`;
const CLASS_LIST = `${PROJECT_CODE}__list`;
const CLASS_SLIDE = `${PROJECT_CODE}__slide`;
const CLASS_CLONE = `${CLASS_SLIDE}--clone`;
const CLASS_CONTAINER = `${CLASS_SLIDE}__container`;
const CLASS_ARROWS = `${PROJECT_CODE}__arrows`;
const CLASS_ARROW = `${PROJECT_CODE}__arrow`;
const CLASS_ARROW_PREV = `${CLASS_ARROW}--prev`;
const CLASS_ARROW_NEXT = `${CLASS_ARROW}--next`;
const CLASS_PAGINATION = `${PROJECT_CODE}__pagination`;
const CLASS_PAGINATION_PAGE = `${CLASS_PAGINATION}__page`;
const CLASS_PROGRESS = `${PROJECT_CODE}__progress`;
const CLASS_PROGRESS_BAR = `${CLASS_PROGRESS}__bar`;
const CLASS_AUTOPLAY = `${PROJECT_CODE}__autoplay`;
const CLASS_PLAY = `${PROJECT_CODE}__play`;
const CLASS_PAUSE = `${PROJECT_CODE}__pause`;
const CLASS_SPINNER = `${PROJECT_CODE}__spinner`;
const CLASS_INITIALIZED = "is-initialized";
const CLASS_ACTIVE = "is-active";
const CLASS_PREV = "is-prev";
const CLASS_NEXT = "is-next";
const CLASS_VISIBLE = "is-visible";
const CLASS_LOADING = "is-loading";
const STATUS_CLASSES = [CLASS_ACTIVE, CLASS_VISIBLE, CLASS_PREV, CLASS_NEXT, CLASS_LOADING];
const CLASSES = {
  slide: CLASS_SLIDE,
  clone: CLASS_CLONE,
  arrows: CLASS_ARROWS,
  arrow: CLASS_ARROW,
  prev: CLASS_ARROW_PREV,
  next: CLASS_ARROW_NEXT,
  pagination: CLASS_PAGINATION,
  page: CLASS_PAGINATION_PAGE,
  spinner: CLASS_SPINNER
};

const EVENT_MOUNTED = "mounted";
const EVENT_READY = "ready";
const EVENT_MOVE = "move";
const EVENT_MOVED = "moved";
const EVENT_CLICK = "click";
const EVENT_ACTIVE = "active";
const EVENT_INACTIVE = "inactive";
const EVENT_VISIBLE = "visible";
const EVENT_HIDDEN = "hidden";
const EVENT_SLIDE_KEYDOWN = "slide:keydown";
const EVENT_REFRESH = "refresh";
const EVENT_UPDATED = "undated";
const EVENT_RESIZE = "resize";
const EVENT_RESIZED = "resized";
const EVENT_DRAG = "drag";
const EVENT_DRAGGING = "dragging";
const EVENT_DRAGGED = "dragged";
const EVENT_SCROLL = "scroll";
const EVENT_SCROLLED = "scrolled";
const EVENT_DESTROY = "destroy";
const EVENT_ARROWS_MOUNTED = "arrows:mounted";
const EVENT_ARROWS_UPDATED = "arrows:updated";
const EVENT_PAGINATION_MOUNTED = "pagination:mounted";
const EVENT_PAGINATION_PAGE = "pagination:page";
const EVENT_PAGINATION_UPDATED = "pagination:updated";
const EVENT_NAVIGATION_MOUNTED = "navigation:mounted";
const EVENT_AUTOPLAY_PLAY = "autoplay:play";
const EVENT_AUTOPLAY_PLAYING = "autoplay:playing";
const EVENT_AUTOPLAY_PAUSE = "autoplay:pause";
const EVENT_LAZYLOAD_LOADED = "lazyload:loaded";

const DEFAULT_EVENT_PRIORITY = 10;
const DEFAULT_USER_EVENT_PRIORITY = 20;

function EventBus() {
  let handlers = {};
  function on(events, callback, key, priority = DEFAULT_EVENT_PRIORITY) {
    forEachEvent(events, (event, namespace) => {
      handlers[event] = handlers[event] || [];
      push(handlers[event], {
        _event: event,
        _callback: callback,
        _namespace: namespace,
        _priority: priority,
        _key: key
      }).sort((handler1, handler2) => handler1._priority - handler2._priority);
    });
  }
  function off(events, key) {
    forEachEvent(events, (event, namespace) => {
      const eventHandlers = handlers[event];
      handlers[event] = eventHandlers && eventHandlers.filter((handler) => {
        return handler._key ? handler._key !== key : handler._namespace !== namespace;
      });
    });
  }
  function offBy(key) {
    forOwn(handlers, (eventHandlers, event) => {
      off(event, key);
    });
  }
  function emit(event) {
    (handlers[event] || []).forEach((handler) => {
      handler._callback.apply(handler, slice(arguments, 1));
    });
  }
  function destroy() {
    handlers = {};
  }
  function forEachEvent(events, iteratee) {
    toArray(events).join(" ").split(" ").forEach((eventNS) => {
      const fragments = eventNS.split(".");
      iteratee(fragments[0], fragments[1]);
    });
  }
  return {
    on,
    off,
    offBy,
    emit,
    destroy
  };
}

function EventInterface(Splide2) {
  const { event } = Splide2;
  const key = {};
  let listeners = [];
  function on(events, callback, priority) {
    event.on(events, callback, key, priority);
  }
  function off(events) {
    event.off(events, key);
  }
  function bind(targets, events, callback, options) {
    forEachEvent(targets, events, (target, event2) => {
      listeners.push([target, event2, callback, options]);
      target.addEventListener(event2, callback, options);
    });
  }
  function unbind(targets, events) {
    forEachEvent(targets, events, (target, event2) => {
      listeners = listeners.filter((listener) => {
        if (listener[0] === target && listener[1] === event2) {
          target.removeEventListener(event2, listener[2], listener[3]);
          return false;
        }
        return true;
      });
    });
  }
  function forEachEvent(targets, events, iteratee) {
    forEach(targets, (target) => {
      if (target) {
        events.split(" ").forEach(iteratee.bind(null, target));
      }
    });
  }
  function destroy() {
    listeners = listeners.filter((data) => unbind(data[0], data[1]));
    event.offBy(key);
  }
  event.on(EVENT_DESTROY, destroy, key);
  return {
    on,
    off,
    emit: event.emit,
    bind,
    unbind,
    destroy
  };
}

function RequestInterval(interval, onInterval, onUpdate, limit) {
  const { now } = Date;
  let startTime;
  let rate = 0;
  let id;
  let paused = true;
  let count = 0;
  function update() {
    if (!paused) {
      const elapsed = now() - startTime;
      if (elapsed >= interval) {
        rate = 1;
        startTime = now();
      } else {
        rate = elapsed / interval;
      }
      if (onUpdate) {
        onUpdate(rate);
      }
      if (rate === 1) {
        onInterval();
        if (limit && ++count >= limit) {
          pause();
          return;
        }
      }
      raf(update);
    }
  }
  function start(resume) {
    !resume && cancel();
    startTime = now() - (resume ? rate * interval : 0);
    paused = false;
    raf(update);
  }
  function pause() {
    paused = true;
  }
  function rewind() {
    startTime = now();
    rate = 0;
    if (onUpdate) {
      onUpdate(rate);
    }
  }
  function cancel() {
    cancelAnimationFrame(id);
    rate = 0;
    id = 0;
    paused = true;
  }
  function isPaused() {
    return paused;
  }
  return {
    start,
    rewind,
    pause,
    cancel,
    isPaused
  };
}

function State(initialState) {
  let state = initialState;
  function set(value) {
    state = value;
  }
  function is(states) {
    return includes(toArray(states), state);
  }
  return { set, is };
}

function Throttle(func, duration) {
  let interval;
  function throttled() {
    if (!interval) {
      interval = RequestInterval(duration || 0, () => {
        func.apply(this, arguments);
        interval = null;
      }, null, 1);
      interval.start();
    }
  }
  return throttled;
}

function Elements(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  const { root } = Splide2;
  const elements = {};
  const slides = [];
  let classes;
  let slider;
  let track;
  let list;
  function setup() {
    collect();
    identify();
    addClass(root, classes = getClasses());
  }
  function mount() {
    on(EVENT_REFRESH, refresh);
    on(EVENT_UPDATED, update);
  }
  function destroy() {
    empty(slides);
    removeClass(root, classes);
  }
  function refresh() {
    destroy();
    setup();
  }
  function update() {
    removeClass(root, classes);
    addClass(root, classes = getClasses());
  }
  function collect() {
    slider = child(root, `.${CLASS_SLIDER}`);
    track = query(root, `.${CLASS_TRACK}`);
    list = child(track, `.${CLASS_LIST}`);
    assert(track && list, "Missing a track/list element.");
    push(slides, children(list, `.${CLASS_SLIDE}:not(.${CLASS_CLONE})`));
    const autoplay = find(`.${CLASS_AUTOPLAY}`);
    const arrows = find(`.${CLASS_ARROWS}`);
    assign(elements, {
      root,
      slider,
      track,
      list,
      slides,
      arrows,
      prev: query(arrows, `.${CLASS_ARROW_PREV}`),
      next: query(arrows, `.${CLASS_ARROW_NEXT}`),
      bar: query(find(`.${CLASS_PROGRESS}`), `.${CLASS_PROGRESS_BAR}`),
      play: query(autoplay, `.${CLASS_PLAY}`),
      pause: query(autoplay, `.${CLASS_PAUSE}`)
    });
  }
  function identify() {
    const id = root.id || uniqueId(PROJECT_CODE);
    root.id = id;
    track.id = track.id || `${id}-track`;
    list.id = list.id || `${id}-list`;
  }
  function find(selector) {
    return child(root, selector) || child(slider, selector);
  }
  function getClasses() {
    return [
      `${CLASS_ROOT}--${options.type}`,
      `${CLASS_ROOT}--${options.direction}`,
      options.drag && `${CLASS_ROOT}--draggable`,
      options.isNavigation && `${CLASS_ROOT}--nav`,
      CLASS_ACTIVE
    ];
  }
  return assign(elements, {
    setup,
    mount,
    destroy
  });
}

function Style() {
  let style;
  let sheet;
  function mount() {
    style = create("style", {}, document.head);
    sheet = style.sheet;
  }
  function destroy() {
    remove(style);
    sheet = null;
  }
  function rule(selector, prop, value) {
    const { cssRules } = sheet;
    const cssRule = find(cssRules, (cssRule2) => isCSSStyleRule(cssRule2) && cssRule2.selectorText === selector) || cssRules[sheet.insertRule(`${selector}{}`, 0)];
    if (isCSSStyleRule(cssRule)) {
      cssRule.style[prop] = `${value}`;
    }
  }
  function ruleBy(target, prop, value) {
    rule(`#${isHTMLElement(target) ? target.id : target}`, prop, value);
  }
  function isCSSStyleRule(cssRule) {
    return cssRule instanceof CSSStyleRule;
  }
  return {
    mount,
    destroy,
    rule,
    ruleBy
  };
}

const ROLE = "role";
const ARIA_CONTROLS = "aria-controls";
const ARIA_CURRENT = "aria-current";
const ARIA_LABEL = "aria-label";
const ARIA_HIDDEN = "aria-hidden";
const TAB_INDEX = "tabindex";
const DISABLED = "disabled";
const ALL_ATTRIBUTES = [
  ROLE,
  ARIA_CONTROLS,
  ARIA_CURRENT,
  ARIA_LABEL,
  ARIA_HIDDEN,
  TAB_INDEX,
  DISABLED
];

const SLIDE = "slide";
const LOOP = "loop";
const FADE = "fade";

function Slide$1(Splide2, index, slideIndex, slide) {
  const { on, emit, bind, destroy: destroyEvents } = EventInterface(Splide2);
  const { Components, root, options } = Splide2;
  const { isNavigation, updateOnMove } = options;
  const { resolve } = Components.Direction;
  const isClone = slideIndex > -1;
  const container = child(slide, `.${CLASS_CONTAINER}`);
  let destroyed;
  function mount() {
    init();
    bind(slide, "click keydown", (e) => {
      emit(e.type === "click" ? EVENT_CLICK : EVENT_SLIDE_KEYDOWN, this, e);
    });
    on([EVENT_RESIZED, EVENT_MOVED, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update.bind(this));
    if (updateOnMove) {
      on(EVENT_MOVE, onMove.bind(this));
    }
    update.call(this);
  }
  function init() {
    if (!isClone) {
      slide.id = `${root.id}-slide${pad(index + 1)}`;
    }
    if (isNavigation) {
      if (!isHTMLButtonElement(slide)) {
        setAttribute(slide, ROLE, "button");
      }
      const idx = isClone ? slideIndex : index;
      const label = format(options.i18n.slideX, idx + 1);
      const controls = Splide2.splides.map((splide) => splide.root.id).join(" ");
      setAttribute(slide, ARIA_LABEL, label);
      setAttribute(slide, ARIA_CONTROLS, controls);
    }
  }
  function destroy() {
    destroyed = true;
    destroyEvents();
    removeClass(slide, STATUS_CLASSES);
    removeAttribute(slide, ALL_ATTRIBUTES);
  }
  function onMove(next, prev, dest) {
    if (!destroyed) {
      if (dest === index) {
        updateActivity.call(this, true);
      }
      update.call(this);
    }
  }
  function update() {
    if (!destroyed) {
      const { index: currIndex } = Splide2;
      updateActivity.call(this, isActive());
      updateVisibility.call(this, isVisible());
      toggleClass(slide, CLASS_PREV, index === currIndex - 1);
      toggleClass(slide, CLASS_NEXT, index === currIndex + 1);
    }
  }
  function updateActivity(active) {
    if (active !== hasClass(slide, CLASS_ACTIVE)) {
      toggleClass(slide, CLASS_ACTIVE, active);
      if (isNavigation) {
        setAttribute(slide, ARIA_CURRENT, active || null);
      }
      emit(active ? EVENT_ACTIVE : EVENT_INACTIVE, this);
    }
  }
  function updateVisibility(visible) {
    setAttribute(slide, ARIA_HIDDEN, !visible || null);
    setAttribute(slide, TAB_INDEX, visible && options.slideFocus ? 0 : null);
    if (visible !== hasClass(slide, CLASS_VISIBLE)) {
      toggleClass(slide, CLASS_VISIBLE, visible);
      emit(visible ? EVENT_VISIBLE : EVENT_HIDDEN, this);
    }
  }
  function rule(prop, value, useContainer) {
    const selector = `#${slide.id}${container && useContainer ? ` > .${CLASS_CONTAINER}` : ""}`;
    Components.Style.rule(selector, prop, value);
  }
  function isActive() {
    return Splide2.index === index;
  }
  function isVisible() {
    if (Splide2.is(FADE)) {
      return isActive();
    }
    const trackRect = rect(Components.Elements.track);
    const slideRect = rect(slide);
    const left = resolve("left");
    const right = resolve("right");
    return floor(trackRect[left]) <= slideRect[left] && slideRect[right] <= ceil(trackRect[right]);
  }
  function isWithin(from, distance) {
    let diff = abs(from - index);
    if (!Splide2.is(SLIDE) && !isClone) {
      diff = min(diff, Splide2.length - diff);
    }
    return diff <= distance;
  }
  return {
    index,
    slideIndex,
    slide,
    container,
    isClone,
    mount,
    destroy,
    rule,
    isWithin
  };
}

function Slides(Splide2, Components2, options) {
  const { on, emit, bind } = EventInterface(Splide2);
  const { slides, list } = Components2.Elements;
  const Slides2 = [];
  function mount() {
    init();
    on(EVENT_REFRESH, refresh);
  }
  function init() {
    slides.forEach((slide, index) => {
      register(slide, index, -1);
    });
  }
  function destroy() {
    forEach$1((Slide2) => {
      Slide2.destroy();
    });
    empty(Slides2);
  }
  function refresh() {
    destroy();
    init();
  }
  function register(slide, index, slideIndex) {
    const object = Slide$1(Splide2, index, slideIndex, slide);
    object.mount();
    Slides2.push(object);
  }
  function get(excludeClones) {
    return excludeClones ? filter((Slide2) => !Slide2.isClone) : Slides2;
  }
  function getIn(page) {
    const { Controller } = Components2;
    const index = Controller.toIndex(page);
    const max = Controller.hasFocus() ? 1 : options.perPage;
    return filter((Slide2) => between(Slide2.index, index, index + max - 1));
  }
  function getAt(index) {
    return filter(index)[0];
  }
  function add(items, index) {
    forEach(items, (slide) => {
      if (isString(slide)) {
        slide = parseHtml(slide);
      }
      if (isHTMLElement(slide)) {
        const ref = slides[index];
        ref ? before(slide, ref) : append(list, slide);
        addClass(slide, options.classes.slide);
        observeImages(slide, emit.bind(null, EVENT_RESIZE));
      }
    });
    emit(EVENT_REFRESH);
  }
  function remove$1(matcher) {
    remove(filter(matcher).map((Slide2) => Slide2.slide));
    emit(EVENT_REFRESH);
  }
  function forEach$1(iteratee, excludeClones) {
    get(excludeClones).forEach(iteratee);
  }
  function filter(matcher) {
    return Slides2.filter(isFunction(matcher) ? matcher : (Slide2) => isString(matcher) ? matches(Slide2.slide, matcher) : includes(toArray(matcher), Slide2.index));
  }
  function rule(prop, value, useContainer) {
    forEach$1((Slide2) => {
      Slide2.rule(prop, value, useContainer);
    });
  }
  function observeImages(elm, callback) {
    const images = queryAll(elm, "img");
    let { length } = images;
    if (length) {
      images.forEach((img) => {
        bind(img, "load error", () => {
          if (!--length) {
            callback();
          }
        });
      });
    } else {
      callback();
    }
  }
  function getLength(excludeClones) {
    return excludeClones ? slides.length : Slides2.length;
  }
  function isEnough() {
    return Slides2.length > options.perPage;
  }
  return {
    mount,
    destroy,
    register,
    get,
    getIn,
    getAt,
    add,
    remove: remove$1,
    forEach: forEach$1,
    filter,
    rule,
    getLength,
    isEnough
  };
}

function Clones(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { Elements, Slides } = Components2;
  const { resolve } = Components2.Direction;
  const clones = [];
  let cloneCount;
  let cloneIndex;
  function mount() {
    init();
    on(EVENT_REFRESH, refresh);
    on([EVENT_UPDATED, EVENT_RESIZE], observe);
  }
  function init() {
    if (cloneCount = computeCloneCount()) {
      generate(cloneCount);
    }
  }
  function destroy() {
    remove(clones);
    empty(clones);
  }
  function refresh() {
    destroy();
    init();
  }
  function observe() {
    if (cloneCount !== computeCloneCount()) {
      emit(EVENT_REFRESH);
    }
  }
  function generate(count) {
    const slides = Slides.get().slice();
    const { length } = slides;
    if (length) {
      cloneIndex = 0;
      while (slides.length < count) {
        push(slides, slides);
      }
      slides.slice(-count).concat(slides.slice(0, count)).forEach((Slide, index) => {
        const isHead = index < count;
        const clone = cloneDeep(Slide.slide);
        isHead ? before(clone, slides[0].slide) : append(Elements.list, clone);
        push(clones, clone);
        Slides.register(clone, index - count + (isHead ? 0 : length), Slide.index);
      });
    }
  }
  function cloneDeep(elm) {
    const clone = elm.cloneNode(true);
    addClass(clone, options.classes.clone);
    clone.id = `${Splide2.root.id}-clone${pad(++cloneIndex)}`;
    return clone;
  }
  function computeCloneCount() {
    let { clones: clones2 } = options;
    if (!Splide2.is(LOOP)) {
      clones2 = 0;
    } else if (!clones2) {
      const fixedSize = options[resolve("fixedWidth")];
      const fixedCount = fixedSize && ceil(rect(Elements.track)[resolve("width")] / fixedSize);
      const baseCount = fixedCount || options[resolve("autoWidth")] && Splide2.length || options.perPage;
      clones2 = baseCount * (options.drag ? (options.flickMaxPages || 1) + 1 : 2);
    }
    return clones2;
  }
  return {
    mount,
    destroy
  };
}

function Layout(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const { Slides } = Components2;
  const { ruleBy } = Components2.Style;
  const { resolve } = Components2.Direction;
  const { root, track, list } = Components2.Elements;
  const { getAt } = Slides;
  const vertical = options.direction === TTB;
  function mount() {
    init();
    bind(window, "resize load", Throttle(emit.bind(this, EVENT_RESIZE)));
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on(EVENT_RESIZE, resize);
  }
  function init() {
    ruleBy(root, "maxWidth", unit(options.width));
    ruleBy(track, resolve("paddingLeft"), cssPadding(false));
    ruleBy(track, resolve("paddingRight"), cssPadding(true));
    Slides.rule(resolve("marginRight"), unit(options.gap));
    Slides.rule("width", cssSlideWidth());
    setSlidesHeight();
    resize();
  }
  function resize() {
    ruleBy(track, "height", cssTrackHeight());
    options.heightRatio && setSlidesHeight();
    emit(EVENT_RESIZED);
  }
  function setSlidesHeight() {
    Slides.rule("height", cssSlideHeight(), true);
  }
  function cssPadding(right) {
    const { padding } = options;
    const prop = resolve(right ? "right" : "left", true);
    return padding ? unit(padding[prop] || (isObject(padding) ? "0" : padding)) : "";
  }
  function cssTrackHeight() {
    let height = "";
    if (vertical) {
      height = cssHeight();
      assert(height, '"height" or "heightRatio" is missing.');
      const paddingTop = cssPadding(false);
      const paddingBottom = cssPadding(true);
      if (paddingTop || paddingBottom) {
        height = `calc(${height}`;
        height += `${paddingTop ? ` - ${paddingTop}` : ""}${paddingBottom ? ` - ${paddingBottom}` : ""})`;
      }
    }
    return height;
  }
  function cssHeight() {
    return unit(options.height || rect(list).width * options.heightRatio);
  }
  function cssSlideWidth() {
    return options.autoWidth ? "" : unit(options.fixedWidth) || (vertical ? "" : cssSlideSize());
  }
  function cssSlideHeight() {
    return unit(options.fixedHeight) || (vertical ? options.autoHeight ? "" : cssSlideSize() : cssHeight());
  }
  function cssSlideSize() {
    const gap = unit(options.gap);
    return `calc((100%${gap && ` + ${gap}`})/${options.perPage || 1}${gap && ` - ${gap}`})`;
  }
  function listSize() {
    return rect(list)[resolve("width")];
  }
  function slideSize(index, withoutGap) {
    const Slide = getAt(index || 0);
    return Slide ? rect(Slide.slide)[resolve("width")] + (withoutGap ? 0 : getGap()) : 0;
  }
  function totalSize(index, withoutGap) {
    const Slide = getAt(index);
    if (Slide) {
      const right = rect(Slide.slide)[resolve("right")];
      const left = rect(list)[resolve("left")];
      return abs(right - left) + (withoutGap ? 0 : getGap());
    }
    return 0;
  }
  function sliderSize() {
    const firstSlide = getAt(0);
    const lastSlide = getAt(Slides.getLength(true) - 1);
    if (firstSlide && lastSlide) {
      return rect(lastSlide.slide)[resolve("right")] - rect(firstSlide.slide)[resolve("left")];
    }
    return 0;
  }
  function getGap() {
    const Slide = getAt(0);
    return Slide ? parseFloat(style(Slide.slide, resolve("marginRight"))) || 0 : 0;
  }
  function getPadding(right) {
    return parseFloat(style(track, resolve(`padding${right ? "Right" : "Left"}`, true))) || 0;
  }
  return {
    mount,
    listSize,
    slideSize,
    sliderSize,
    totalSize,
    getPadding
  };
}

function Move(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { slideSize, getPadding, totalSize, listSize, sliderSize } = Components2.Layout;
  const { resolve, orient } = Components2.Direction;
  const { list, track } = Components2.Elements;
  let looping;
  let waiting;
  let currPosition = 0;
  let positionRate = 0;
  function mount() {
    on([EVENT_RESIZE, EVENT_UPDATED, EVENT_REFRESH], reposition);
  }
  function reposition() {
    if (options.drag !== "free") {
      jump(Splide2.index);
    } else {
      if (!options[resolve("fixedWidth")] && !options[resolve("autoWidth")]) {
        translate(listSize() * positionRate);
      }
      if (isExceededMax(currPosition)) {
        translate(getLimit(true));
      }
    }
  }
  function move(dest, index, prev) {
    if (!isBusy()) {
      const position = getPosition();
      looping = dest !== index;
      waiting = options.waitForTransition;
      Splide2.state.set(MOVING);
      emit(EVENT_MOVE, index, prev, dest);
      Components2.Transition.start(dest, () => {
        onMoved(dest, index, prev, position);
      });
    }
  }
  function onMoved(dest, index, prev, oldPosition) {
    if (looping) {
      jump(index);
      looping = false;
    }
    waiting = false;
    Splide2.state.set(IDLE);
    emit(EVENT_MOVED, index, prev, dest);
    if (options.trimSpace === "move" && dest !== prev && oldPosition === getPosition()) {
      Components2.Controller.go(dest > prev ? ">" : "<");
    }
  }
  function jump(index) {
    waiting = false;
    looping = false;
    Components2.Transition.cancel();
    translate(toPosition(index, true));
  }
  function translate(position) {
    currPosition = loop(position);
    positionRate = currPosition / listSize();
    Components2.Style.ruleBy(list, "transform", `translate${resolve("X")}(${currPosition}px)`);
  }
  function loop(position) {
    if (!looping && Splide2.is(LOOP)) {
      const diff = position - currPosition;
      const exceededMin = isExceededMin(position);
      const exceededMax = isExceededMax(position);
      if (exceededMin && diff > 0 || exceededMax && diff < 0) {
        position += orient(sliderSize() * (exceededMin ? 1 : -1));
      }
    }
    return position;
  }
  function cancel() {
    translate(getPosition());
    Components2.Transition.cancel();
  }
  function toIndex(position) {
    const Slides = Components2.Slides.get();
    let index = 0;
    let minDistance = Infinity;
    for (let i = 0; i < Slides.length; i++) {
      const slideIndex = Slides[i].index;
      const distance = abs(toPosition(slideIndex) - position);
      if (distance < minDistance) {
        minDistance = distance;
        index = slideIndex;
      } else {
        break;
      }
    }
    return index;
  }
  function toPosition(index, trimming) {
    const position = orient(totalSize(index - 1) - offset(index));
    return trimming ? trim(position) : position;
  }
  function getPosition() {
    const left = resolve("left");
    return rect(list)[left] - rect(track)[left] + orient(getPadding(false));
  }
  function trim(position) {
    if (options.trimSpace && Splide2.is(SLIDE)) {
      position = clamp(position, 0, orient(sliderSize() - listSize()));
    }
    return position;
  }
  function offset(index) {
    const { focus } = options;
    if (focus === "center") {
      return (listSize() - slideSize(index, true)) / 2;
    }
    return (+focus || 0) * slideSize(index);
  }
  function getLimit(max) {
    const trimming = !!options.trimSpace;
    return max ? toPosition(Components2.Controller.getEnd(), trimming) : toPosition(0, trimming);
  }
  function isBusy() {
    return !!(looping || waiting);
  }
  function isExceededMin(position, offset2) {
    return orient(position) + (offset2 || 0) < orient(getLimit(false));
  }
  function isExceededMax(position, offset2) {
    return orient(position) + (offset2 || 0) > orient(getLimit(true));
  }
  function isExceeded() {
    return isExceededMin(currPosition) || isExceededMax(currPosition);
  }
  return {
    mount,
    move,
    jump,
    translate,
    cancel,
    toIndex,
    toPosition,
    getPosition,
    getLimit,
    isBusy,
    isExceededMin,
    isExceededMax,
    isExceeded
  };
}

function Controller(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  const { Move } = Components2;
  const { isEnough, getLength } = Components2.Slides;
  const isLoop = Splide2.is(LOOP);
  let currIndex = options.start || 0;
  let prevIndex = currIndex;
  let slideCount;
  let perMove;
  let perPage;
  function mount() {
    init();
    Move.jump(currIndex);
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on(EVENT_SCROLLED, reindex, 0);
  }
  function init() {
    slideCount = getLength(true);
    perMove = options.perMove;
    perPage = options.perPage;
    if (currIndex >= slideCount) {
      Move.jump(currIndex = slideCount - 1);
    }
  }
  function reindex() {
    setIndex(Move.toIndex(Move.getPosition()));
  }
  function go(control, allowSameIndex) {
    const dest = parse(control);
    const index = loop(dest);
    if (index > -1 && !Move.isBusy() && (allowSameIndex || index !== currIndex)) {
      setIndex(index);
      Move.move(dest, index, prevIndex);
    }
  }
  function parse(control) {
    let index = currIndex;
    if (isString(control)) {
      const [, indicator, number] = control.match(/([+\-<>])(\d+)?/) || [];
      if (indicator === "+" || indicator === "-") {
        index = computeDestIndex(currIndex + +`${indicator}${+number || 1}`, currIndex, true);
      } else if (indicator === ">") {
        index = number ? toIndex(+number) : getNext(true);
      } else if (indicator === "<") {
        index = getPrev(true);
      }
    } else {
      if (isLoop) {
        index = clamp(control, -perPage, slideCount + perPage - 1);
      } else {
        index = clamp(control, 0, getEnd());
      }
    }
    return index;
  }
  function getNext(destination) {
    return getAdjacent(false, destination);
  }
  function getPrev(destination) {
    return getAdjacent(true, destination);
  }
  function getAdjacent(prev, destination) {
    const dest = computeDestIndex(currIndex + getPerMove() * (prev ? -1 : 1), currIndex);
    return destination ? dest : loop(dest);
  }
  function computeDestIndex(dest, from, incremental) {
    if (isEnough()) {
      const end = getEnd();
      if (dest < 0 || dest > end) {
        if (between(0, dest, from, true) || between(end, from, dest, true)) {
          dest = toIndex(toPage(dest));
        } else {
          if (isLoop) {
            dest = perMove ? dest : dest < 0 ? -(slideCount % perPage || perPage) : slideCount;
          } else if (options.rewind) {
            dest = dest < 0 ? end : 0;
          } else {
            dest = -1;
          }
        }
      } else {
        if (!isLoop && !incremental && dest !== from) {
          dest = toIndex(toPage(from) + (dest < from ? -1 : 1));
        }
      }
    } else {
      dest = -1;
    }
    return dest;
  }
  function getEnd() {
    let end = slideCount - perPage;
    if (hasFocus() || isLoop && perMove) {
      end = slideCount - 1;
    }
    return max(end, 0);
  }
  function loop(index) {
    if (isLoop) {
      return isEnough() ? index % slideCount + (index < 0 ? slideCount : 0) : -1;
    }
    return index;
  }
  function toIndex(page) {
    return clamp(hasFocus() ? page : perPage * page, 0, getEnd());
  }
  function toPage(index) {
    if (!hasFocus()) {
      index = between(index, slideCount - perPage, slideCount - 1) ? slideCount - 1 : index;
      index = floor(index / perPage);
    }
    return index;
  }
  function getPerMove() {
    return perMove || hasFocus() ? 1 : perPage;
  }
  function setIndex(index) {
    if (index !== currIndex) {
      prevIndex = currIndex;
      currIndex = index;
    }
  }
  function getIndex(prev) {
    return prev ? prevIndex : currIndex;
  }
  function hasFocus() {
    return !isUndefined(options.focus) || options.isNavigation;
  }
  return {
    mount,
    go,
    getNext,
    getPrev,
    getEnd,
    setIndex,
    getIndex,
    toIndex,
    toPage,
    hasFocus
  };
}

const XML_NAME_SPACE = "http://www.w3.org/2000/svg";
const PATH = "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z";
const SIZE = 40;

function Arrows(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const { classes, i18n } = options;
  const { Elements, Controller } = Components2;
  const { slider, track } = Elements;
  let wrapper = Elements.arrows;
  let prev = Elements.prev;
  let next = Elements.next;
  let created;
  const arrows = {};
  function mount() {
    init();
    on(EVENT_UPDATED, init);
  }
  function init() {
    if (options.arrows) {
      if (!prev || !next) {
        createArrows();
      }
    }
    if (prev && next) {
      if (!arrows.prev) {
        setAttribute(prev, ARIA_CONTROLS, track.id);
        setAttribute(next, ARIA_CONTROLS, track.id);
        arrows.prev = prev;
        arrows.next = next;
        listen();
        emit(EVENT_ARROWS_MOUNTED, prev, next);
      } else {
        display(wrapper, options.arrows === false ? "none" : "");
      }
    }
  }
  function destroy() {
    if (created) {
      remove(wrapper);
    } else {
      removeAttribute(prev, ALL_ATTRIBUTES);
      removeAttribute(next, ALL_ATTRIBUTES);
    }
  }
  function listen() {
    const { go } = Controller;
    on([EVENT_MOUNTED, EVENT_MOVE, EVENT_UPDATED, EVENT_REFRESH, EVENT_SCROLLED], update);
    bind(next, "click", () => {
      go(">");
    });
    bind(prev, "click", () => {
      go("<");
    });
  }
  function createArrows() {
    const parent = options.arrows === "slider" && slider ? slider : Splide2.root;
    wrapper = create("div", classes.arrows);
    prev = createArrow(true);
    next = createArrow(false);
    created = true;
    append(wrapper, [prev, next]);
    before(wrapper, child(parent));
  }
  function createArrow(prev2) {
    const arrow = `<button class="${classes.arrow} ${prev2 ? classes.prev : classes.next}" type="button"><svg xmlns="${XML_NAME_SPACE}" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}"><path d="${options.arrowPath || PATH}" />`;
    return parseHtml(arrow);
  }
  function update() {
    const index = Splide2.index;
    const prevIndex = Controller.getPrev();
    const nextIndex = Controller.getNext();
    const prevLabel = prevIndex > -1 && index < prevIndex ? i18n.last : i18n.prev;
    const nextLabel = nextIndex > -1 && index > nextIndex ? i18n.first : i18n.next;
    prev.disabled = prevIndex < 0;
    next.disabled = nextIndex < 0;
    setAttribute(prev, ARIA_LABEL, prevLabel);
    setAttribute(next, ARIA_LABEL, nextLabel);
    emit(EVENT_ARROWS_UPDATED, prev, next, prevIndex, nextIndex);
  }
  return {
    arrows,
    mount,
    destroy
  };
}

function Autoplay(Splide2, Components2, options) {
  const { on, bind, emit } = EventInterface(Splide2);
  const { root, track, bar, play: playButton, pause: pauseButton } = Components2.Elements;
  const interval = RequestInterval(options.interval, Splide2.go.bind(Splide2, ">"), update);
  const { isPaused } = interval;
  let hovered;
  let focused;
  let paused;
  function mount() {
    const { autoplay } = options;
    if (autoplay) {
      initButton(true);
      initButton(false);
      listen();
      if (autoplay !== "pause") {
        play();
      }
    }
  }
  function initButton(forPause) {
    const button = forPause ? pauseButton : playButton;
    if (button) {
      if (!isHTMLButtonElement(button)) {
        setAttribute(button, ROLE, "button");
      }
      setAttribute(button, ARIA_CONTROLS, track.id);
      setAttribute(button, ARIA_LABEL, options.i18n[forPause ? "pause" : "play"]);
      bind(button, "click", forPause ? pause : play);
    }
  }
  function listen() {
    if (options.pauseOnHover) {
      bind(root, "mouseenter mouseleave", (e) => {
        hovered = e.type === "mouseenter";
        autoToggle();
      });
    }
    if (options.pauseOnFocus) {
      bind(root, "focusin focusout", (e) => {
        focused = e.type === "focusin";
        autoToggle();
      });
    }
    on([EVENT_MOVE, EVENT_SCROLL, EVENT_REFRESH], interval.rewind);
  }
  function play() {
    if (isPaused() && Components2.Slides.isEnough()) {
      interval.start(!options.resetProgress);
      focused = false;
      hovered = false;
      emit(EVENT_AUTOPLAY_PLAY);
    }
  }
  function pause(manual = true) {
    if (!isPaused()) {
      interval.pause();
      emit(EVENT_AUTOPLAY_PAUSE);
    }
    paused = manual;
  }
  function autoToggle() {
    if (!paused) {
      if (!hovered && !focused) {
        play();
      } else {
        pause(false);
      }
    }
  }
  function update(rate) {
    emit(EVENT_AUTOPLAY_PLAYING, rate);
    if (bar) {
      style(bar, { width: `${rate * 100}%` });
    }
  }
  return {
    mount,
    destroy: interval.cancel,
    play,
    pause,
    isPaused
  };
}

function Cover(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  function mount() {
    if (options.cover) {
      on(EVENT_LAZYLOAD_LOADED, (img, Slide) => {
        toggle(true, img, Slide);
      });
      on([EVENT_MOUNTED, EVENT_UPDATED, EVENT_REFRESH], apply.bind(null, true));
    }
  }
  function destroy() {
    apply(false);
  }
  function apply(cover) {
    Components2.Slides.forEach((Slide) => {
      const img = child(Slide.container || Slide.slide, "img");
      if (img && img.src) {
        toggle(cover, img, Slide);
      }
    });
  }
  function toggle(cover, img, Slide) {
    Slide.rule("background", cover ? `center/cover no-repeat url("${img.src}")` : "", true);
    display(img, cover ? "none" : "");
  }
  return {
    mount,
    destroy
  };
}

const BOUNCE_DIFF_THRESHOLD = 10;
const BOUNCE_DURATION = 600;
const FRICTION_FACTOR = 0.6;
const BASE_VELOCITY = 1.2;
const MIN_DURATION = 800;

function Scroll(Splide2, Components2, options) {
  const { on, emit } = EventInterface(Splide2);
  const { Move } = Components2;
  const { getPosition, getLimit } = Move;
  let interval;
  function mount() {
    on(EVENT_MOVE, clear);
    on([EVENT_UPDATED, EVENT_REFRESH], cancel);
  }
  function scroll(destination, duration, suppressConstraint) {
    const start = getPosition();
    let friction = 1;
    duration = duration || computeDuration(abs(destination - start));
    clear();
    interval = RequestInterval(duration, onScrolled, (rate) => {
      const position = getPosition();
      const target = start + (destination - start) * easing(rate);
      const diff = (target - getPosition()) * friction;
      Move.translate(position + diff);
      if (Splide2.is(SLIDE) && !suppressConstraint && Move.isExceeded()) {
        friction *= FRICTION_FACTOR;
        if (abs(diff) < BOUNCE_DIFF_THRESHOLD) {
          bounce(Move.isExceededMin(getPosition()));
        }
      }
    }, 1);
    emit(EVENT_SCROLL);
    interval.start();
  }
  function bounce(backwards) {
    scroll(getLimit(!backwards), BOUNCE_DURATION, true);
  }
  function onScrolled() {
    emit(EVENT_SCROLLED);
  }
  function computeDuration(distance) {
    return max(distance / BASE_VELOCITY, MIN_DURATION);
  }
  function clear() {
    if (interval) {
      interval.cancel();
    }
  }
  function cancel() {
    if (interval && !interval.isPaused()) {
      clear();
      onScrolled();
    }
  }
  function easing(t) {
    const { easingFunc } = options;
    return easingFunc ? easingFunc(t) : 1 - Math.pow(1 - t, 4);
  }
  return {
    mount,
    destroy: clear,
    scroll,
    cancel
  };
}

const FRICTION = 5;
const SAMPLING_INTERVAL = 50;
const POINTER_DOWN_EVENTS = "touchstart mousedown";
const POINTER_MOVE_EVENTS = "touchmove mousemove";
const POINTER_UP_EVENTS = "touchend touchcancel mouseup mouseleave";

function Drag(Splide2, Components2, options) {
  const { emit, bind, unbind } = EventInterface(Splide2);
  const { track } = Components2.Elements;
  const { resolve, orient } = Components2.Direction;
  const { listSize } = Components2.Layout;
  const { go, getEnd } = Components2.Controller;
  const { Move, Scroll } = Components2;
  const { translate, toIndex, getPosition, isExceeded } = Move;
  const isSlide = Splide2.is(SLIDE);
  const isFade = Splide2.is(FADE);
  const isFree = options.drag === "free";
  let startCoord;
  let lastTime;
  let basePosition;
  let baseCoord;
  let baseTime;
  let lastEvent;
  let moving;
  let isMouse;
  let target;
  let exceeded;
  function mount() {
    if (options.drag) {
      bind(track, POINTER_DOWN_EVENTS, onPointerDown);
    }
  }
  function onPointerDown(e) {
    isMouse = e.type === "mousedown";
    target = isMouse ? window : track;
    if (!(isMouse && e.button)) {
      if (!Move.isBusy()) {
        bind(target, POINTER_MOVE_EVENTS, onPointerMove);
        bind(target, POINTER_UP_EVENTS, onPointerUp);
        Move.cancel();
        Scroll.cancel();
        startCoord = getCoord(e);
      } else {
        prevent(e);
      }
    }
  }
  function onPointerMove(e) {
    if (e.cancelable) {
      const min2 = options.dragMinThreshold || 15;
      if (isMouse || abs(getCoord(e) - startCoord) > min2) {
        moving = true;
        onDrag();
      }
      if (moving) {
        onDragging(e);
        prevent(e, true);
      }
    } else {
      onPointerUp(e);
    }
  }
  function onPointerUp(e) {
    unbind(target, `${POINTER_MOVE_EVENTS} ${POINTER_UP_EVENTS}`);
    moving = false;
    if (lastEvent) {
      onDragged(e);
      lastEvent = null;
    }
  }
  function onDrag() {
    bind(track, "click", (e) => {
      unbind(track, "click");
      prevent(e, true);
    }, { capture: true });
    emit(EVENT_DRAG);
  }
  function onDragging(e) {
    const { timeStamp } = e;
    const expired = !lastTime || timeStamp - lastTime > SAMPLING_INTERVAL;
    if (expired || isExceeded() !== exceeded) {
      basePosition = getPosition();
      baseCoord = getCoord(e);
      baseTime = timeStamp;
    }
    exceeded = isExceeded();
    lastTime = timeStamp;
    lastEvent = e;
    if (!isFade) {
      translate(basePosition + constrain(getCoord(e) - baseCoord));
    }
    emit(EVENT_DRAGGING);
  }
  function onDragged(e) {
    const velocity = computeVelocity(e);
    if (isFade) {
      go(Splide2.index + orient(sign(velocity)));
    } else {
      const destination = computeDestination(velocity);
      if (isFree) {
        Scroll.scroll(destination);
      } else {
        go(computeIndex(destination), true);
      }
    }
    lastTime = 0;
    emit(EVENT_DRAGGED);
  }
  function computeVelocity(e) {
    if (Splide2.is(LOOP) || !isExceeded()) {
      const diffCoord = getCoord(lastEvent) - baseCoord;
      const diffTime = lastEvent.timeStamp - baseTime;
      const isFlick = e.timeStamp - lastTime < SAMPLING_INTERVAL;
      if (diffTime && isFlick) {
        return diffCoord / diffTime;
      }
    }
    return 0;
  }
  function computeDestination(velocity) {
    const flickPower = options.flickPower || 600;
    return getPosition() + sign(velocity) * min(abs(velocity) * flickPower, isFree ? Infinity : listSize() * (options.flickMaxPages || 1));
  }
  function computeIndex(destination) {
    const dest = toIndex(destination);
    return isSlide ? clamp(dest, 0, getEnd()) : dest;
  }
  function getCoord(e) {
    return (isMouse ? e : e.touches[0])[resolve("pageX")];
  }
  function constrain(diff) {
    return diff / (exceeded && isSlide ? FRICTION : 1);
  }
  return {
    mount
  };
}

const IE_ARROW_KEYS = ["Left", "Right", "Up", "Down"];
function Keyboard(Splide2, Components2, options) {
  const { on, bind, unbind } = EventInterface(Splide2);
  const { root } = Components2.Elements;
  const { resolve } = Components2.Direction;
  let target;
  function mount() {
    init();
    on(EVENT_UPDATED, () => {
      destroy();
      init();
    });
  }
  function init() {
    const { keyboard = "global" } = options;
    if (keyboard) {
      if (keyboard === "focused") {
        target = root;
        setAttribute(root, TAB_INDEX, 0);
      } else {
        target = window;
      }
      bind(target, "keydown", (e) => {
        const key = normalize(e.key);
        if (key === resolve("ArrowLeft")) {
          Splide2.go("<");
        } else if (key === resolve("ArrowRight")) {
          Splide2.go(">");
        }
      });
    }
  }
  function destroy() {
    if (target) {
      unbind(target, "keydown");
      if (isHTMLElement(target)) {
        removeAttribute(target, TAB_INDEX);
      }
    }
  }
  function normalize(key) {
    return includes(IE_ARROW_KEYS, key) ? `Arrow${key}` : key;
  }
  return {
    mount,
    destroy
  };
}

const SRC_DATA_ATTRIBUTE = `${DATA_ATTRIBUTE}-lazy`;
const SRCSET_DATA_ATTRIBUTE = `${SRC_DATA_ATTRIBUTE}-srcset`;
const IMAGE_SELECTOR = `[${SRC_DATA_ATTRIBUTE}], [${SRCSET_DATA_ATTRIBUTE}]`;

function LazyLoad(Splide2, Components2, options) {
  const { on, off, bind, emit } = EventInterface(Splide2);
  const isSequential = options.lazyLoad === "sequential";
  let images = [];
  let index = 0;
  function mount() {
    if (options.lazyLoad) {
      on([EVENT_MOUNTED, EVENT_REFRESH], () => {
        destroy();
        init();
      });
      if (!isSequential) {
        on([EVENT_MOUNTED, EVENT_REFRESH, EVENT_MOVED], observe);
      }
    }
  }
  function init() {
    Components2.Slides.forEach((_Slide) => {
      queryAll(_Slide.slide, IMAGE_SELECTOR).forEach((_img) => {
        const src = getAttribute(_img, SRC_DATA_ATTRIBUTE);
        const srcset = getAttribute(_img, SRCSET_DATA_ATTRIBUTE);
        if (src !== _img.src || srcset !== _img.srcset) {
          const _spinner = create("span", options.classes.spinner, _img.parentElement);
          setAttribute(_spinner, ROLE, "presentation");
          images.push({ _img, _Slide, src, srcset, _spinner });
          display(_img, "none");
        }
      });
    });
    if (isSequential) {
      loadNext();
    }
  }
  function destroy() {
    index = 0;
    images = [];
  }
  function observe() {
    images = images.filter((data) => {
      if (data._Slide.isWithin(Splide2.index, options.perPage * ((options.preloadPages || 1) + 1))) {
        return load(data);
      }
      return true;
    });
    if (!images.length) {
      off(EVENT_MOVED);
    }
  }
  function load(data) {
    const { _img } = data;
    addClass(data._Slide.slide, CLASS_LOADING);
    bind(_img, "load error", (e) => {
      onLoad(data, e.type === "error");
    });
    ["src", "srcset"].forEach((name) => {
      if (data[name]) {
        setAttribute(_img, name, data[name]);
        removeAttribute(_img, name === "src" ? SRC_DATA_ATTRIBUTE : SRCSET_DATA_ATTRIBUTE);
      }
    });
  }
  function onLoad(data, error) {
    const { _Slide } = data;
    removeClass(_Slide.slide, CLASS_LOADING);
    if (!error) {
      remove(data._spinner);
      display(data._img, "");
      emit(EVENT_LAZYLOAD_LOADED, data._img, _Slide);
      emit(EVENT_RESIZE);
    }
    if (isSequential) {
      loadNext();
    }
  }
  function loadNext() {
    if (index < images.length) {
      load(images[index++]);
    }
  }
  return {
    mount,
    destroy
  };
}

function Pagination(Splide2, Components2, options) {
  const { on, emit, bind, unbind } = EventInterface(Splide2);
  const { Slides } = Components2;
  const { go, toPage, hasFocus, getIndex } = Components2.Controller;
  const items = [];
  let list;
  function mount() {
    init();
    on([EVENT_UPDATED, EVENT_REFRESH], init);
    on([EVENT_MOVE, EVENT_SCROLLED], update);
  }
  function init() {
    destroy();
    if (options.pagination && Slides.isEnough()) {
      createPagination();
      emit(EVENT_PAGINATION_MOUNTED, { list, items }, getAt(Splide2.index));
      update();
    }
  }
  function destroy() {
    if (list) {
      remove(list);
      items.forEach((item) => {
        unbind(item.button, "click");
      });
      empty(items);
      list = null;
    }
  }
  function createPagination() {
    const { length } = Splide2;
    const { classes, i18n, perPage } = options;
    const { slider, root } = Components2.Elements;
    const parent = options.pagination === "slider" && slider ? slider : root;
    const max = hasFocus() ? length : ceil(length / perPage);
    list = create("ul", classes.pagination, parent);
    for (let i = 0; i < max; i++) {
      const li = create("li", null, list);
      const button = create("button", { class: classes.page, type: "button" }, li);
      const controls = Slides.getIn(i).map((Slide) => Slide.slide.id);
      const text = !hasFocus() && perPage > 1 ? i18n.pageX : i18n.slideX;
      bind(button, "click", () => {
        go(`>${i}`);
      });
      setAttribute(button, ARIA_CONTROLS, controls.join(" "));
      setAttribute(button, ARIA_LABEL, format(text, i + 1));
      emit(EVENT_PAGINATION_PAGE, list, li, button, i);
      items.push({ li, button, page: i });
    }
  }
  function getAt(index) {
    return items[toPage(index)];
  }
  function update() {
    const prev = getAt(getIndex(true));
    const curr = getAt(getIndex());
    if (prev) {
      removeClass(prev.button, CLASS_ACTIVE);
      removeAttribute(prev.button, ARIA_CURRENT);
    }
    if (curr) {
      addClass(curr.button, CLASS_ACTIVE);
      setAttribute(curr.button, ARIA_CURRENT, true);
    }
    emit(EVENT_PAGINATION_UPDATED, { list, items }, prev, curr);
  }
  return {
    items,
    mount,
    destroy,
    getAt
  };
}

const TRIGGER_KEYS = [" ", "Enter", "Spacebar"];
function Sync(Splide2, Components2, options) {
  const { splides } = Splide2;
  function mount() {
    if (options.isNavigation) {
      navigate();
    } else {
      sync();
    }
  }
  function sync() {
    const processed = [];
    splides.concat(Splide2).forEach((splide, index, instances) => {
      EventInterface(splide).on(EVENT_MOVE, (index2, prev, dest) => {
        instances.forEach((instance) => {
          if (instance !== splide && !includes(processed, splide)) {
            processed.push(instance);
            instance.go(instance.is(LOOP) ? dest : index2);
          }
        });
        empty(processed);
      });
    });
  }
  function navigate() {
    const { on, emit } = EventInterface(Splide2);
    on(EVENT_CLICK, (Slide) => {
      Splide2.go(Slide.index);
    });
    on(EVENT_SLIDE_KEYDOWN, (Slide, e) => {
      if (includes(TRIGGER_KEYS, e.key)) {
        Splide2.go(Slide.index);
        prevent(e);
      }
    });
    emit(EVENT_NAVIGATION_MOUNTED, Splide2.splides);
  }
  return {
    mount
  };
}

function Wheel(Splide2, Components2, options) {
  const { bind } = EventInterface(Splide2);
  function mount() {
    if (options.wheel) {
      bind(Components2.Elements.track, "wheel", onWheel);
    }
  }
  function onWheel(e) {
    const { deltaY } = e;
    if (deltaY) {
      Splide2.go(deltaY < 0 ? "<" : ">");
      prevent(e);
    }
  }
  return {
    mount
  };
}

var ComponentConstructors = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Options: Options,
  Direction: Direction,
  Elements: Elements,
  Style: Style,
  Slides: Slides,
  Clones: Clones,
  Layout: Layout,
  Move: Move,
  Controller: Controller,
  Arrows: Arrows,
  Autoplay: Autoplay,
  Cover: Cover,
  Scroll: Scroll,
  Drag: Drag,
  Keyboard: Keyboard,
  LazyLoad: LazyLoad,
  Pagination: Pagination,
  Sync: Sync,
  Wheel: Wheel
});

const I18N = {
  prev: "Previous slide",
  next: "Next slide",
  first: "Go to first slide",
  last: "Go to last slide",
  slideX: "Go to slide %s",
  pageX: "Go to page %s",
  play: "Start autoplay",
  pause: "Pause autoplay"
};

const DEFAULTS = {
  type: "slide",
  speed: 400,
  waitForTransition: true,
  perPage: 1,
  arrows: true,
  pagination: true,
  interval: 5e3,
  pauseOnHover: true,
  pauseOnFocus: true,
  resetProgress: true,
  easing: "cubic-bezier(.42,.65,.27,.99)",
  drag: true,
  direction: "ltr",
  slideFocus: true,
  trimSpace: true,
  classes: CLASSES,
  i18n: I18N
};

function Fade(Splide2, Components2, options) {
  const { on } = EventInterface(Splide2);
  const { ruleBy } = Components2.Style;
  function mount() {
    on([EVENT_MOUNTED, EVENT_REFRESH], () => {
      nextTick(() => {
        Components2.Slides.forEach((Slide) => {
          ruleBy(Slide.slide, "transition", `opacity ${options.speed}ms ${options.easing}`);
        });
      });
    });
  }
  function start(index, done) {
    const { track } = Components2.Elements;
    ruleBy(track, "height", unit(rect(track).height));
    nextTick(() => {
      done();
      ruleBy(track, "height", "");
    });
  }
  return {
    mount,
    start,
    cancel: noop
  };
}

function Slide(Splide2, Components2, options) {
  const { bind } = EventInterface(Splide2);
  const { Move, Controller } = Components2;
  const { list } = Components2.Elements;
  let endCallback;
  function mount() {
    bind(list, "transitionend", (e) => {
      if (e.target === list && endCallback) {
        cancel();
        endCallback();
      }
    });
  }
  function start(index, done) {
    const destination = Move.toPosition(index, true);
    const position = Move.getPosition();
    const speed = getSpeed(index);
    if (abs(destination - position) >= 1 && speed >= 1) {
      apply(`transform ${speed}ms ${options.easing}`);
      Move.translate(destination);
      endCallback = done;
    } else {
      Move.jump(index);
      done();
    }
  }
  function cancel() {
    apply("");
  }
  function getSpeed(index) {
    const { rewindSpeed } = options;
    if (Splide2.is(SLIDE) && rewindSpeed) {
      const prev = Controller.getIndex(true);
      const end = Controller.getEnd();
      if (prev === 0 && index >= end || prev >= end && index === 0) {
        return rewindSpeed;
      }
    }
    return options.speed;
  }
  function apply(transition) {
    Components2.Style.ruleBy(list, "transition", transition);
  }
  return {
    mount,
    start,
    cancel
  };
}

const _Splide = class {
  constructor(target, options) {
    this.event = EventBus();
    this.Components = {};
    this.state = State(CREATED);
    this.splides = [];
    this._options = {};
    this._Extensions = {};
    const root = isString(target) ? query(document, target) : target;
    assert(root, `${root} is invalid.`);
    this.root = root;
    merge(DEFAULTS, _Splide.defaults);
    merge(merge(this._options, DEFAULTS), options || {});
  }
  mount(Extensions, Transition) {
    this.state.set(CREATED);
    this._Transition = Transition || this._Transition || (this.is(FADE) ? Fade : Slide);
    this._Extensions = Extensions || this._Extensions;
    const Constructors = assign({}, ComponentConstructors, this._Extensions, { Transition: this._Transition });
    const { Components: Components2 } = this;
    forOwn(Constructors, (Component, key) => {
      const component = Component(this, this.Components, this._options);
      Components2[key] = component;
      component.setup && component.setup();
    });
    forOwn(Components2, (component) => {
      component.mount && component.mount();
    });
    forOwn(Components2, (component) => {
      component.mounted && component.mounted();
    });
    this.emit(EVENT_MOUNTED);
    addClass(this.root, CLASS_INITIALIZED);
    this.state.set(IDLE);
    this.emit(EVENT_READY);
    return this;
  }
  sync(splide) {
    this.splides.push(splide);
    splide.splides.push(this);
    return this;
  }
  go(control) {
    this.Components.Controller.go(control);
  }
  on(events, callback) {
    this.event.on(events, callback, null, DEFAULT_USER_EVENT_PRIORITY);
    return this;
  }
  off(events) {
    this.event.off(events);
    return this;
  }
  emit(event, ...args) {
    this.event.emit(event, ...args);
    return this;
  }
  add(slides, index) {
    this.Components.Slides.add(slides, index);
    return this;
  }
  remove(matcher) {
    this.Components.Slides.remove(matcher);
    return this;
  }
  is(type) {
    return this._options.type === type;
  }
  refresh() {
    this.emit(EVENT_REFRESH);
    return this;
  }
  destroy(completely) {
    const { event, state } = this;
    if (state.is(CREATED)) {
      event.on(EVENT_READY, this.destroy.bind(this, completely), this);
    } else {
      forOwn(this.Components, (component) => {
        component.destroy && component.destroy(completely);
      });
      event.emit(EVENT_DESTROY);
      event.destroy();
      empty(this.splides);
      state.set(DESTROYED);
    }
    return this;
  }
  get options() {
    return this._options;
  }
  set options(options) {
    const { _options } = this;
    merge(_options, options);
    if (!this.state.is(CREATED)) {
      this.emit(EVENT_UPDATED, _options);
    }
  }
  get length() {
    return this.Components.Slides.getLength(true);
  }
  get index() {
    return this.Components.Controller.getIndex();
  }
};
let Splide = _Splide;
Splide.defaults = {};
Splide.STATES = STATES;

export { CLASSES, CLASS_ACTIVE, CLASS_ARROW, CLASS_ARROWS, CLASS_ARROW_NEXT, CLASS_ARROW_PREV, CLASS_AUTOPLAY, CLASS_CLONE, CLASS_CONTAINER, CLASS_INITIALIZED, CLASS_LIST, CLASS_LOADING, CLASS_NEXT, CLASS_PAGINATION, CLASS_PAGINATION_PAGE, CLASS_PAUSE, CLASS_PLAY, CLASS_PREV, CLASS_PROGRESS, CLASS_PROGRESS_BAR, CLASS_ROOT, CLASS_SLIDE, CLASS_SLIDER, CLASS_SPINNER, CLASS_TRACK, CLASS_VISIBLE, EVENT_ACTIVE, EVENT_ARROWS_MOUNTED, EVENT_ARROWS_UPDATED, EVENT_AUTOPLAY_PAUSE, EVENT_AUTOPLAY_PLAY, EVENT_AUTOPLAY_PLAYING, EVENT_CLICK, EVENT_DESTROY, EVENT_DRAG, EVENT_DRAGGED, EVENT_DRAGGING, EVENT_HIDDEN, EVENT_INACTIVE, EVENT_LAZYLOAD_LOADED, EVENT_MOUNTED, EVENT_MOVE, EVENT_MOVED, EVENT_NAVIGATION_MOUNTED, EVENT_PAGINATION_MOUNTED, EVENT_PAGINATION_PAGE, EVENT_PAGINATION_UPDATED, EVENT_READY, EVENT_REFRESH, EVENT_RESIZE, EVENT_RESIZED, EVENT_SCROLL, EVENT_SCROLLED, EVENT_SLIDE_KEYDOWN, EVENT_UPDATED, EVENT_VISIBLE, EventBus, EventInterface, RequestInterval, STATUS_CLASSES, Splide, State, Throttle, Splide as default };
