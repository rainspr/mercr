
riot.tag2('app', '<nav class="navbar navbar-default"> <div class="container"> <div class="navbar-header"> <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><a class="navbar-brand" href="#">メルストのやつ</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <ul class="nav navbar-nav"> <li><a href="#">home</a></li> <li><a href="#pray">pray</a></li> <li><a href="#gp">gp</a></li> </ul> </div> </div> </nav> <div class="container"> <div id="content"> <h1>test</h1> </div> </div>', '', '', function(opts) {
    let r = route.create()
    r('', () => {
      riot.mount('#content', 'home')
    })
    r('pray', () => {
      riot.mount('#content', 'pray')
    })
    r('gp', () => {
      riot.mount('#content', 'gp')
    })
    r(() => {
      riot.mount('#content', 'home')
    })

});
riot.tag2('home', '<h1>home</h1>', '', '', function(opts) {
});

riot.tag2('gp', '<h1>testg</h1>', '', '', function(opts) {
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
      self.clock = dateprintf('%y年%m月%d日 %h時%i分%s.%u秒', self.nowdate)
      self.clockmin = dateprintf('i分%s秒', self.nowdate)
      self.update()
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

riot.tag2('pray', '<section> <h3>お祈り計算できるマン3.1</h3> <jst> </jst> <div class="row"> <div class="col-sm-4"> <h4 strong clock></h4> <div class="row"> <div class="col-xs-6"> <div class="alert alert-warning" type="button" data-toggle="modal" data-target="#upleft" tabindex="0"> <p class="text-left">左上</p> <p class="text-left">{pray.prayul}</p> </div> </div> <div class="col-xs-6"> <div class="alert alert-danger" type="button" data-toggle="modal" data-target="#upright" tabindex="0"> <p class="text-left">右上</p> <p class="text-left">{pray.prayur}</p> </div> </div> </div> <div class="row"> <div class="col-xs-6 col-xs-offset-3"> <div class="alert alert-default" type="button" data-toggle="modal" data-target="#gate" tabindex="0"> <p class="text-left">ゲート</p> <p class="text-left">{pray.praygt}</p> </div> </div> </div> <div class="row"> <div class="col-xs-6"> <div class="alert alert-info" type="button" data-toggle="modal" data-target="#lowleft" tabindex="0"> <p class="text-left">左下</p> <p class="text-left">{pray.prayll}</p> </div> </div> <div class="col-xs-6"> <div class="alert alert-success" type="button" data-toggle="modal" data-target="#lowright" tabindex="0"> <p class="text-left">右下</p> <p class="text-left">{pray.praylr}</p> </div> </div> </div> </div> <div class="col-sm-8"> <div class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title">ゲート情報</h4> </div> <div class="panel-body"> <p>テスト</p> </div> </div> </div> </div> <praymodal ref="modul" modid="upleft" modtitle="左上" modcolor="panel-warning"></praymodal> <praymodal ref="modur" modid="upright" modtitle="右上" modcolor="panel-danger"></praymodal> <praymodal ref="modgt" modid="gate" modtitle="ゲート" modcolor="panel-default"></praymodal> <praymodal ref="modll" modid="lowleft" modtitle="左下" modcolor="panel-info"></praymodal> <praymodal ref="modlr" modid="lowright" modtitle="右下" modcolor="panel-success"></praymodal> </section>', 'pray .alert-default,[data-is="pray"] .alert-default{ background-color: #f3f3f3; border-color: #f0f0f0; }', '', function(opts) {
    var self = this
    self.pray = {
      prayul: "タップしてね",
      prayur: "タップしてね",
      praygt: "タップしてね",
      prayll: "タップしてね",
      praylr: "タップしてね",
    }
    obs.on('oncalc', function(){
      self.pray.prayul = self.refs.modul.modalobj.prayed
      self.pray.prayur = self.refs.modur.modalobj.prayed
      self.pray.praygt = self.refs.modgt.modalobj.prayed
      self.pray.prayll = self.refs.modll.modalobj.prayed
      self.pray.praylr = self.refs.modlr.modalobj.prayed
      self.update()
    })

});

riot.tag2('praymodal', '<div class="modal" role="dialog" id="{opts.modid}"> <div class="modal-dialog"> <div class="modal-content {opts.modcolor}"> <div class="modal-header panel-heading"> <button class="close" type="button" data-dismiss="modal">&times;</button> <h4 class="modal-title">{opts.modtitle}: {modalobj.prayed} ({modalobj.minupdated})</h4> </div> <div class="modal-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label class="radio-inline" each="{elem}"> <input type="radio" name="elemradio" riot-value="{value}" onchange="{setval}"> {text} </label> </fieldset> <fieldset class="form-group"> <label class="radio-inline" each="{isgate}"> <input type="radio" name="gateradio" riot-value="{value}" onchange="{setval}"> {text} </label> </fieldset> <fieldset class="form-group"> <select class="form-control" name="seedselect"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" name="digitselect"></select> </fieldset> <fieldset class="form-group"> <div class="row"> <div class="col-xs-6"> <select class="form-control" name="sizeselect" onchange="{setval}"> <option each="{size}" riot-value="{value}">{text}</option> </select> </div> <div class="col-xs-6"> <select class="form-control" name="waveselect" onchange="{setval}"> <option each="{wave}" riot-value="{value}">{text}</option> </select> </div> </div> </fieldset> </form> </div> </div> </div> </div>', 'praymodal .panel-heading,[data-is="praymodal"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
    var self = this
    var seedselectized = []
    var digitselectized = []
    self.modalobj = {
      seedselect: "",
      selected: { name: "", hp: 0 },
      digitselect: "0",
      sizeselect: "1.72",
      waveselect: "1.0",
      prayed: "-",
      minupdated: "-分"
    }
    self.seeddef = seed.map(function(obj) {
      obj.extname += obj.name + convertToHira(obj.name)
      obj.elm += "all"
      obj.value = obj.name + "," + obj.hp + "," + obj.size
      return obj
    })
    this.setval = function(e) {
      self.modalobj[e.target.name] = e.target.value
      filterseed()
      calc()
    }.bind(this)
    function calc() {
      self.modalobj.selected = setseed(self.modalobj.seedselect)
      self.modalobj.prayed = objtopray(self.modalobj) + "%"
      self.update()
      obs.trigger('oncalc')
    }
    function convertToHira(str) {
      return str.replace(/[\u30a1-\u30f6]/g, function (match) {
        var chr = match.charCodeAt(0) - 0x60
        return String.fromCharCode(chr)
      })
    }
    function setseed(str) {
      var arr = str.split(",")
      return { name: arr[0], hp: Number(arr[1])/Number(arr[2]) }
    }
    function praycalc(seedhp,inputhp,scale,wave) {
      return Math.round((inputhp / seedhp*scale -1) * 100 / wave)
    }
    function objtopray(obj) {
      var seedhp = obj.selected.hp
      var inputhp = Number(obj.digitselect)
      var scale = Number(obj.sizeselect)
      var wave = Number(obj.waveselect)
      return praycalc(seedhp,inputhp,scale,wave).toLocaleString()
    }
    function filterseed() {
      self.seedfil = self.seeddef.filter(function(seed,index) {
        if((seed.elm).indexOf(self.modalobj.elemradio) >= 0) {
          if(self.modalobj.gateradio === "true") {
            if(seed.gate === true) return true
          } else return true
        }
      })
      seedselectized[0].selectize.clearOptions()
      seedselectized[0].selectize.addOption(self.seedfil)
      seedselectized[0].selectize.refreshOptions()
    }
    self.elem = [
      { text: "all", value: "all" },
      { text: "炎", value: "fire" },
      { text: "水", value: "water" },
      { text: "風", value: "wind" },
      { text: "光", value: "light" },
      { text: "闇", value: "dark" }
    ]
    self.isgate = [
      { text: "すべて", value: false },
      { text: "ゲートから出るもののみ", value: true }
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
      self.refs.formref.elemradio.value = "all"
      self.refs.formref.gateradio.value = "false"
      self.seedfil = self.seeddef

      $(function(){
        seedselectized = $(self.refs.formref.seedselect).selectize({
          options: self.seedfil,
          valueField: "value",
          labelField: "name",
          searchField: ["extname"],
          placeholder: "入力補完しますよ"
        })
        digitselectized = $(self.refs.formref.digitselect).selectize({
          options: [],
          valueField: "value",
          labelField: "text",
          searchField: ["value"],
          placeholder: "選択してください",
          load: function(query, callback) {
            if(!query.length) return callback()
            function expanddigit(val,dig) {
              return val * Math.pow(10, dig - String(val).length)
            }
            query = Number(query)
            callback([
              { text: expanddigit(query, 6).toLocaleString(), value: expanddigit(query, 6) },
              { text: expanddigit(query, 7).toLocaleString(), value: expanddigit(query, 7) },
              { text: expanddigit(query, 8).toLocaleString(), value: expanddigit(query, 8) },
              { text: expanddigit(query, 9).toLocaleString(), value: expanddigit(query, 9) },
              { text: expanddigit(query, 10).toLocaleString(), value: expanddigit(query, 10) }
            ])
          }
        })
        seedselectized.on('change', function(){
          self.modalobj.seedselect = this.value
          calc()
        })
        digitselectized.on('change', function(){
          self.modalobj.digitselect = this.value
          calc()
        })
      })
    })

});