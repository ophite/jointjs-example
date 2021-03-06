define(['joint', 'fs', 'util', 'const'],
    function (joint, fs, util, lugConst) {

        function init(graph, paper) {

            var graph = graph,
                paper = paper;

            function exportToJson() {
                var json = JSON.stringify(graph, null, 4);
                $('#log').val(json);
            }

            function importFromJson() {
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

            function getJsonFromServer(callback) {
                var getUrl = $('#get_url').val() + $(lugConst.$IDE_METADATA_KEY).val();
                var dataType = window.lugIDE.data === lugConst.DATA_JSONP ? 'jsonp' : 'json';
                var jsonpCallback = window.lugIDE.data === lugConst.DATA_JSONP ? 'callback' : undefined;

                $.ajax({
                    url: getUrl,
                    // The name of the callback parameter, as specified by the YQL service
                    jsonp: jsonpCallback,

                    // Tell jQuery we're expecting JSONP
                    dataType: dataType,

                    // Work with the response
                    success: function (response) {
                        var $log = $('#log');
                        $log.val('');
                        //var beatyData = JSON.stringify(response, null, 4);
                        var beatyData = JSON.stringify(JSON.parse(JSON.stringify(response)), null, 4);
                        //var beatyData = JSON.stringify(JSON.parse(response), null, 4);

                        $log.val(beatyData);
                        alert('success get data');
                        if (callback && typeof callback === 'function') callback();
                    },
                    error: function (error) {
                        alert('error get data');
                        console.log('server json get data, response:', error);
                    }
                });
            }

            function convertToServerJson() {
                var $log = $('#log');
                var json = $log.val();
                if (!json) {
                    json = JSON.stringify(drawControls.graph, null, 4);
                    $log.val(json);
                }

                var serverJson = util.convertIdeJsonToServerJson(json, paper);
                $('#server_log').val(serverJson);
            }

            function postData(key, metadata, msgSuccess, msgError) {
                var postUrl = $('#post_url').val();
                var data = {
                    data: [
                        {
                            "key": key,
                            "metadata": metadata
                        }
                    ]
                };

                var crossDomain = window.lugIDE.mode !== lugConst.MODE_DEMO ? true : false;

                $.ajax({
                    url: postUrl,
                    type: "POST",
                    data: JSON.stringify(data),
                    crossDomain: crossDomain,
                    contentType: "application/json",
                    complete: function(data) {
                        if (data &&
                            data.responseJSON &&
                            data.responseJSON.result === 'SUCCESS') {
                            alert(msgSuccess);
                        }
                        else {
                            alert(msgError);
                        }
                        console.log(key + ' response:', data.responseJSON);
                    }
                });
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
                var serverKey = $(lugConst.$APP_METADATA_KEY).val();
                if (serverJson) {
                    postData(
                        serverKey,
                        JSON.parse(serverJson),
                        //JSON.stringify(JSON.parse(serverJson), null, 4),
                        'success send data (server json)',
                        'error send data (server json). See console for detail');
                }

                // 4 add extra fields and send to server (client json)
                if (json) {
                    var jsonData = JSON.parse(json);
                    if (jsonData.cells.length == 0)
                        return;

                    var clientKey = $(lugConst.$IDE_METADATA_KEY).val();
                    postData(
                        clientKey,
                        jsonData,
                        //JSON.stringify(jsonData, null, 4),
                        'success send data (client json)',
                        'error send data (client json). See console for detail');
                }
            }

            $('#btn_to_json').click(exportToJson);
            $('#btn_from_json').click(importFromJson);
            $('#btn_clear_log').click(clearLog);
            $('#btn_save_to_json_file').click(saveToJsonFile);
            $('#btn_from_json_server').click(getJsonFromServer);
            $('#btn_to_json_server').click(convertToServerJson);
            $('#btn_to_json_server_send').click(sendJsonToServer);

            function deploy() {
                clearLog();
                sendJsonToServer();
            }

            function load() {
                clearLog();
                getJsonFromServer(importFromJson);
            }

            $('#btn_deploy').click(deploy);
            $('#btn_load').click(load);
        }

        return {
            init: init
        }
    });
