var Rotator = function (options) {
  var self = this;

	options = $.extend({
		container: $('body'),
		orbitRadiusPercentage: 25,
		orbitHeightPercentage: 7,
		orbitPerspectivePercentage: 60, /* Faking it, slides at the further end will be scaled this much */
	}, options);

	var angle = 0;
	var lastAngle = undefined;

	var targetAngle = undefined;
	var targetStartAngle = undefined;
	var targetStartTime = undefined;

	var startAngle = undefined;

	var $container = $(options.container);
	var $slides = $container.find('.slide');

	var twoPi = 2 * Math.PI;
	var angleStep = twoPi / $slides.length;

	var panning = false;
	var lastDeltaX = undefined;

	var render = function () {
		var stageWidth = $container.width();
		var stageHeight = $container.height();

		var orbitWidth = stageWidth * options.orbitRadiusPercentage * 0.01;
		var orbitHeight = stageHeight * options.orbitHeightPercentage * 0.01;

		var currentAngle = angle;

		$slides.each(function () {
			var x = orbitWidth * Math.sin(currentAngle);
			var y = orbitHeight * Math.cos(currentAngle);

			var a = currentAngle;
			while (a >= twoPi) {
				a -= twoPi;
			}
			while (a < 0) {
				a += twoPi;
			}

			if (a > Math.PI) {
				a = twoPi - a;
			}

			var scaleFactor = 1 - options.orbitPerspectivePercentage * 0.01 * a / Math.PI;

      this.style.zIndex = (10000 * scaleFactor) | 0;
      this.style.transform = 'translate3d(' + (x) + 'px, ' + (y) + 'px, 0px) scale3d(' + scaleFactor+ ', ' + scaleFactor + ', 1)';

			if (options.onRender) {
				options.onRender($(this), a / Math.PI, currentAngle);
			}

			currentAngle += angleStep;
		});
	};

	var resize = function () {
		render();
	};

	// t: current time, b: beginning value, c: change in value, d: duration
	var easing = function (t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	};

	var repaint = function () {
		if (targetAngle !== undefined && !panning) {
			var now = new Date().getTime();
			var duration = 1000;

			angle = easing(now - targetStartTime, angle, targetAngle - angle, duration);

			if (now > targetStartTime + duration) {
				angle = targetAngle;
				targetAngle = undefined;
			}
		}

    if (options.tick) {
      options.tick(self);
    }

		if (lastAngle !== angle) {
			render();
			lastAngle = angle;
		}

		setTimeout(repaint, 10);
	};

	var onPan = function (e) {
		var stageWidth = $container.width();
		var orbitWidth = stageWidth * options.orbitRadiusPercentage * 0.01;

		if (lastDeltaX !== undefined) {
			var dx = e.deltaX - lastDeltaX;
			if (Math.abs(dx) < orbitWidth * 0.25) {
				angle += Math.asin(dx / orbitWidth);
			}
		}

		lastDeltaX = e.deltaX;
	};

	var onPanStart = function () {
		panning = true;
		lastDeltaX = undefined;
		startAngle = angle;
	};

	var onPanEnd = function () {
		panning = false;

		if (angle > startAngle) {
			if (angle >= startAngle + angleStep) {
				targetAngle = Math.round(angle / angleStep) * angleStep;
			} else {
				targetAngle = Math.round(startAngle / angleStep) * angleStep + angleStep;
			}
		} else {
			if (angle >= startAngle + angleStep) {
				targetAngle = Math.round(angle / angleStep) * angleStep;
			} else {
				targetAngle = Math.round(startAngle / angleStep) * angleStep - angleStep;
			}
		}

		targetStartTime = new Date().getTime();
		targetStartAngle = angle;
	};

	var init = function () {
		$(window).on('resize', resize);

		var containerElement = options.container.get(0);
		var hammer = new Hammer(containerElement);

		hammer.on('panstart', onPanStart);
		hammer.on('panend', onPanEnd);
		hammer.on('panleft panright', onPan);

		repaint();
	};

  // Autorotation.
  this.getCurrentAngle = function () {
    return angle;
  };

  this.setCurrentAngle = function (a) {
    angle = a;
  };

  this.getAngleStep = function () {
    return angleStep;
  };

  this.setTargetAngle = function (a) {
    targetStartTime = new Date().getTime();
    targetStartAngle = angle;
    targetAngle = a;
  };

  this.isPanning = function () {
    return panning;
  };

	init();
	render();
};

$(function () {
	var carousel = new Rotator({
		container: $('.carousel'),

		onRender: function ($slide, frontToBack) {
			var blur = frontToBack * frontToBack * 30;

			$slide.find('.img').css({
				'-webkit-filter': 'blur(' + blur + 'px)'
			});

			var o = frontToBack > 0.4 ? 1 : frontToBack / 0.4;
			var opacity = (1 - o) * 0.8 + 0.2;

			$slide.find('.text').css({
				opacity: opacity
			});

			o = frontToBack > 0.2 ? 1 : frontToBack / 0.2;
			opacity = (1 - o);

			var $action = $slide.find('.action');

			var visible = $action.data('visible');
			if (!visible && opacity > 0) {
				$action.find('.blip').velocity({
					scaleX: 2,
					scaleY: 2
				}, {
					easing: 'easeOutCubic',
            duration: 300,
					complete: function () {
						$action.find('.blip').velocity({
							scaleX: 1,
							scaleY: 1
						}, {
							easing: [500, 20]
						});
					}
				});

				$action.data('visible', true);
			}
			if (opacity < 0.0000001) {
				$action.data('visible', false);
			}

			$action.css({
				opacity: opacity
			}).toggle(opacity > 0);
		},

    tick: function (carousel) {
      if (!carousel.isPanning()) {
        carousel.setCurrentAngle(
          carousel.getCurrentAngle() - 0.001
        );
      }
    }
	});

  // Autorotation.
  /*
  setInterval(function () {
      if (!carousel.isPanning()) {
        carousel.setTargetAngle(
          carousel.getCurrentAngle() - carousel.getAngleStep()
        );
      }
    }, 3000);
  */

	$('.action').each(function () {
		new Hammer(this).on('tap', function () {
			location.href = "vue-carousel-3d/open.html";
		});
	});
});



var vid = document.getElementById("bgvid");
var pauseButton = document.querySelector("#polina button");

if (window.matchMedia('(prefers-reduced-motion)').matches) {
    vid.removeAttribute("autoplay");
    vid.pause();
    pauseButton.innerHTML = "Paused";
}

function vidFade() {
  vid.classList.add("stopfade");
}

vid.addEventListener('ended', function()
{
// only functional if "loop" is removed
vid.pause();
// to capture IE10
vidFade();
});
