
riot.tag2('app', '<section class="container"> <h3>お祈り計算v4 <small>(更新:{document.lastModified})</small></h3> <jst></jst> <div class="row"> <div class="col-md-4"> <div id="gnav"> <div id="layer"> <div class="row"> <div class="col-xs-6"> <button class="btn-block alert alert-warning" value="0" tabindex="0" onclick="{toggle}"> <p class="text-left">左上({min[0]}分)</p> <p class="text-left"><strong>{prayed[0]}</strong></p> </button> </div> <div class="col-xs-6"> <button class="btn-block alert alert-danger" value="1" tabindex="0" onclick="{toggle}"> <p class="text-left">右上({min[1]}分)</p> <p class="text-left"><strong>{prayed[1]}</strong></p> </button> </div> </div> <div class="row"> <div class="col-xs-6 col-xs-offset-3"> <button class="btn-block alert alert-default" value="2" tabindex="0" onclick="{toggle}"> <p class="text-left">ゲート({min[2]}分)</p> <p class="text-left"><strong>{prayed[2]}</strong></p> </button> </div> </div> <div class="row"> <div class="col-xs-6"> <button class="btn-block alert alert-info" value="3" tabindex="0" onclick="{toggle}"> <p class="text-left">左下({min[3]}分)</p> <p class="text-left"><strong>{prayed[3]}</strong></p> </button> </div> <div class="col-xs-6"> <button class="btn-block alert alert-success" value="4" tabindex="0" onclick="{toggle}"> <p class="text-left">右下({min[4]}分)</p> <p class="text-left"><strong>{prayed[4]}</strong></p> </button> </div> </div> </div> </div> <div show="{show[0]}"> <prpanel ptitle="左上" pcolor="panel-warning" pnum="0"></prpanel> </div> <div show="{show[1]}"> <prpanel ptitle="右上" pcolor="panel-danger" pnum="1"></prpanel> </div> <div show="{show[2]}"> <gtpanel ptitle="ゲート" pcolor="panel-default" pnum="2"></gtpanel> </div> <div show="{show[3]}"> <prpanel ptitle="左下" pcolor="panel-info" pnum="3"></prpanel> </div> <div show="{show[4]}"> <prpanel ptitle="右下" pcolor="panel-success" pnum="4"></prpanel> </div> </div> <div class="col-md-8"> <gtdesc></gtdesc> <gpdesc></gpdesc> </div> </div> </section>', 'app .alert-default,[data-is="app"] .alert-default{ background-color: #f5f5f5; border-color: #ddd; } app #gnav,[data-is="app"] #gnav{ background: url("ettaso.jpeg") no-repeat center center; background-size: contain; } app #layer,[data-is="app"] #layer{ background-color: rgba(255,255,255,0.5); }', '', function(opts) {
"use strict";

var _this = this;

this.show = [false, false, true, false, false];
this.min = ["-", "-", "-", "-", "-"];
this.prayed = ["タップしてね", "タップしてね", "タップしてね", "タップしてね", "タップしてね"];
this.clockmin = "";

this.on('mount', function () {
    console.log('app.tag mounted', opts);
});

this.toggle = function (e) {
    this.show = [false, false, false, false, false];
    var num = Number(e.currentTarget.value);
    this.show[num] = true;
};
obs.on("oncalc", function (pnum, pray) {
    var num = Number(pnum);
    _this.prayed[num] = pray.toLocaleString() + "%";
    _this.min[num] = _this.clockmin;
    _this.update();
});
obs.on('onclock', function (clockmin) {
    _this.clockmin = clockmin;
});
});

riot.tag2('gpdesc', '<div class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title">ゲート保有GP: <strong>{gpValue}GP</strong></h4> </div> <div class="panel-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label>役職補正</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{sally}"> <input type="radio" name="sallyRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>クリア(分)</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{lapMin}"> <input type="radio" name="lapMinRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>クリア(秒)</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{lapSec}"> <input type="radio" name="lapSecRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group" show="{iscontinue}"> <label>コンテ数</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{contNum}"> <input type="radio" name="contNumRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitGP"></select> </fieldset> </form> </div> </div>', '', '', function(opts) {
"use strict";

var self = this;
self.iscontinue = false;
self.selectizedGP = [];
self.gpValue = "-";
self.objGp = {
    sRadio: [],
    lmRadio: [],
    lsRadio: [],
    cnRadio: [],
    dGp: 0
};
self.sally = [{ text: "1.0%", value: "0.01", isactive: false }, { text: "1.5%", value: "0.015", isactive: false }, { text: "2.0%", value: "0.02", isactive: true }, { text: "2.5%", value: "0.025", isactive: false }, { text: "3.0%", value: "0.03", isactive: false }];
self.lapMin = [{ text: "5", value: "0", isactive: true }, { text: "6", value: "60", isactive: false }, { text: "7", value: "120", isactive: false }, { text: "8", value: "180", isactive: false }, { text: "9", value: "240", isactive: false }, { text: "10", value: "300", isactive: false }];
self.lapSec = [{ text: "00", value: "0", isactive: true }, { text: "15", value: "15", isactive: false }, { text: "30", value: "30", isactive: false }, { text: "45", value: "45", isactive: false }];
self.contNum = [{ text: "0", value: "1.00", isactive: true }, { text: "1", value: "0.95", isactive: false }, { text: "2", value: "0.90", isactive: false }, { text: "3", value: "0.85", isactive: false }, { text: "4", value: "0.80", isactive: false }, { text: "5", value: "0.75", isactive: false }, { text: "6", value: "0.70", isactive: false }, { text: "7", value: "0.65", isactive: false }, { text: "8", value: "0.60", isactive: false }];
function setValue() {
    var gValue = getgtValue({
        sValue: self.objGp.sRadio.value,
        cnValue: self.objGp.cnRadio.value,
        lmValue: self.objGp.lmRadio.value,
        lsValue: self.objGp.lsRadio.value,
        dGp: self.objGp.dGp
    });
    self.gpValue = numToString(gValue);
    self.update();
}
function getgtValue(_ref) {
    var sValue = _ref.sValue,
        cnValue = _ref.cnValue,
        lmValue = _ref.lmValue,
        lsValue = _ref.lsValue,
        dGp = _ref.dGp;

    var cleartime = 300 - lmValue - lsValue;
    if (cleartime < 0) cleartime = 0;
    var tb = 1 + 0.201 * cleartime / 300;
    return (dGp - 1000) / tb / sValue / cnValue;
}
function formatDigit(val, dig) {
    return val * Math.pow(10, dig - String(val).length);
}
function numToString(num) {
    var strarr = num.toString().split('.');
    strarr[0] = Number(strarr[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return strarr[0];
}
self.on('mount', function () {
    self.objGp.sRadio = self.refs.formref.sallyRadio;
    self.objGp.lmRadio = self.refs.formref.lapMinRadio;
    self.objGp.lsRadio = self.refs.formref.lapSecRadio;
    self.objGp.cnRadio = self.refs.formref.contNumRadio;
    self.objGp.sRadio.value = "0.02";
    self.objGp.lmRadio.value = "0";
    self.objGp.lsRadio.value = "0";
    self.objGp.cnRadio.value = "1.00";

    $(function () {
        self.selectizedGP = $(self.refs.formref.digitGP).selectize({
            options: [],
            valueField: "value",
            labelField: "text",
            searchField: ["value"],
            placeholder: "獲得したGP",
            load: function load(query, callback) {
                if (!query.length) return callback();
                query = Number(query);
                callback([{ text: formatDigit(query, 4).toLocaleString(), value: formatDigit(query, 4) }, { text: formatDigit(query, 5).toLocaleString(), value: formatDigit(query, 5) }, { text: formatDigit(query, 6).toLocaleString(), value: formatDigit(query, 6) }, { text: formatDigit(query, 7).toLocaleString(), value: formatDigit(query, 7) }, { text: formatDigit(query, 8).toLocaleString(), value: formatDigit(query, 8) }, { text: formatDigit(query, 9).toLocaleString(), value: formatDigit(query, 9) }, { text: formatDigit(query, 10).toLocaleString(), value: formatDigit(query, 10) }]);
            },
            onChange: function onChange(gp) {
                self.objGp.dGp = Number(gp);
                setValue();
            }
        });
        $(self.objGp.sRadio).change(function () {
            setValue();
        });
        $(self.objGp.lmRadio).change(function () {
            setValue();
        });
        $(self.objGp.lsRadio).change(function () {
            setValue();
        });
        $(self.objGp.cnRadio).change(function () {
            setValue();
        });
    });
});
});

riot.tag2('gtdesc', '<div class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title">ゲート詳細(祈り: {pray.toLocaleString()}%)</h4> </div> <div class="panel-body"> <form ref="listref"> <label class="checkbox-inline" each="{list}"> <input type="checkbox" riot-value="{index}" checked="{checked}" onclick="{parent.toggle}"> {index} </label> <table class="table" ref="tableref"> <thead> <tr> <th each="{item in tablelist}">{item.index}</th> </tr> </thead> <tbody> <tr each="{seed in gtseed}"> <th each="{item in tablelist}">{seed[item.seedid]}</th> </tr> </tbody> </table> </form> </div> </div>', '', '', function(opts) {
"use strict";

var _this = this;

this.list = [{ index: "名前", seedid: "name", checked: true }, { index: "リーチ", seedid: "reach", checked: true }, { index: "範囲", seedid: "range", checked: false }, { index: "段数", seedid: "cmb", checked: false }, { index: "外皮", seedid: "skin", checked: true }, { index: "予想体力(1.75)", seedid: "midhp", checked: false }];
this.pray = 0;
this.gtseed = [];
this.tablelist = createlist(this.list);
function createlist(list) {
    return list.filter(function (l) {
        return l.checked === true;
    });
}
this.toggle = function (e) {
    var item = e.item;
    item.checked = !item.checked;
    _this.tablelist = createlist(_this.list);
    _this.update();
};
obs.on("oncalc", function (pnum, pray) {
    if (pnum === "2") {
        _this.pray = pray;
        _this.gtseed = calchp(_this.gtseed, _this.pray);
        _this.update();
    }
});
obs.on("onselect", function (selected) {
    _this.gtseed = calchp(selected, _this.pray);
    _this.update();
});
function calchp() {
    var seed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { hp: 0, size: 1.72 };
    var pray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var scale = [1.0, 1.2, 1.4, 1.6, 1.8];
    return seed.map(function (s, index) {
        s.midhp = numToString(s.hp / s.size * 1.750 * (1 + pray / 100) * scale[index]);
        return s;
    });
}
function numToString(num) {
    var strarr = num.toString().split('.');
    strarr[0] = Number(strarr[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return strarr[0];
}
});

riot.tag2('gtpanel', '<div class="panel {opts.pcolor}"> <div class="panel-heading"> <h4 class="panel-title">{opts.ptitle}: <strong>{prayed}%</strong> ({minUpdated}分)</h4> </div> <div class="panel-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group" hide="{true}"> <label>wave</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{wave}"> <input type="radio" name="waveRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>サイズ</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{size}"> <input type="radio" name="sizeRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>属性</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{elem}"> <input type="radio" name="elemRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <select class="form-control" ref="seedref" placeholder="シード名(5体まで)"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" ref="digitref" placeholder="体力"></select> </fieldset> </form> </div> </div>', 'gtpanel .panel-heading,[data-is="gtpanel"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
"use strict";

var self = this;
self.prayed = "-";
self.clockmin = "";
self.minUpdated = "-";
self.eRadio = [];
self.sRadio = [];
self.wRadio = [];
self.seedFiltered = [];
self.seedArr = [];
self.seedHp = 0;
self.seedSelectized = [];
self.digitSelectized = [];
self.wave = [{ text: "1体目", isactive: true, value: 1.0 }, { text: "2体目", isactive: false, value: 1.2 }, { text: "3体目", isactive: false, value: 1.4 }, { text: "4体目", isactive: false, value: 1.6 }, { text: "5体目", isactive: false, value: 1.8 }];
self.size = [{ text: "1.72", isactive: false, value: 1.72 }, { text: "1.75", isactive: true, value: 1.75 }, { text: "1.80", isactive: false, value: 1.80 }, { text: "1.00", isactive: false, value: 1.00 }];
self.elem = [{ text: "すべて", isactive: true, value: "all" }, { text: "炎", isactive: false, value: "fire" }, { text: "水", isactive: false, value: "water" }, { text: "風", isactive: false, value: "wind" }, { text: "光", isactive: false, value: "light" }, { text: "闇", isactive: false, value: "dark" }];

function setFilter() {
    if (self.eRadio.value === "all") {
        self.seedFiltered = seedDef;
    } else {
        self.seedFiltered = seedDef.filter(function (s) {
            return s.elm === self.eRadio.value;
        });
    }
    refresh(self.seedSelectized, self.seedFiltered);
}
function refresh(selectized, option) {
    var control = selectized[0].selectize;
    control.clearOptions();
    control.addOption(option);
    control.refreshOptions();
}
function setSeedM(seed) {
    var arr = [];

    var _loop = function _loop(l) {
        var obj = seedDef.filter(function (s) {
            return s.name === seed[l];
        })[0];
        arr[l] = obj;
    };

    for (var l = 0; l < seed.length; l++) {
        _loop(l);
    }
    if (arr) {
        self.seedArr = arr;
    }
    obs.trigger("onselect", self.seedArr);
}
function setVal() {
    var pray = calcPray({
        seedhp: self.seedArr[0].hp,
        seedsize: self.seedArr[0].size,
        inputhp: self.seedHp,
        scale: self.sRadio.value,
        wave: self.wRadio.value
    });
    if (pray > 0) {
        self.prayed = pray.toLocaleString();
    } else {
        self.prayed = "0";
    }
    self.minUpdated = self.clockmin;
    obs.trigger("oncalc", opts.pnum, pray);
    self.update();
}
function formatDigit(val, dig) {
    return val * Math.pow(10, dig - String(val).length);
}
function calcPray(_ref) {
    var _ref$seedhp = _ref.seedhp,
        seedhp = _ref$seedhp === undefined ? 0 : _ref$seedhp,
        _ref$seedsize = _ref.seedsize,
        seedsize = _ref$seedsize === undefined ? 1.72 : _ref$seedsize,
        inputhp = _ref.inputhp,
        scale = _ref.scale,
        wave = _ref.wave;

    return Math.round((inputhp / (seedhp / seedsize * scale) - 1) * 100 / wave);
}
obs.on('onclock', function (clockmin) {
    self.clockmin = clockmin;
});

self.on('mount', function () {
    self.wRadio = self.refs.formref.waveRadio;
    self.sRadio = self.refs.formref.sizeRadio;
    self.eRadio = self.refs.formref.elemRadio;
    self.wRadio[0].checked = true;
    self.sRadio[1].checked = true;
    self.eRadio[0].checked = true;
    self.seedFiltered = seedDef;
    $(function () {
        self.seedSelectized = $(self.refs.seedref).selectize({
            options: self.seedFiltered,
            valueField: "name",
            labelField: "name",
            searchField: ["extname"],
            maxItems: 5,
            placeholder: "シード名",
            onChange: function onChange(seed) {
                setSeedM(seed);
                setVal();
            }
        });
        $(self.wRadio).change(function () {
            setVal();
        });
        $(self.sRadio).change(function () {
            setVal();
        });
        $(self.eRadio).change(function () {
            setFilter();
        });
        self.digitSelectized = $(self.refs.digitref).selectize({
            options: [],
            valueField: "value",
            labelField: "text",
            searchField: ["value"],
            placeholder: "体力",
            load: function load(query, callback) {
                if (!query.length) return callback();
                query = Number(query);
                callback([{ text: formatDigit(query, 6).toLocaleString(), value: formatDigit(query, 6) }, { text: formatDigit(query, 7).toLocaleString(), value: formatDigit(query, 7) }, { text: formatDigit(query, 8).toLocaleString(), value: formatDigit(query, 8) }, { text: formatDigit(query, 9).toLocaleString(), value: formatDigit(query, 9) }, { text: formatDigit(query, 10).toLocaleString(), value: formatDigit(query, 10) }]);
            },
            onChange: function onChange(hp) {
                self.seedHp = Number(hp);
                setVal();
            }
        });
    });
});
});

riot.tag2('jst', '<h4>現在時刻: {clock}</h4>', '', '', function(opts) {
'use strict';

var self = this;
self.serverlist = ['https://ntp-a1.nict.go.jp/cgi-bin/json', 'https://ntp-b1.nict.go.jp/cgi-bin/json'];
self.serverurl = self.serverlist[Math.floor(Math.random() * self.serverlist.length)];
self.loaddate = Date.now();
$.ajax({
    url: self.serverurl + '?' + self.loaddate / 1000,
    dataType: "json"
}).done(function (response) {
    self.datediff = response.st * 1000 + (self.loaddate - response.it * 1000) / 2 - self.loaddate;
    updatetime();
}).fail(function (response) {
    throw new Error("つながってない");
});
function updatetime() {
    self.nowdate = new Date(Date.now() + self.datediff);
    self.clock = dateprintf('%h時%i分%s.%u秒', self.nowdate);
    self.update();
    obs.trigger('onclock', dateprintf('%i', self.nowdate));
    setTimeout(updatetime, 50);
}
function zerofill(number, digit) {
    return ('00' + number).slice(digit * -1);
}
function dateprintf(format, date) {
    if (!format) {
        format = '%y/%m/%d %h:%i:%s.%u';
    }
    if (!(date instanceof Date)) {
        date = new Date();
    }
    var year = date.getFullYear(),
        month = zerofill(date.getMonth() + 1, 2),
        date_n = zerofill(date.getDate(), 2),
        hour = zerofill(date.getHours(), 2),
        minute = zerofill(date.getMinutes(), 2),
        second = zerofill(date.getSeconds(), 2),
        milli_second = zerofill(date.getMilliseconds(), 3);
    return format.replace(/(%*)%([ymdhisu])/g, function (a, escape_str, type) {
        if (escape_str.length % 2 === 0) {
            switch (type) {
                case 'y':
                    type = year;
                    break;
                case 'm':
                    type = month;
                    break;
                case 'd':
                    type = date_n;
                    break;
                case 'h':
                    type = hour;
                    break;
                case 'i':
                    type = minute;
                    break;
                case 's':
                    type = second;
                    break;
                case 'u':
                    type = milli_second;
                    break;
            }
        }
        return escape_str.replace(/%%/g, '%') + type;
    });
}
});

riot.tag2('prpanel', '<div class="panel {opts.pcolor}"> <div class="panel-heading"> <h4 class="panel-title">{opts.ptitle}: <strong>{prayed}%</strong> ({minUpdated}分)</h4> </div> <div class="panel-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label>wave</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{wave}"> <input type="radio" name="waveRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>サイズ</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{size}"> <input type="radio" name="sizeRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>属性</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{elem}"> <input type="radio" name="elemRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <select class="form-control" ref="seedref" placeholder="シード名"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" ref="digitref" placeholder="体力"></select> </fieldset> </form> </div> </div>', 'prpanel .panel-heading,[data-is="prpanel"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
"use strict";

var self = this;
self.prayed = "-";
self.clockmin = "";
self.minUpdated = "-";
self.eRadio = [];
self.sRadio = [];
self.wRadio = [];
self.seedFiltered = [];
self.seedObj = {};
self.seedHp = 0;
self.seedSelectized = [];
self.digitSelectized = [];
self.wave = [{ text: "1体目", isactive: true, value: 1.0 }, { text: "2体目", isactive: false, value: 1.2 }, { text: "3体目", isactive: false, value: 1.4 }, { text: "4体目", isactive: false, value: 1.6 }, { text: "5体目", isactive: false, value: 1.8 }];
self.size = [{ text: "1.72", isactive: true, value: 1.72 }, { text: "1.75", isactive: false, value: 1.75 }, { text: "1.80", isactive: false, value: 1.80 }, { text: "1.00", isactive: false, value: 1.00 }];
self.elem = [{ text: "すべて", isactive: true, value: "all" }, { text: "炎", isactive: false, value: "fire" }, { text: "水", isactive: false, value: "water" }, { text: "風", isactive: false, value: "wind" }, { text: "光", isactive: false, value: "light" }, { text: "闇", isactive: false, value: "dark" }];

function setFilter() {
    if (self.eRadio.value === "all") {
        self.seedFiltered = seedDef;
    } else {
        self.seedFiltered = seedDef.filter(function (s) {
            return s.elm === self.eRadio.value;
        });
    }
    refresh(self.seedSelectized, self.seedFiltered);
}
function refresh(selectized, option) {
    var control = selectized[0].selectize;
    control.clearOptions();
    control.addOption(option);
    control.refreshOptions();
}
function setSeed(seed) {
    var obj = seedDef.filter(function (s) {
        return s.name === seed;
    })[0];
    if (obj) {
        self.seedObj = obj;
    }
}
function setVal() {
    var pray = calcPray({
        seedhp: self.seedObj.hp,
        seedsize: self.seedObj.size,
        inputhp: self.seedHp,
        scale: self.sRadio.value,
        wave: self.wRadio.value
    });
    if (pray > 0) {
        self.prayed = pray.toLocaleString();
    } else {
        self.prayed = "0";
    }
    self.minUpdated = self.clockmin;
    obs.trigger("oncalc", opts.pnum, pray);
    self.update();
}
function formatDigit(val, dig) {
    return val * Math.pow(10, dig - String(val).length);
}
function calcPray(_ref) {
    var _ref$seedhp = _ref.seedhp,
        seedhp = _ref$seedhp === undefined ? 0 : _ref$seedhp,
        _ref$seedsize = _ref.seedsize,
        seedsize = _ref$seedsize === undefined ? 1.72 : _ref$seedsize,
        inputhp = _ref.inputhp,
        scale = _ref.scale,
        wave = _ref.wave;

    return Math.round((inputhp / (seedhp / seedsize * scale) - 1) * 100 / wave);
}
obs.on('onclock', function (clockmin) {
    self.clockmin = clockmin;
});

self.on('mount', function () {
    self.wRadio = self.refs.formref.waveRadio;
    self.sRadio = self.refs.formref.sizeRadio;
    self.eRadio = self.refs.formref.elemRadio;
    self.wRadio[0].checked = true;
    self.sRadio[0].checked = true;
    self.eRadio[0].checked = true;
    self.seedFiltered = seedDef;
    $(function () {
        self.seedSelectized = $(self.refs.seedref).selectize({
            options: self.seedFiltered,
            valueField: "name",
            labelField: "name",
            searchField: ["extname"],
            placeholder: "シード名",
            onChange: function onChange(seed) {
                setSeed(seed);
                setVal();
            }
        });
        $(self.wRadio).change(function () {
            setVal();
        });
        $(self.sRadio).change(function () {
            setVal();
        });
        $(self.eRadio).change(function () {
            setFilter();
        });
        self.digitSelectized = $(self.refs.digitref).selectize({
            options: [],
            valueField: "value",
            labelField: "text",
            searchField: ["value"],
            placeholder: "体力",
            load: function load(query, callback) {
                if (!query.length) return callback();
                query = Number(query);
                callback([{ text: formatDigit(query, 6).toLocaleString(), value: formatDigit(query, 6) }, { text: formatDigit(query, 7).toLocaleString(), value: formatDigit(query, 7) }, { text: formatDigit(query, 8).toLocaleString(), value: formatDigit(query, 8) }, { text: formatDigit(query, 9).toLocaleString(), value: formatDigit(query, 9) }, { text: formatDigit(query, 10).toLocaleString(), value: formatDigit(query, 10) }]);
            },
            onChange: function onChange(hp) {
                self.seedHp = Number(hp);
                setVal();
            }
        });
    });
});
});