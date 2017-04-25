
riot.tag2('app', '<nav class="navbar navbar-default"> <div class="container"> <div class="navbar-header"> <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#">メルストのやつ</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav"> <li><a href="#">home</a></li> <li><a href="#pray">pray</a></li> <li><a href="#gp">gp</a></li> </ul> </div> </div> </nav> <div class="container"> <div id="content"> <h1></h1> </div> </div>', '', '', function(opts) {
    var r = route.create()
    r('', function() {
      riot.mount('#content', 'pray')
    })
    r('pray', function() {
      riot.mount('#content', 'pray')
    })
    r('gp', function() {
      riot.mount('#content', 'gp')
    })
    r(function() {
      riot.mount('#content', 'pray')
    })

});
riot.tag2('home', '<h1>home</h1>', '', '', function(opts) {
});

riot.tag2('gatepanel', '<div class="panel panel-default"> <div class="panel-heading">{gp}GP/{pray}% ({min})</div> <div class="panel-body"></div> </div>', '', '', function(opts) {
});

riot.tag2('gatemodal', '<div class="modal" role="dialog" id="{opts.modid}"> <div class="modal-dialog"> <div class="modal-content {opts.modcolor}"> <div class="modal-header panel-heading"> <button class="close" type="button" data-dismiss="modal">&times;</button> <h4 class="modal-title">{opts.modtitle}: {objModal.prayed} ({objModal.minUpdated})</h4> </div> <div class="modal-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label class="radio-inline" each="{elem}"> <input type="radio" name="elemRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <label class="radio-inline" each="{isgate}"> <input type="radio" name="gateRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <select class="form-control" name="seedNameMulti"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitSelect"></select> </fieldset> <fieldset class="form-group"> <div class="row"> <div class="col-xs-6"> <select class="form-control" name="sizeSelect" onchange="{setVal}"> <option each="{size}" riot-value="{value}">{text}</option> </select> </div> </div> </fieldset> </form> </div> </div> </div> </div>', 'gatemodal .panel-heading,[data-is="gatemodal"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
    var self = this
    self.selectizedSeed = []
    self.selectizedDigit = []
    self.objModal = {
      elemRadio: "all",
      gateRadio: false,
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
    function calc() {
      self.objModal.seedDescMulti = setSeedMulti(self.objModal.seedNameMulti)
      obs.trigger('onselect', self.objModal.seedDescMulti)
      self.objModal.prayed = setPrayMulti(self.objModal) + "%"
      self.objModal.minUpdated = self.parent.clockmin
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
          placeholder: "5体選べます"
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
          console.log(this)
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

riot.tag2('gp', '<p>準備中なのだよ…</p>', '', '', function(opts) {
});

riot.tag2('jst', '<h4>{clock}</h4>', '', '', function(opts) {
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

riot.tag2('pray', '<section> <h3>お祈り計算できるマン3.1<small>(更新:{document.lastModified})</small></h3> <jst> </jst> <div class="row"> <div class="col-md-4"> <h4 strong clock></h4> <div class="row"> <div class="col-xs-6"> <div class="alert alert-warning" type="button" data-toggle="modal" data-target="#upleft" tabindex="0"> <p class="text-left">左上 ({objPray.modul.min})</p> <p class="text-left"><strong>{objPray.modul.pray}</strong></p> </div> </div> <div class="col-xs-6"> <div class="alert alert-danger" type="button" data-toggle="modal" data-target="#upright" tabindex="0"> <p class="text-left">右上 ({objPray.modur.min})</p> <p class="text-left"><strong>{objPray.modur.pray}</strong></p> </div> </div> </div> <div class="row"> <div class="col-xs-6 col-xs-offset-3"> <div class="alert alert-default" type="button" data-toggle="modal" data-target="#gate" tabindex="0"> <p class="text-left">ゲート ({objPray.modgt.min})</p> <p class="text-left"><strong>{objPray.modgt.pray}</strong></p> </div> </div> </div> <div class="row"> <div class="col-xs-6"> <div class="alert alert-info" type="button" data-toggle="modal" data-target="#lowleft" tabindex="0"> <p class="text-left">左下 ({objPray.modll.min})</p> <p class="text-left"><strong>{objPray.modll.pray}</strong></p> </div> </div> <div class="col-xs-6"> <div class="alert alert-success" type="button" data-toggle="modal" data-target="#lowright" tabindex="0"> <p class="text-left">右下 ({objPray.modlr.min})</p> <p class="text-left"><strong>{objPray.modlr.pray}</strong></p> </div> </div> </div> </div> <div class="col-md-8"> <div class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title">{gpnum}GP({gpmin}分) / {pray.modgt}%({min.modgt}分)</h4> </div> <div class="panel-body"> <div class="table-responsive"> <table class="table"> <thead> <tr> <th>名前</th> <th>リーチ</th> <th>範囲</th> <th>段数</th> <th>外皮</th> </tr> </thead> <tbody> <tr each="{selected}"> <th>{name}</th> <th>{reach}</th> <th>{range}</th> <th>{cmb}</th> <th>{skin}</th> </tr> </tbody> </table> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label class="radio-inline" each="{sally}"> <input type="radio" name="sallyRadio" riot-value="{value}" onchange="{calcGP}"> {text} </label> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitGP"></select> </fieldset> </form> </div> </div> </div> </div> </div> <praymodal ref="modul" refname="modul" modid="upleft" modtitle="左上" modcolor="panel-warning"></praymodal> <praymodal ref="modur" refname="modur" modid="upright" modtitle="右上" modcolor="panel-danger"></praymodal> <gatemodal ref="modgt" refname="modgt" modid="gate" modtitle="ゲート" modcolor="panel-default"></gatemodal> <praymodal ref="modll" refname="modll" modid="lowleft" modtitle="左下" modcolor="panel-info"></praymodal> <praymodal ref="modlr" refname="modlr" modid="lowright" modtitle="右下" modcolor="panel-success"></praymodal> </section>', 'pray .alert-default,[data-is="pray"] .alert-default{ background-color: #f3f3f3; border-color: #f0f0f0; }', '', function(opts) {
    var self = this
    self.objPray = {
      modul: { pray: "タップしてね", min: "-分" },
      modur: { pray: "タップしてね", min: "-分" },
      modgt: { pray: "タップしてね", min: "-分" },
      modll: { pray: "タップしてね", min: "-分" },
      modlr: { pray: "タップしてね", min: "-分" },
    }
    self.selected = []
    obs.on('onclock', function(clockmin){
      self.clockmin = clockmin
    })
    obs.on('oncalc', function(refname, prayed){
      self.objPray[refname].pray = prayed
      self.objPray[refname].min = self.clockmin
      self.update()
    })
    obs.on('onselect', function(selected){
      self.selected = selected
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

riot.tag2('praymodal', '<div class="modal" role="dialog" id="{opts.modid}"> <div class="modal-dialog"> <div class="modal-content {opts.modcolor}"> <div class="modal-header panel-heading"> <button class="close" type="button" data-dismiss="modal">&times;</button> <h4 class="modal-title">{opts.modtitle}: {objModal.prayed} ({objModal.minUpdated})</h4> </div> <div class="modal-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label class="radio-inline" each="{elem}"> <input type="radio" name="elemRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <label class="radio-inline" each="{isgate}"> <input type="radio" name="gateRadio" riot-value="{value}" onchange="{setFilter}"> {text} </label> </fieldset> <fieldset class="form-group"> <select class="form-control" name="seedName"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitSelect"></select> </fieldset> <fieldset class="form-group"> <div class="row"> <div class="col-xs-6"> <select class="form-control" name="sizeSelect" onchange="{setVal}"> <option each="{size}" riot-value="{value}">{text}</option> </select> </div> <div class="col-xs-6"> <select class="form-control" name="waveSelect" onchange="{setVal}"> <option each="{wave}" riot-value="{value}">{text}</option> </select> </div> </div> </fieldset> </form> </div> </div> </div> </div>', 'praymodal .panel-heading,[data-is="praymodal"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
    var self = this
    self.selectizedSeed = []
    self.selectizedDigit = []
    self.objModal = {
      elemRadio: "all",
      gateRadio: false,
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
    function calc() {
      self.objModal.seedDesc = setSeed(self.objModal.seedName)
      self.objModal.prayed = setPray(self.objModal) + "%"
      self.objModal.minUpdated = self.parent.clockmin
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