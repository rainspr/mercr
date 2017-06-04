
riot.tag2('app', '<nav class="navbar navbar-default"> <div class="container"> <div class="navbar-header"> <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#">メルストのやつ</a> </div> <div class="collapse navbar-collapse" id="navbar-collapse"> <ul class="nav navbar-nav"> <li><a href="#">home</a></li> <li><a href="#pray">pray</a></li> <li><a href="#prayj">others</a></li> </ul> </div> </div> </nav> <div class="container"> <div id="content"> <h1></h1> </div> </div>', '', '', function(opts) {
    var r = route.create()
    r('', function() {
      riot.mount('#content', 'pray')
    })
    r('pray', function() {
      riot.mount('#content', 'pray')
    })
    r('prayj', function() {
      riot.mount('#content', 'prayj')
    })
    r(function() {
      riot.mount('#content', 'pray')
    })

});
riot.tag2('home', '<h1>home</h1>', '', '', function(opts) {
});

riot.tag2('gatedesc', '<label for="#gatetable">ゲートモンスター</label> <table class="table" id="gatetable"> <thead> <tr> <th>名前</th> <th>リーチ</th> <th>範囲</th> <th>段数</th> <th>外皮</th> </tr> </thead> <tbody> <tr each="{selected}"> <th>{name}</th> <th>{reach}</th> <th>{range}</th> <th>{cmb}</th> <th>{skin}</th> </tr> </tbody> </table>', '', '', function(opts) {
    var self = this
    self.selected = []
    obs.on('onselect', function(selected){
      self.selected = selected
      self.update()
    })
});

riot.tag2('gatemodal', '<div class="modal" role="dialog" id="{opts.modid}"> <div class="modal-dialog"> <div class="modal-content {opts.modcolor}"> <div class="modal-header panel-heading"> <button class="close" type="button" data-dismiss="modal">&times;</button> <h4 class="modal-title">{opts.modtitle}: {objModal.prayed} ({objModal.minUpdated})</h4> </div> <div class="modal-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label class="radio-inline" each="{elem}"> <input type="radio" name="elemRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <label class="radio-inline" each="{isgate}"> <input type="radio" name="gateRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <select class="form-control" name="seedNameMulti"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitSelect"></select> </fieldset> <fieldset class="form-group"> <div class="row"> <div class="col-xs-6"> <select class="form-control" name="sizeSelect" onchange="{setVal}"> <option each="{size}" riot-value="{value}">{text}</option> </select> </div> </div> </fieldset> </form> </div> </div> </div> </div>', 'gatemodal .panel-heading,[data-is="gatemodal"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
    var self = this
    self.selectizedSeed = []
    self.selectizedDigit = []
    self.clockmin = ""
    self.objModal = {
      elemRadio: "all",
      gateRadio: "gateonly",
      seedNameMulti: [],
      seedDescMulti: [],
      digitSelect: "0",
      sizeSelect: "1.72",
      waveSelect: "1.0",
      prayed: "-%",
      minUpdated: "-分"
    }
    self.seedDefault = seed.map(function(obj) {
      obj.extname += obj.name + convertToHira(obj.name)
      obj.elm += "all"
      return obj
    })
    this.setFilter = function(e) {
      self.objModal[e.target.name] = e.target.value
      filterSeed()
    }.bind(this)
    this.setVal = function(e) {
      self.objModal[e.target.name] = e.target.value
      calc()
    }.bind(this)
    obs.on('onclock', function(clockmin){
      self.clockmin = clockmin
    })
    function calc() {
      self.objModal.seedDescMulti = setSeedMulti(self.objModal.seedNameMulti)
      obs.trigger('onselect', self.objModal.seedDescMulti)
      self.objModal.prayed = setPrayMulti(self.objModal) + "%"
      self.objModal.minUpdated = self.clockmin
      self.update()
      obs.trigger('oncalc', opts.refname, self.objModal.prayed)
    }
    function convertToHira(str) {
      return str.replace(/[\u30a1-\u30f6]/g, function (match) {
        var chr = match.charCodeAt(0) - 0x60
        return String.fromCharCode(chr)
      })
    }
    function setSeedMulti(seedNameMulti) {
      var arr = []
      for(var l=0; l<seedNameMulti.length; l++) {
        var obj = self.seedDefault.filter(function(seed,index) {
          if(seed.name === seedNameMulti[l]) return true
        })
        if(obj) {
          arr[l] = obj[0]
        }
      }
      if(arr) {
        return arr
      }
    }
    function calcPray(seedhp,seedsize,inputhp,scale,wave) {
      return Math.round((inputhp / (seedhp/seedsize*scale) -1) * 100 / wave)
    }
    function setPrayMulti(obj) {
      var seedhp = obj.seedDescMulti[0].hp
      var seedsize = obj.seedDescMulti[0].size
      var inputhp = Number(obj.digitSelect)
      var scale = Number(obj.sizeSelect)
      var wave = Number(obj.waveSelect)
      var pray = calcPray(seedhp,seedsize,inputhp,scale,wave)
      if(pray>0) {
        return pray.toLocaleString()
      } else return "0"
    }
    function filterSeed() {
      self.seedFiltered = self.seedDefault.filter(function(seed,index) {
        if((seed.elm).indexOf(self.objModal.elemRadio) >= 0) {
          if(self.objModal.gateRadio === "gateonly") {
            if(seed.gate === true) return true
          } else return true
        }
      })
      self.selectizedSeed[0].selectize.clearOptions()
      self.selectizedSeed[0].selectize.addOption(self.seedFiltered)
      self.selectizedSeed[0].selectize.refreshOptions()
    }
    function formatDigit(val,dig) {
      return val * Math.pow(10, dig - String(val).length)
    }
    self.elem = [
      { text: "すべて", value: "all" },
      { text: "炎", value: "fire" },
      { text: "水", value: "water" },
      { text: "風", value: "wind" },
      { text: "光", value: "light" },
      { text: "闇", value: "dark" }
    ]
    self.isgate = [
      { text: "すべて", value: "all" },
      { text: "ゲートから出るもののみ", value: "gateonly" }
    ]
    self.size = [
      { text: "1.72", value: 1.72 },
      { text: "1.75", value: 1.75 },
      { text: "1.80", value: 1.80 },
      { text: "1.00", value: 1.00 }
    ]
    self.wave = [
      { text: "1体目", value: 1.0 },
      { text: "2体目", value: 1.2 },
      { text: "3体目", value: 1.4 },
      { text: "4体目", value: 1.6 },
      { text: "5体目", value: 1.8 }
    ]
    self.on('mount', function() {
      self.refs.formref.elemRadio.value = "all"
      self.refs.formref.gateRadio.value = "gateonly"
      self.seedFiltered = self.seedDefault

      $(function(){
        self.selectizedSeed = $(self.refs.formref.seedNameMulti).selectize({
          options: self.seedFiltered,
          valueField: "name",
          labelField: "name",
          searchField: ["extname"],
          maxItems: 5,
          placeholder: "シード名(5体選べます)"
        })
        self.selectizedDigit = $(self.refs.formref.digitSelect).selectize({
          options: [],
          valueField: "value",
          labelField: "text",
          searchField: ["value"],
          placeholder: "1体目の体力",
          load: function(query, callback) {
            if(!query.length) return callback()
            query = Number(query)
            callback([
              { text: formatDigit(query, 6).toLocaleString(), value: formatDigit(query, 6) },
              { text: formatDigit(query, 7).toLocaleString(), value: formatDigit(query, 7) },
              { text: formatDigit(query, 8).toLocaleString(), value: formatDigit(query, 8) },
              { text: formatDigit(query, 9).toLocaleString(), value: formatDigit(query, 9) },
              { text: formatDigit(query, 10).toLocaleString(), value: formatDigit(query, 10) }
            ])
          }
        })
        self.selectizedSeed.on('change', function(){
          if(this.value){
            self.objModal.seedNameMulti = self.selectizedSeed.val()
            calc()
          }
        })
        self.selectizedDigit.on('change', function(){
          if(this.value){
            self.objModal.digitSelect = self.selectizedDigit.val()
            calc()
          }
        })
      })
    })

});

riot.tag2('gpcalc', '<div class="panel-group" id="accordion"> <div class="panel panel-default"> <div class="panel-heading"><a data-toggle="collapse" href="#collapse1"> <h4 class="panel-title">ゲート保有GP: <strong>{objGate.gateValue}GP</strong></h4></a></div> <div class="panel-collapse collapse in" id="collapse1"> <div class="panel-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label>役職補正</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{sally}"> <input type="radio" name="sallyRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>クリア(分)</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{lapMin}"> <input type="radio" name="lapMinRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>クリア(秒)</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{lapSec}"> <input type="radio" name="lapSecRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <label>コンテ数</label> <div class="btn-group btn-group-sm" data-toggle="buttons"> <label class="btn btn-default {active: isactive}" each="{contNum}"> <input type="radio" name="contNumRadio" autocomplete="off" riot-value="{value}"> {text} </label> </div> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitGP"></select> </fieldset> </form> </div> </div> </div> <div class="panel panel-default"> <div class="panel-heading"><a data-toggle="collapse" href="#collapse2"> <h4 class="panel-title">獲得GP予想</h4></a></div> <div class="panel-collapse collapse in" id="collapse2"> <div class="panel-body"> <p>メンテ中だよ…！</p> </div> </div> </div> </div>', '', '', function(opts) {
    var self = this
    self.selectizedGP = []
    self.objGate = {
      sallyRadio: "0.02",
      lapMinRadio: "0",
      lapSecRadio: "0",
      contNumRadio: "1.00",
      digitGP: "",
      gateValue: "0"
    }
    self.sally = [
      { text: "1.0%", value: "0.01", isactive: false },
      { text: "1.5%", value: "0.015", isactive: false },
      { text: "2.0%", value: "0.02", isactive: true },
      { text: "2.5%", value: "0.025", isactive: false },
      { text: "3.0%", value: "0.03", isactive: false },
    ]
    self.lapMin = [
      { text: "5", value: "0", isactive: true },
      { text: "6", value: "60", isactive: false },
      { text: "7", value: "90", isactive: false },
      { text: "8", value: "120", isactive: false },
      { text: "9", value: "150", isactive: false },
      { text: "10", value: "180", isactive: false },
    ]
    self.lapSec = [
      { text: "00", value: "0", isactive: true },
      { text: "15", value: "15", isactive: false },
      { text: "30", value: "30", isactive: false },
      { text: "45", value: "45", isactive: false },
    ]
    self.contNum = [
      { text: "0", value: "1.00", isactive: true },
      { text: "1", value: "0.95", isactive: false },
      { text: "2", value: "0.90", isactive: false },
      { text: "3", value: "0.85", isactive: false },
      { text: "4", value: "0.80", isactive: false },
      { text: "5", value: "0.75", isactive: false },
      { text: "6", value: "0.70", isactive: false },
      { text: "7", value: "0.65", isactive: false },
      { text: "8", value: "0.60", isactive: false }
    ]
    function calcgp() {
      var sallyValue = Number(self.objGate.sallyRadio)
      var contValue = Number(self.objGate.contNumRadio)
      var time = 300 - Number(self.objGate.lapMinRadio) - Number(self.objGate.lapSecRadio)
      if(time<0) time = 0
      var tb = 1 + (0.201)*time/300
      var gpNum = Number(self.objGate.digitGP) - 1000
      var gatePoint = (gpNum / tb) / sallyValue / contValue
      self.objGate.gateValue = numToString(gatePoint)
      self.update()
    }
    function formatDigit(val,dig) {
      return val * Math.pow(10, dig - String(val).length)
    }
    function numToString(num) {
      var strarr = num.toString().split('.')
      strarr[0] = Number(strarr[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return strarr[0]
    }
    self.on('mount', function(){
      $(function(){
        self.refs.formref.sallyRadio.value = "0.02"
        self.refs.formref.lapMinRadio.value = "0"
        self.refs.formref.lapSecRadio.value = "0"
        self.refs.formref.contNumRadio.value = "0"
        self.selectizedGP = $(self.refs.formref.digitGP).selectize({
          options: [],
          valueField: "value",
          labelField: "text",
          searchField: ["value"],
          placeholder: "獲得したGP",
          load: function(query, callback) {
            if(!query.length) return callback()
            query = Number(query)
            callback([
              { text: formatDigit(query, 4).toLocaleString(), value: formatDigit(query, 4) },
              { text: formatDigit(query, 5).toLocaleString(), value: formatDigit(query, 5) },
              { text: formatDigit(query, 6).toLocaleString(), value: formatDigit(query, 6) },
              { text: formatDigit(query, 7).toLocaleString(), value: formatDigit(query, 7) },
              { text: formatDigit(query, 8).toLocaleString(), value: formatDigit(query, 8) },
              { text: formatDigit(query, 9).toLocaleString(), value: formatDigit(query, 9) },
              { text: formatDigit(query, 10).toLocaleString(), value: formatDigit(query, 10) }
            ])
          }
        })
        $(self.refs.formref.sallyRadio).change(function(){
          self.objGate.sallyRadio = this.value
          calcgp()
        })
        $(self.refs.formref.lapMinRadio).change(function(){
          self.objGate.lapMinRadio = this.value
          calcgp()
        })
        $(self.refs.formref.lapSecRadio).change(function(){
          self.objGate.lapSecRadio = this.value
          calcgp()
        })
        $(self.refs.formref.contNumRadio).change(function(){
          self.objGate.contNumRadio = this.value
          calcgp()
        })
        self.selectizedGP.on('change', function(){
          self.objGate.digitGP = self.selectizedGP.val()
          calcgp()
        })
      })
    })
});

riot.tag2('gpdesc', '<form ref="formref" onsubmit="return false;"> <div class="row"> <div class="col-xs-6"> <div class="alert alert-warning"> <p class="text-left">左上</p> <p class="text-left"><strong>{objPray.modul.pray}</strong></p> </div> </div> <div class="col-xs-6"> <div class="alert alert-danger"> <p class="text-left">右上</p> <p class="text-left"><strong>{objPray.modur.pray}</strong></p> </div> </div> </div> <div class="row"> <div class="col-xs-6 col-xs-offset-3"> <div class="alert alert-default"> <p class="text-left">ゲート</p> <p class="text-left"><strong>{objPray.modgt.pray}</strong></p> </div> </div> </div> <div class="row"> <div class="col-xs-6"> <div class="alert alert-info"> <p class="text-left">左下</p> <p class="text-left"><strong>{objPray.modll.pray}</strong></p> </div> </div> <div class="col-xs-6"> <div class="alert alert-success"> <p class="text-left">右下</p> <p class="text-left"><strong>{objPray.modlr.pray}</strong></p> </div> </div> </div> </form>', '', '', function(opts) {
});

riot.tag2('jst', '<h4>現在時刻: {clock}</h4>', '', '', function(opts) {
    var self = this
    self.serverlist = [
      'https://ntp-a1.nict.go.jp/cgi-bin/json',
      'https://ntp-b1.nict.go.jp/cgi-bin/json'
    ]
    self.serverurl = self.serverlist[Math.floor(Math.random() * self.serverlist.length)]
    self.loaddate = Date.now()
    axios.get(self.serverurl + "?" + self.loaddate / 1000)
      .then(function(response) {
        self.datediff = ((response.data.st * 1000) + ((self.loaddate - (response.data.it * 1000)) / 2)) - self.loaddate
        updatetime()
      })
      .catch(function(response) {
        throw new Error("つながってない")
      })
    function updatetime() {
      self.nowdate = new Date(Date.now() + self.datediff)
      self.clock = dateprintf('%h時%i分%s.%u秒', self.nowdate)
      self.update()
      obs.trigger('onclock', dateprintf('%i分', self.nowdate))
      setTimeout(updatetime, 50)
    }
    function zerofill(number,digit) {
      return ('00' + number).slice(digit * -1)
    }
    function dateprintf(format,date) {
      if (!format) {
        format = '%y/%m/%d %h:%i:%s.%u'
      }
      if (!(date instanceof Date)) {
        date = new Date()
      }
      let year = date.getFullYear(),
        month = zerofill(date.getMonth() + 1, 2),
        date_n = zerofill(date.getDate(), 2),
        hour = zerofill(date.getHours(), 2),
        minute = zerofill(date.getMinutes(), 2),
        second = zerofill(date.getSeconds(), 2),
        milli_second = zerofill(date.getMilliseconds(), 3)
      return format.replace(/(%*)%([ymdhisu])/g, function (a, escape_str, type) {
        if (escape_str.length % 2 === 0) {
          switch (type) {
            case 'y':
              type = year
              break
            case 'm':
              type = month
              break
            case 'd':
              type = date_n
              break
            case 'h':
              type = hour
              break
            case 'i':
              type = minute
              break
            case 's':
              type = second
              break
            case 'u':
              type = milli_second
              break
          }
        }
        return escape_str.replace(/%%/g, '%') + type
      })
    }
});

riot.tag2('pray', '<section> <h3>お祈り計算できるマン3.1 <small>(更新:{document.lastModified})</small></h3> <jst> </jst> <div class="row"> <div class="col-md-4"> <div id="gldbg"> <div id="layer"> <div class="row"> <div class="col-xs-6"> <div class="alert alert-warning" type="button" data-toggle="modal" data-target="#upleft" tabindex="0"> <p class="text-left">左上({objPray.modul.min})</p> <p class="text-left"><strong>{objPray.modul.pray}</strong></p> </div> </div> <div class="col-xs-6"> <div class="alert alert-danger" type="button" data-toggle="modal" data-target="#upright" tabindex="0"> <p class="text-left">右上({objPray.modur.min})</p> <p class="text-left"><strong>{objPray.modur.pray}</strong></p> </div> </div> </div> <div class="row"> <div class="col-xs-6 col-xs-offset-3"> <div class="alert alert-default" type="button" data-toggle="modal" data-target="#gate" tabindex="0"> <p class="text-left">ゲート({objPray.modgt.min})</p> <p class="text-left"><strong>{objPray.modgt.pray}</strong></p> </div> </div> </div> <div class="row"> <div class="col-xs-6"> <div class="alert alert-info" type="button" data-toggle="modal" data-target="#lowleft" tabindex="0"> <p class="text-left">左下({objPray.modll.min})</p> <p class="text-left"><strong>{objPray.modll.pray}</strong></p> </div> </div> <div class="col-xs-6"> <div class="alert alert-success" type="button" data-toggle="modal" data-target="#lowright" tabindex="0"> <p class="text-left">右下({objPray.modlr.min})</p> <p class="text-left"><strong>{objPray.modlr.pray}</strong></p> </div> </div> </div> </div> </div> <gatedesc></gatedesc> </div> <div class="col-md-8"> <gpcalc></gpcalc> </div> </div> <praymodal ref="modul" refname="modul" modid="upleft" modtitle="左上" modcolor="panel-warning"></praymodal> <praymodal ref="modur" refname="modur" modid="upright" modtitle="右上" modcolor="panel-danger"></praymodal> <gatemodal ref="modgt" refname="modgt" modid="gate" modtitle="ゲート" modcolor="panel-default"></gatemodal> <praymodal ref="modll" refname="modll" modid="lowleft" modtitle="左下" modcolor="panel-info"></praymodal> <praymodal ref="modlr" refname="modlr" modid="lowright" modtitle="右下" modcolor="panel-success"></praymodal> </section>', 'pray .alert-default,[data-is="pray"] .alert-default{ background-color: #f5f5f5; border-color: #ddd; } pray #gldbg,[data-is="pray"] #gldbg{ background: url("ettaso.jpeg") no-repeat center center; background-size: contain; } pray #layer,[data-is="pray"] #layer{ background-color: rgba(255,255,255,0.5); }', '', function(opts) {
    var self = this
    self.objPray = {
      modul: { pray: "タップしてね", min: "-分" },
      modur: { pray: "タップしてね", min: "-分" },
      modgt: { pray: "タップしてね", min: "-分" },
      modll: { pray: "タップしてね", min: "-分" },
      modlr: { pray: "タップしてね", min: "-分" },
    }
    obs.on('onclock', function(clockmin){
      self.clockmin = clockmin
    })
    obs.on('oncalc', function(refname, prayed){
      self.objPray[refname].pray = prayed
      self.objPray[refname].min = self.clockmin
      self.update()
    })
    self.on('mount', function(){
      $(function(){
        $("#upleft").on('shown.bs.modal', function(){
          $("#upright .close").focus()
        })
        $("#upright").on('shown.bs.modal', function(){
          $("#upleft .close").focus()
        })
        $("#gate").on('shown.bs.modal', function(){
          $("#gate .close").focus()
        })
        $("#lowleft").on('shown.bs.modal', function(){
          $("#lowleft .close").focus()
        })
        $("#lowright").on('shown.bs.modal', function(){
          $("#lowright .close").focus()
        })
      })
    })

});

riot.tag2('prayj', '<section> <div class="row"> <div class="col-md-6"> <form> <button class="btn btn-default" type="button" onclick="{reset}">リセット</button> <button class="btn btn-default" type="button" onclick="{pray}">祈り</button> <p>防衛 + {prayed.toLocaleString()}%</p> <fieldset class="form-group"> <select class="form-control" onchange="{setVal}"> <option each="{menber}" riot-value="{value}">{text}:{value.toLocaleString()}%</option> </select> </fieldset> </form> </div> </div> </section>', '', '', function(opts) {
    var self = this
    self.selected = 3.5
    self.prayed = 0
    self.menber = [
      { text: "プライリーダー", value: 3.5 },
      { text: "プライメンバー", value: 3.0 },
      { text: "一般", value: 2.5 },
      { text: "gorilla", value: 300000 },
    ]
    this.setVal = function(e) {
      self.selected = Number(e.target.value)
    }.bind(this)
    this.pray = function() {
      self.prayed += self.selected
    }.bind(this)
    this.reset = function() {
      self.prayed = 0
    }.bind(this)
});

riot.tag2('praymodal', '<div class="modal" role="dialog" id="{opts.modid}"> <div class="modal-dialog"> <div class="modal-content {opts.modcolor}"> <div class="modal-header panel-heading"> <button class="close" type="button" data-dismiss="modal">&times;</button> <h4 class="modal-title">{opts.modtitle}: {objModal.prayed} ({objModal.minUpdated})</h4> </div> <div class="modal-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label class="radio-inline" each="{elem}"> <input type="radio" name="elemRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <label class="radio-inline" each="{isgate}"> <input type="radio" name="gateRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <select class="form-control" name="seedName"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitSelect"></select> </fieldset> <fieldset class="form-group"> <div class="row"> <div class="col-xs-6"> <select class="form-control" name="sizeSelect" onchange="{setVal}"> <option each="{size}" riot-value="{value}">{text}</option> </select> </div> <div class="col-xs-6"> <select class="form-control" name="waveSelect" onchange="{setVal}"> <option each="{wave}" riot-value="{value}">{text}</option> </select> </div> </div> </fieldset> </form> </div> </div> </div> </div>', 'praymodal .panel-heading,[data-is="praymodal"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
    var self = this
    self.selectizedSeed = []
    self.selectizedDigit = []
    self.clockmin = ""
    self.objModal = {
      elemRadio: "all",
      gateRadio: "all",
      seedName: "",
      seedDesc: {},
      digitSelect: "0",
      sizeSelect: "1.72",
      waveSelect: "1.0",
      prayed: "-%",
      minUpdated: "-分"
    }
    self.seedDefault = seed.map(function(obj) {
      obj.extname += obj.name + convertToHira(obj.name)
      obj.elm += "all"
      return obj
    })
    this.setFilter = function(e) {
      self.objModal[e.target.name] = e.target.value
      filterSeed()
    }.bind(this)
    this.setVal = function(e) {
      self.objModal[e.target.name] = e.target.value
      calc()
    }.bind(this)
    obs.on('onclock', function(clockmin){
      self.clockmin = clockmin
    })
    function calc() {
      self.objModal.seedDesc = setSeed(self.objModal.seedName)
      self.objModal.prayed = setPray(self.objModal) + "%"
      self.objModal.minUpdated = self.clockmin
      self.update()
      obs.trigger('oncalc', opts.refname, self.objModal.prayed)
    }
    function convertToHira(str) {
      return str.replace(/[\u30a1-\u30f6]/g, function (match) {
        var chr = match.charCodeAt(0) - 0x60
        return String.fromCharCode(chr)
      })
    }
    function setSeed(seedname) {
      var obj = self.seedDefault.filter(function(seed,index) {
        if(seed.name === seedname) return true
      })
      if(obj) {
        return obj[0]
      }
    }
    function calcPray(seedhp,seedsize,inputhp,scale,wave) {
      return Math.round((inputhp / (seedhp/seedsize*scale) -1) * 100 / wave)
    }
    function setPray(obj) {
      var seedhp = obj.seedDesc.hp
      var seedsize = obj.seedDesc.size
      var inputhp = Number(obj.digitSelect)
      var scale = Number(obj.sizeSelect)
      var wave = Number(obj.waveSelect)
      var pray = calcPray(seedhp,seedsize,inputhp,scale,wave)
      if(pray>0) {
        return pray.toLocaleString()
      } else return "0"
    }
    function filterSeed() {
      self.seedFiltered = self.seedDefault.filter(function(seed,index) {
        if((seed.elm).indexOf(self.objModal.elemRadio) >= 0) {
          if(self.objModal.gateRadio === "gateonly") {
            if(seed.gate === true) return true
          } else return true
        }
      })
      self.selectizedSeed[0].selectize.clearOptions()
      self.selectizedSeed[0].selectize.addOption(self.seedFiltered)
      self.selectizedSeed[0].selectize.refreshOptions()
    }
    function formatDigit(val,dig) {
      return val * Math.pow(10, dig - String(val).length)
    }
    self.elem = [
      { text: "すべて", value: "all" },
      { text: "炎", value: "fire" },
      { text: "水", value: "water" },
      { text: "風", value: "wind" },
      { text: "光", value: "light" },
      { text: "闇", value: "dark" }
    ]
    self.isgate = [
      { text: "すべて", value: "all" },
      { text: "ゲートから出るもののみ", value: "gateonly" }
    ]
    self.size = [
      { text: "1.72", value: 1.72 },
      { text: "1.75", value: 1.75 },
      { text: "1.80", value: 1.80 },
      { text: "1.00", value: 1.00 }
    ]
    self.wave = [
      { text: "1体目", value: 1.0 },
      { text: "2体目", value: 1.2 },
      { text: "3体目", value: 1.4 },
      { text: "4体目", value: 1.6 },
      { text: "5体目", value: 1.8 }
    ]
    self.on('mount', function() {
      self.refs.formref.elemRadio.value = "all"
      self.refs.formref.gateRadio.value = "all"
      self.seedFiltered = self.seedDefault

      $(function(){
        self.selectizedSeed = $(self.refs.formref.seedName).selectize({
          options: self.seedFiltered,
          valueField: "name",
          labelField: "name",
          searchField: ["extname"],
          placeholder: "シード名"
        })
        self.selectizedDigit = $(self.refs.formref.digitSelect).selectize({
          options: [],
          valueField: "value",
          labelField: "text",
          searchField: ["value"],
          placeholder: "体力",
          load: function(query, callback) {
            if(!query.length) return callback()
            query = Number(query)
            callback([
              { text: formatDigit(query, 6).toLocaleString(), value: formatDigit(query, 6) },
              { text: formatDigit(query, 7).toLocaleString(), value: formatDigit(query, 7) },
              { text: formatDigit(query, 8).toLocaleString(), value: formatDigit(query, 8) },
              { text: formatDigit(query, 9).toLocaleString(), value: formatDigit(query, 9) },
              { text: formatDigit(query, 10).toLocaleString(), value: formatDigit(query, 10) }
            ])
          }
        })
        self.selectizedSeed.on('change', function(){
          if(this.value){
            self.objModal.seedName = self.selectizedSeed.val()
            calc()
          }
        })
        self.selectizedDigit.on('change', function(){
          if(this.value){
            self.objModal.digitSelect = self.selectizedDigit.val()
            calc()
          }
        })
      })
    })

});