define([ 'joint', 'joint.shapes.devs', 'const', 'image!angular/joint/images/male.png' ], function (joint, Shapes, lugConst, male) {
  function initControls(graph, paper, HtmlShapes) {
	//var c1 = new Shapes.Coupled({
	//    position: {x: 45, y: 5},
	//    size: {width: 100, height: 50},
	//    inPorts: ['in1', 'in2'],
	//    outPorts: ['out1', 'out2'],
	//    attrs: {
	//        text: {text: 'Logic'}
	//    }
	//});
	//
	//var a1 = new Shapes.Atomic({
	//    position: {x: 45, y: 65},
	//    size: {width: 100, height: 50},
	//    inPorts: ['a', 'b'],
	//    outPorts: ['x', 'y'],
	//    attrs: {
	//        text: {text: 'AND/NAND'}
	//    }
	//});

	var root = new Shapes.Atomic({
	  position: { x: 45, y: 5 },
	  size: { width: 160, height: 80 },
	  outPorts: [ 'red', 'green' ],
	  attrs: {
		image: { 'xlink:href': male.src },
		'.label1': { text: 'Root node' },
		'.label2': { text: 'Some text' },
		'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
		'.outPorts circle': { fill: '#E74C3C', type: 'output' },
		custom_attrs: {
		  can_id: 100
		}
	  }
	});

	var child = new Shapes.Atomic({
	  position: { x: 45, y: 155 },
	  size: { width: 160, height: 80 },
	  inPorts: [ 'blue' ],
	  outPorts: [ 'red', 'green' ],
	  attrs: {
		image: { 'xlink:href': male.src },
		'.label1': { text: 'Root node' },
		'.label2': { text: 'Some text' },
		'.inPorts circle': { fill: '#16A085', magnet: 'passive', type: 'input' },
		'.outPorts circle': { fill: '#E74C3C', type: 'output' },
		custom_attrs: {
		  can_id: 100
		}
	  }
	});

	var in2 = new Shapes.Atomic({
	  position: { x: 45, y: 65 },
	  size: { width: 100, height: 50 },
	  inPorts: [ 'in' ],
	  attrs: {
		text: { text: 'block_logger' }
	  }
	});

	var block_divide = new Shapes.Atomic({
	  position: { x: 45, y: 125 },
	  size: { width: 100, height: 50 },
	  inPorts: [ 'c', 'd' ],
	  outPorts: [ 'out' ],
	  attrs: {
		text: { text: 'block_divide' },
		custom_attrs: {
		  output_type: 'int',
		  d: 1000
		}
	  }
	});

	var can_tx = new Shapes.Atomic({
	  position: { x: 45, y: 185 },
	  size: { width: 100, height: 50 },
	  inPorts: [ 'in' ],
	  attrs: {
		text: { text: 'can_tx' },
		custom_attrs: {
		  can_id: 101
		}
	  }
	});

	var block_pwm_gpio = new Shapes.Atomic({
	  position: { x: 75, y: 245 },
	  size: { width: 130, height: 50 },
	  inPorts: [ 'period', 'up_time' ],
	  attrs: {
		text: { text: 'block_pwm_gpio' },
		custom_attrs: {
		  period: 27,
		  up_time: 15,
		  pin: 191
		}
	  }
	});

	var block_http_post = new Shapes.Atomic({
	  position: { x: 85, y: 305 },
	  size: { width: 125, height: 50 },
	  inPorts: [ "led_pwm", "adc_value" ],
	  attrs: {
		text: { text: 'block_http_post' },
		custom_attrs: {
		  "url": "http://lug.pp.ciklum.com",
		  "period": 500
		}
	  }
	});

	var block_adc = new Shapes.Atomic({
	  position: { x: 45, y: 365 },
	  size: { width: 120, height: 50 },
	  outPorts: [ "out" ],
	  attrs: {
		text: { text: 'block_adc' },
	  }
	});

	var html = new HtmlShapes.Element({
	  position: { x: 15, y: 425 },
	  size: { width: 170, height: 100 },
	  label: 'I am HTML',
	  select: 'one'
	});

	var member = new Shapes.Member({
	  position: { x: 15, y: 530 },
	  size: { width: 170, height: 100 },
	  attrs: {
		image: { 'xlink:href': male.src },
		'.card': {
		  fill: '#7c68fd'
		},
		'.rank': {
		  text: 'CEO'
		},
		'.name': { text: 'KOIU' }
	  }
	});

	var memberCustom = new Shapes.MemberCustom({
	  position: { x: 15, y: 530 },
	  size: { width: 170, height: 100 },
	  inPorts: [ 'period', 'up_time' ],
	  attrs: {
		image: { 'xlink:href': male.src },
		'.card': {
		  fill: '#7c68fd'
		},
		'.rank': {
		  text: 'CEO'
		},
		'.name': { text: 'KOIU' }
	  }
	});

	graph.addCells([
	  root,
	  child,
	  memberCustom
	]);
  }

  function loadUrlParams() {
	var hash = location.hash;
	var items = hash.split('&');
	if (!items || items.length === 0) return;

	var values = {};
	items.forEach(function (item) {
	  var kv = item.split('=');
	  values[ kv[ 0 ].replace('#', '') ] = kv[ 1 ];
	});

	window.lugIDE = window.lugIDE || {};
	window.lugIDE.mode = values[ lugConst.MODE ];
	window.lugIDE.data = values[ lugConst.DATA ];

	if (window.lugIDE.mode === lugConst.MODE_DEVELOPMENT) {
	  $('#get_url').val(lugConst.URL_GET_DEV);
	  $('#post_url').val(lugConst.URL_POST_DEV);
	}
	else {
	  $('#get_url').val(lugConst.URL_GET_DEMO);
	  $('#post_url').val(lugConst.URL_POST_DEMO);
	}

	refreshLayout();
  }

  function refreshLayout() {
	var demo = [ 'btn_deploy', 'btn_load' ];
	var dev = [
	  'btn_to_json',
	  'btn_from_json',
	  'btn_from_json_server',
	  'btn_to_json_server_send',
	  'btn_to_json_server',
	  'btn_save_to_json_file',
	  'btn_clear_log'
	];

	demo.forEach(function (item) {
	  if (window.lugIDE.mode === lugConst.MODE_DEVELOPMENT) {
		$('#' + item).css('visibility', 'hidden');
	  } else {
		$('#' + item).css('visibility', 'visible');
	  }
	});
	dev.forEach(function (item) {
	  if (window.lugIDE.mode === lugConst.MODE_DEVELOPMENT) {
		$('#' + item).css('visibility', 'visible');
	  } else {
		$('#' + item).css('visibility', 'hidden');
	  }
	});
  }

  function initFields() {
	var $serverKey = $(lugConst.$APP_METADATA_KEY);
	var $ideKey = $(lugConst.$IDE_METADATA_KEY);

	$ideKey.on('change keyup paste', function () {
	  $serverKey.val($(this).val().replace('ide_', ''));
	});

	$ideKey.val(lugConst.IDE_METADATA_KEY);
	$serverKey.val(lugConst.APP_METADATA_KEY);

	loadUrlParams();
	$(window).on('hashchange', loadUrlParams);
  }

  return {
	initControls: initControls,
	initFields: initFields
  };
});