define([ 'util' ], function (util) {
	function initDragging(joint, graphDrawing, paperDrawing) {
		var newElement = null,
			bodyJq = null,
			bufferControl = null;

		var ClickableView = joint.dia.ElementView.extend({
			pointerdown: function () {
				this._click = true;
				joint.dia.ElementView.prototype.pointerdown.apply(this, arguments);
			},
			pointermove: function () {
				this._click = false;
				joint.dia.ElementView.prototype.pointermove.apply(this, arguments);
			},
			pointerup: function (evt, x, y) {
				if (this._click) {
					this.notify('cell:click', evt, x, y);
				} else {
					joint.dia.ElementView.prototype.pointerup.apply(this, arguments);
				}
			}
		});

		var paper = $('#paperControls');
		var graphControls = new joint.dia.Graph;
		var paperControls = new joint.dia.Paper({
			el: paper,
			width: paper.width(),
			height: paper.height(),
			model: graphControls,
			gridSize: 1,
			elementView: ClickableView,
			interactive: false
		});


		var graphBuffer, paperBuffer;

		function allowDragDrop(event) {
			if (!event) return false;

			var offset = paperDrawing.$el.offset();
			var x = event.pageX, y = event.pageY;

			if (x >= offset.left && x <= offset.left + paperDrawing.$el.width()) {
				if (y >= offset.top && y <= offset.top + paperDrawing.$el.height())
					return true;
			}

			return false;
		}

		paperControls.on('cell:pointermove', function (cellView, evt, x, y) {
			bodyJq.bind('mousemove', function (e) {

				if (!cellView.model || !(cellView.model.getBBox instanceof Function)) return;

				if (!bufferControl) {
					bufferControl = $("div.box");
					bufferControl.css('visibility', 'visible');
				}

				var mouseX = e.pageX - cellView.model.getBBox().width / 2;
				var mouseY = e.pageY - cellView.model.getBBox().height / 2;
				bufferControl.offset({ top: mouseY, left: mouseX });
			});
		});

		paperControls.on('cell:pointerup', function (cellView, evt, x, y) {
			if (!allowDragDrop(evt)) {
				clearBufferData();
				return;
			}

			// clear buffer element
			if (!newElement) return;

			var el = newElement.clone();
			var bbox = el.getBBox();

			el.position(
				evt.clientX - bbox.width / 2 - paperDrawing.$el.offset().left,
				evt.clientY - bbox.height / 2 - paperDrawing.$el.offset().top + document.body.scrollTop);

			util.setId(graphDrawing, el);
			el.set('ref_block_id', newElement.attributes.uuid);
			graphDrawing.addCells([ el ]);
			util.showElementPorts(paperDrawing, el);
			clearBufferData();
		});

		paperControls.on('cell:pointerdown', function (cellView, evt, x, y) {
			if (newElement) return;

			newElement = cellView.model.clone();
			if (!(newElement.position instanceof Function)) return;

			bodyJq = bodyJq || $('body');
			bodyJq.append('<div id="paperBuffer" class="box" style="z-index: 100;display:block;opacity:.7; visibility: hidden"></div>');

			newElement.position(0, 0);

			graphBuffer = new joint.dia.Graph;
			paperBuffer = new joint.dia.Paper({
				el: $('#paperBuffer'),
				width: paperControls.options.width,
				height: paperControls.options.height,
				model: graphBuffer,
				gridSize: 1
			});
			graphBuffer.addCells([ newElement ]);
		});

		function clearBufferData() {
			if (bodyJq) {
				bodyJq.off('mousemove');
			}

			newElement.remove();
			newElement = null;

			if (bufferControl) {
				bufferControl.remove();
				bufferControl = null;
			}

			if (paperBuffer) {
				paperBuffer.remove();
				graphBuffer.clear();
			}
		}

		return {
			graph: graphControls,
			paper: paperControls
		}
	}

	return {
		init: initDragging
	}
});
