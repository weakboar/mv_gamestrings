/*:ja
 * メモ: GameStringsプラグイン
 *
 * @plugindesc メッセージをキーとして扱い、jsonから対応する文字列を言語別に取得するプラグインです。
 * @author weakboar
 *
 * @help
 *
 * プラグインコマンド:
 *   GameStrings            # 日本語　英語　の切り替えをする。
 */

(function () {
    // サンプル用言語切替コマンド
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);

        // 言語切替
        if (command == "GameStrings") {
            if (GameStrings.language == "jp") {
                GameStrings.language = "en";
            } else {
                GameStrings.language = "jp";
            }
        }
    }
})();

// メッセージの表示をフック
Game_Interpreter.prototype.command101 = function () {
    if (!$gameMessage.isBusy()) {
        $gameMessage.setFaceImage(this._params[0], this._params[1]);
        $gameMessage.setBackground(this._params[2]);
        $gameMessage.setPositionType(this._params[3]);
        while (this.nextEventCode() === 401) {  // Text data
            this._index++;
            var message = this.currentCommand().parameters[0];
            $gameMessage.add(GameStrings.GetText(message));
        }
        switch (this.nextEventCode()) {
            case 102:  // Show Choices
                this._index++;
                this.setupChoices(this.currentCommand().parameters);
                break;
            case 103:  // Input Number
                this._index++;
                this.setupNumInput(this.currentCommand().parameters);
                break;
            case 104:  // Select Item
                this._index++;
                this.setupItemChoice(this.currentCommand().parameters);
                break;
        }
        this._index++;
        this.setWaitMode('message');
    }
    return false;
};

// GameStrings Plugins
function GameStrings() {
    throw new Error("This is a static class");
}
GameStrings.language = "jp";
var $gameText = null;
GameStrings.GetText = function (key) {
    // GameStrings.jsonをロードしてなかったらKeyをそのまま返す
    if ($gameText == null) {
        return key;
    }
    // Keyが存在したら対応文字列を返す。
    if ($gameText[key]) {
        var message = key;
        switch (GameStrings.language) {
            case "jp":
                message = $gameText[key].jp;
                break;
            case "en":
                message = $gameText[key].en;
                break;
        }
        return message;
    }
    // 見つからなかったらkeyをそのまま返す
    return key;
}

// Extend DataManager.
DataManager.loadMapData = function(mapId) {
    if (mapId > 0) {
        var filename = 'Map%1.json'.format(mapId.padZero(3));
        this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
        this.loadDataFile('$dataMap', filename);

        var mapName = DataManager.getMapName(mapId);
        this.loadMapText(mapName);
    } else {
        this.makeEmptyMap();
    }
};

DataManager.getMapName = function(mapId) {
    var mapName;
    for(var i=0; i < $dataMapInfos.length; i++) {
        if ( !$dataMapInfos[i] ) {
            continue;
        }
        if ( $dataMapInfos[i].id == mapId ) {
            mapName = $dataMapInfos[i].name;
        }
    }
    return mapName;
}

DataManager.loadMapText = function(mapName) {
    if (mapName) {
        var filename = "Translate/"+mapName+".json";
        this.loadDataFile('$gameText', filename);
    } else {
        $gameText = {};
    }
};

DataManager.isMapLoaded = function() {
    this.checkError();
    return !!$dataMap && !!$gameText;
};