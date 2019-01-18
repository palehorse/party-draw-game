(function( factory ) {
	if (typeof(require) === 'function') {
		module.exports = factory(jQuery);
	} else {
		factory(jQuery);
	}
})(function( $ ) {
	var _this, _defauts, _cardFactory, _pointsFactory, _keydown, _list = {};

	function keydownHandler() {
		var isListening = false,
			values = [];
		return {
			startListening: function() {
				if (!isListening) isListening = true;
			},
			stopListening: function() {
				if (isListening) isListening = false;
			},
			isListening: function() {
				return isListening;
			},
			handle: function(e) {
				if (e.keyCode == 9 || e.keyCode == 13) this.stopListening();
				else if (isListening) values.push(String.fromCharCode(e.keyCode));
			},
			getValue: function() {
				return values.join('');
			},
			resetValue: function() {
				values = [];
			}
		}
	}

	function ObjectAPI(object) {
		var target = object;
		return {
			exists: function(property) {
				if (typeof property === 'string' && typeof object[property] !== 'undefined') return true;
				return false;
			},
			fetch: function(property) {
				if (this.exists(property)) return object[property];
			},
			set: function(property, value) {
				if (this.exists(property) && typeof value !== 'undefined') object[property] = value;
				return this;
			},
			getType(property) {
				return typeof target[property];
			}
		}
	}

	function Card() {
		var card, font, back, obj, text, name, id, deg = 0, latency = 110,
			css = {
				'color': '#fcfcfc',
				'border-radius': 4,
				'display': 'flex',
				'display': '-webkit-flex',
				'-webkit-align-items': 'center',
				'align-items': 'center',
				'-webkit-justify-content': 'center',
				'justify-content': 'center',
			};
		function create(id) {
			card = $('<div class="party-draw-card"></div>').css({'margin': 5,'cursor': 'pointer', 'perspective': 1000});
			front = $('<div class="party-draw-card-front"></div>').css({
				'background-color': '#84c1ff',
				'font-size': _defauts.cardWidth * 0.75,
			}).css(css);

			back = $('<div class="party-draw-card-back"></div>').css({
				'background-color': '#ffb5b5',
				'font-size': _defauts.cardWidth * 0.25,
			}).css(css);
			card.append(front).append(back);
		}

		function init(initialParams) {
			var settings = {
							  '-webkit-backface-visibility':'hidden',
							  'backface-visibility':'hidden',
							  'position':'absolute',
							  'font-weight': 'bold',
							  'top':0,
							  'left':0,
							}, obj;
			if (typeof card !== 'undefined' && 
				typeof front !== 'undefined' && 
				typeof back !== 'undefined') {
				if (typeof initialParams === 'object') {
					obj = new ObjectAPI(initialParams);
					if (obj.exists('id')) id = obj.fetch('id');
					if (obj.exists('text')) text = obj.fetch('text');
					if (obj.exists('name')) name = obj.fetch('name');
					if (obj.exists('width') && obj.getType('width') == 'number' &&
						obj.exists('height') && obj.getType('height') == 'number') {
						$.extend(settings, {'width': obj.fetch('width'), 'height': obj.fetch('height')});
						card.attr('id', 'party-draw-card-' + id).css({
							'transition': '0.7s',
							'transform-style': 'preserve-3d',
							'position': 'relative',
							'float': 'left',
							'display': 'flex',
							'width': obj.fetch('width'), 
							'height': obj.fetch('height'),
						});
						front.css(settings).css({'z-index':2}).html(text);
						back.css(settings).css({'transform':'rotateY(180deg)'}).html(name);
					}
				}
			}
		}

		function flip() {
			card.css({'transform': 'rotateY(' + (deg += 540) + 'deg)'});
		}

		function getCard() {
			return card;
		}

		function twinkle(callback, during) {
			card.find('.party-draw-card-front').css({'background-color': '#ca8eff'});
			window.setTimeout(function() {
				card.find('.party-draw-card-front').css({'background-color': '#84c1ff'});
				if (typeof callback === 'function') callback.call();
			}, ((typeof during === 'number') ? during : latency));
		}
		
		return {
			create: function() {
				create.call();
				return this;
			},
			init: function(initialParams) {
				init.call(null, initialParams);
				return this;
			},
			flip: function(callback) {
				flip.call(null, callback);
				return this;
			},
			get: function get() {
				return getCard.call();
			},
			twinkle: function(callback, latency) {
				twinkle.call(null, callback, latency);
			}
		}
	}

	function Path() {
		var path, starts, steps, randomPath, randomStart, distance, number, incredient;
		function create() {
			starts = [1, _defauts.cols, _defauts.people.length-(_defauts.cols-1), _defauts.people.length];
			randomStart = Math.floor(Math.random()*starts.length);
			randomPath = [];
			path = [starts[randomStart]];
		}

		function init(target) {
			number = (target - (target%_defauts.cols)) / _defauts.cols + 1;
			distance = (randomStart < _defauts.cols) ? number : (_defauts.people.length-(_defauts.people.length%_defauts.cols))/_defauts.cols;
			
			for (var i=1; i<distance; i++) {
				if (path[path.length-1] % _defauts.cols > parseInt(_defauts.cols/2)) {
					incredient = -1;
				} else {
					incredient = 1;
				}
				steps = Math.floor(Math.random()*((path[path.length-1]%_defauts.cols > parseInt(_defauts.cols/2))?path[path.length-1]%_defauts.cols:_defauts.cols-path[path.length-1]%_defauts.cols));
					
				for (var j=0; j<steps; j++) {
					path.push(path[path.length-1]+incredient);
				}

				if (path[path.length-1] > target) path.push(path[path.length-1]-(_defauts.cols));
				else path.push(path[path.length-1]+(_defauts.cols));
			}

			if (path[path.length-1] > target) {
				incredient = -1;
				distance = path[path.length-1] - target;
			} else {
				incredient = 1;
				distance = target - path[path.length-1];
			}

			for (var i=0; i<distance; i++) {
				path.push(path[path.length-1]+incredient);
			}

		}

		function getCurrentPath() {
			return path;
		}

		return {
			create: function() {
				create.call();
				return this;
			},
			init: function(target) {
				init.call(null, target);
				return this;
			},
			getCurrentPath: function() {
				return getCurrentPath.call();
			}
		}
	}

	function Factory(maker) {
		var Maker = maker;
		function makeObject(initialParams) {
			return (new Maker()).create().init(initialParams);
		}
		return {
			makeObject: function(initialParams) {
				return makeObject.call(null, initialParams);
			}
		}
	}

	function RandomPoints() {
		var random = [], number, store, division, count, index, temp;
		function create() {
			division = 4;
			count = _defauts.people.length;
			number = (count - (count%division))/division;
			store = range(1, count);
		}

		function init() {
			for (var i=0; i<number; i++) {
				index = Math.floor(Math.random()*count);
				random.push(store[index]);
				temp = store[index];
				store[index] = store[count-1];
				store[count-1] = temp;
				count--;
			}
		}

		function range(start, length) {
			var list = [];
			if (typeof start === 'number' && typeof length === 'number') {
				for (var i=0; i<length; i++) {
					list.push(i+start);
				}
			}
			return list;
		}

		function getCurrentPoints() {
			return random;
		}

		return {
			create: function() {
				create.call();
				return this;
			},
			init: function() {
				init.call();
				return this;
			},
			getCurrentPoints: function() {
				return getCurrentPoints();
			}
		}
	}

	function Twinkler(RandomPointsFactory, callback) {
		var cards, factory = RandomPointsFactory, latency=110;
		function shake(number) {
			if (!number) {
				if (typeof callback === 'function') callback.call();
				return false;
			}
			cards = factory.makeObject().getCurrentPoints();
			for (var i=0; i<cards.length; i++) {
				_list[cards[i]].twinkle();
			}
			number--;
			window.setTimeout(function() {
				shake.call(null, number);
			}, latency);
		}

		return {
			shake: function(number) {
				shake.call(null, number);
			}
		}
	}

	$.fn.draw =function(params) {
		_this = this;
		_keydown = new keydownHandler();
		_defauts = {cols: 5, people: []};
		if (typeof params === 'object') {
			if ((new ObjectAPI(params)).exists('cols')) {
				_defauts.cols = params.cols;
			}

			if ((new ObjectAPI(params)).exists('people') && (new ObjectAPI(params)).getType('people') === 'object') {
				_defauts.people = params.people;
			}
		}
		_defauts.cardWidth = ((_this.width() - 10*_defauts.cols) - ((_this.width() - 10*_defauts.cols)%_defauts.cols)) / _defauts.cols;
		_keydown.startListening();
		_cardFactory = new Factory(Card);
		if ($.isArray(_defauts.people) && _defauts.people.length) {
			var people = _defauts.people,
				i = _defauts.people.length;
			while (i > 0) {
				var temp,
					card,
					initialParams = {}, 
					random = Math.floor(Math.random()*(i-1));
				initialParams.id     = _defauts.people.length - (i-1);
				initialParams.width  = _defauts.cardWidth;
				initialParams.height = _defauts.cardWidth;
				initialParams.text   = _defauts.people.length - (i-1);
				initialParams.name   = people[random];
				temp = people[random];
				people[random] = people[i-1];
				people[i-1] = temp;
				card = _cardFactory.makeObject(initialParams);
				card.get().appendTo(_this);
				_list[_defauts.people.length - (i-1)] = card;
				i--;
			}
		}

		$(document).on('keydown', function(e) {
			var value, router, number = 20;
			_keydown.handle(e);
			if (!_keydown.isListening()) {
				value = _keydown.getValue();
				if (!isNaN(parseInt(value))) {
					if (typeof _list[value] !== 'undefined') {
						_pointsFactory = new Factory(RandomPoints);
						twinkler = new Twinkler(_pointsFactory, function() {
							_list[value].twinkle(function() {
								_list[value].flip();
							}, 900);
						}).shake(number);
					}
				}
				_keydown.resetValue();
				_keydown.startListening();
			}
		});
	}
});