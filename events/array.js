const N = 5;

const event = () => {
	const subs = [];

	return {
		sub: (handler) => {
			subs.push(handler);
		},
		pub: (value) => {
			for (let i = 0; i < subs.length; ++i) {
				subs[i](value);
			}
		},
    uns: (handler) => {
      subs.splice(subs.indexOf(handler), 1);
    }
	};
};

export const $init = {
  $default: event(),
  $generator: function() {
    return 0;
  },
  $function: function(_, blackbox) {
    blackbox(event());
  }
};

export const $sub = {
  $default: event(),
  $generator: function() {
    return {
      event: event(),
      handlers: [...new Array(N)].map(() => (() => {}))
    };
  },
  $function: function(value, blackbox) {
    for (let i = 0; i < value.handlers.length; ++i) {
      blackbox(value.event.sub(value.handlers[i]));
    }
  }
};

export const $pub = {
  $default: event(),
  $generator: function() {
    const _event = event();

    for (let i = 0; i < N; ++i) {
      _event.sub(() => {});
    }

    return {
      event: _event,
      value: Math.random()
    };
  },
  $function: function(value, blackbox) {
    blackbox(value.event.pub(value.value));
  }
};

export const $unsub = {
  $default: event(),
  $generator: function() {
    const _event = event();
    const handlers = [...new Array(N)].map(() => (() => {}));

    for (let i = 0; i < handlers.length; ++i) {
      _event.sub(handlers[i]);
    }

    return {
      event: _event,
      handlers
    };
  },
  $function: function(value, blackbox) {
    for (let i = 0; i < value.handlers.length; ++i) {
      blackbox(value.event.uns(value.handlers[i]));
    }
  }
};
