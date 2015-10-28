define(['joint', 'fs', 'util'],
    function (joint, fs, util) {

        function init(graph, paper) {

            var graph = graph,
                paper = paper;

            function exportToJson() {
                var json = JSON.stringify(graph, null, 4);
                $('#log').val(json);
            }

            function exportFromJson() {
                var json = $('#log').val();
                if (!json) {
                    console.log('empty log field. Please insert JSON in log!');
                    return;
                }

                graph.fromJSON(JSON.parse(json));
                util.getCurrentId(graph);
            }

            function clearLog() {
                $('#log').val('');
                $('#server_log').val('');
            }

            function saveToJsonFile() {
                console.log('saved to file:ide.txt')
                var json = $('#log').val();
                var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
                window.saveAs(blob, 'ide.txt');
            }

            function getJsonFromServer() {
                var get_url = $('#get_url').val();
                $.ajax({
                    //url: "http://localhost:8888/getMetaData?key=goal3_led",
                    url: get_url,
                    //url: "http://localhost:8888/getMetaData?key=ide_server",
                    //url: "http://lug.pp.ciklum.com:8080/api/getMetadata?key=goal3_led",
                    // The name of the callback parameter, as specified by the YQL service
                    jsonp: "callback",

                    // Tell jQuery we're expecting JSONP
                    dataType: "jsonp",

                    // Work with the response
                    success: function (response) {
                        var $log = $('#log');
                        $log.val('');
                        $log.val(JSON.stringify(JSON.parse(response), null, 4));
                    }
                });
            }

            function convertToServerJson() {
                var ideJson = $('#log').val();
                var serverJson = util.convertIdeJsonToServerJson(ideJson, paper);
                $('#server_log').val(serverJson);
            }

            function sendJsonToServer() {
                // 1 get data
                var $serverLog = $('#server_log');
                var serverJson = $serverLog.val();

                var $log = $('#log');
                var json = $log.val();

                // 2 convert json
                if (!serverJson) {
                    json = JSON.stringify(drawControls.graph, null, 4);
                    serverJson = util.convertIdeJsonToServerJson(json, paper);
                    $serverLog.val(serverJson);
                }

                if (!json) {
                    json = JSON.stringify(drawControls.graph, null, 4);
                    $log.val(json);
                }

                // 3 add extra fields and send to server (server json)
                var post_url = $('#post_url').val();
                var server_key = $('#server_metadata_name').val();
                if (serverJson) {
                    var serverData = {
                        data: [
                            {
                                "key": server_key,
                                "metadata": JSON.stringify(JSON.parse(serverJson), null, 4)
                            }
                        ]
                    };

                    $.ajax({
                        type: "POST",
                        url: post_url,
                        data: serverData,
                        crossDomain: true,
                        success: function (response) {
                            console.log('server json sent data, response:', response);
                        },
                        dataType: 'json'
                    });
                }

                // 4 add extra fields and send to server (client json)
                if (json) {
                    var jsonData = JSON.parse(json);
                    if (jsonData.cells.length == 0)
                        return;

                    var client_key = $('#client_metadata_name').val();
                    var data = {
                        data: [
                            {
                                "key": client_key,
                                "metadata": JSON.stringify(jsonData, null, 4)
                            }
                        ]
                    };

                    $.ajax({
                        type: "POST",
                        url: post_url,
                        data: data,
                        crossDomain: true,
                        success: function (response) {
                            console.log('client json sent data, response:', response);
                        },
                        dataType: 'json'
                    });
                }
            }

            $('#btn_to_json').click(exportToJson);
            $('#btn_from_json').click(exportFromJson);
            $('#btn_clear_log').click(clearLog);
            $('#btn_save_to_json_file').click(saveToJsonFile);
            $('#btn_from_json_server').click(getJsonFromServer);
            $('#btn_to_json_server').click(convertToServerJson);
            $('#btn_to_json_server_send').click(sendJsonToServer);
        }

        return {
            init: init
        }
    });
