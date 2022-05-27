import { animate, inertia, velocityPerSecond } from "popmotion";

const functions = { animate, inertia };

export default function AnimatedValue(initialOptions = {}) {
  const defaultOptions = {
    function: "animate",
    type: "spring",
  };

  let options = {
    ...defaultOptions,
    ...initialOptions,
  };

  let state, prevState;
  let time, prevTime;
  let animation = null;

  const onUpdate = (value) => {
    prevState = state;
    state = value;
    prevTime = time;
    time = performance.now();
    options.onUpdate?.(value);
  };

  const onComplete = () => {
    animation = null;
    options.onComplete?.();
  }

  const set = (newOptions, reset = false) => {
    if (animation) animation.stop();
    else time = performance.now();

    options = reset ? {
      from: state,
      ...newOptions,
    } : {
      ...options,
      from: state,
      ...newOptions,
    };

    const params = {
      ...options,
      onUpdate,
      onComplete,
    };

    if (animation) params.velocity =
      velocityPerSecond(state - prevState, time - prevTime);

    animation = functions[options.function](params);
  };

  set(options);

  return { set, options };
}
