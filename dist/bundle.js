
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

riot.tag2('pray', '<section> <h3>お祈り計算できるマン3.1</h3> <div class="row"> <div class="col-sm-4"> <h4 strong clock></h4> <div class="row"> <div class="col-xs-6"> <div class="alert alert-warning" type="button" data-toggle="modal" data-target="#upleft" tabindex="0"> <p class="text-left">左上</p> <p class="text-left">{pray.prayul}%</p> </div> </div> <div class="col-xs-6"> <div class="alert alert-danger" type="button" data-toggle="modal" data-target="#upright" tabindex="0"> <p class="text-left">右上</p> <p class="text-left">{pray.prayur}%</p> </div> </div> </div> <div class="row"> <div class="col-xs-6 col-xs-offset-3"> <div class="alert alert-default" type="button" data-toggle="modal" data-target="#gate" tabindex="0"> <p class="text-left">ゲート</p> <p class="text-left">{pray.praygt}%</p> </div> </div> </div> <div class="row"> <div class="col-xs-6"> <div class="alert alert-info" type="button" data-toggle="modal" data-target="#lowleft" tabindex="0"> <p class="text-left">左下</p> <p class="text-left">{pray.prayll}%</p> </div> </div> <div class="col-xs-6"> <div class="alert alert-success" type="button" data-toggle="modal" data-target="#lowright" tabindex="0"> <p class="text-left">右下</p> <p class="text-left">{pray.praylr}%</p> </div> </div> </div> </div> <div class="col-sm-8"> <div class="panel panel-default"> <div class="panel-heading"> <h4 class="panel-title">ゲート情報</h4> </div> <div class="panel-body"> <p>テスト</p> </div> </div> </div> </div> <praymodal modid="upleft" modcolor="panel-warning"></praymodal> <praymodal modid="upright" modcolor="panel-danger"></praymodal> <praymodal modid="gate" modcolor="panel-default"></praymodal> <praymodal modid="lowleft" modcolor="panel-info"></praymodal> <praymodal modid="lowright" modcolor="panel-success"></praymodal> </section>', 'pray .alert-default,[data-is="pray"] .alert-default{ background-color: #f3f3f3; border-color: #f0f0f0; }', '', function(opts) {
    this.pray = {
      prayul: "-",
      prayur: "-",
      praygt: "-",
      prayll: "-",
      praylr: "-"
    }

});

riot.tag2('praymodal', '<div class="modal" role="dialog" id="{opts.modid}"> <div class="modal-dialog"> <div class="modal-content {opts.modcolor}"> <div class="modal-header panel-heading"> <button class="close" type="button" data-dismiss="modal">&times;</button> <h4 class="modal-title">{modalobj.elemradio}/{modalobj.gateradio}/{modalobj.sizeselect}</h4> </div> <div class="modal-body"> <form ref="formref" onsubmit="return false;"> <fieldset class="form-group"> <label class="radio-inline" each="{elem}"> <input type="radio" name="elemradio" riot-value="{value}" onchange="{calc}"> {text} </label> </fieldset> <fieldset class="form-group"> <label class="radio-inline" each="{isgate}"> <input type="radio" name="gateradio" riot-value="{value}" onchange="{calc}"> {text} </label> </fieldset> <fieldset class="form-group"> <select class="form-control" name="seedselect" onchange="{calc}"></select> </fieldset> <fieldset class="form-group"> <select class="form-control" name="hpselect" onchange="{calc}"></select> </fieldset> <fieldset class="form-group form-inline"> <select class="form-control" name="sizeselect" onchange="{calc}"> <option each="{size}" riot-value="{value}">{text}</option> </select> <select class="form-control"> <option each="{wave}" riot-value="{value}">{text}</option> </select> </fieldset> </form> </div> </div> </div> </div>', 'praymodal .panel-heading,[data-is="praymodal"] .panel-heading{ border-top-left-radius: inherit; border-top-right-radius: inherit; }', '', function(opts) {
    var self = this
    var seedselectized
    var hpselectized
    var query = 0
    self.modalobj = {
      elemradio: "all",
      gateradio: "false",
      sizeselect: "1.72",
      waveselect: "1.0"
    }
    self.seedcvt = seed.map(function(obj) {
      obj.extname += obj.name + convertToHira(obj.name)
      obj.elm += "all"
      return obj
    })

    this.calc = function(e) {
      self.modalobj[e.target.name] = e.target.value
      filterseed()
      setdigit()
    }.bind(this)
    function convertToHira(str) {
      return str.replace(/[\u30a1-\u30f6]/g, function (match) {
        var chr = match.charCodeAt(0) - 0x60
        return String.fromCharCode(chr)
      })
    }
    function filterseed() {
      self.seedfil = self.seedcvt.filter(function(seed,index) {
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
    function setdigit() {
      query = hpselectized[0].selectize.query
      hpselectized[0].selectize.clearOptions()
      hpselectized[0].selectize.addOption(self.digit)
      hpselectized[0].selectize.refreshOptions()
    }
    function expanddigit(val,dig) {
      return val * Math.pow(10, dig - String(val).length)
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
    self.digit = [
      { text: expanddigit(query, 6).toLocaleString(), value: expanddigit(query, 6) },
      { text: expanddigit(query, 7).toLocaleString(), value: expanddigit(query, 7) },
      { text: expanddigit(query, 8).toLocaleString(), value: expanddigit(query, 8) },
      { text: expanddigit(query, 9).toLocaleString(), value: expanddigit(query, 9) },
      { text: expanddigit(query, 10).toLocaleString(), value: expanddigit(query, 10) }
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
      self.seedfil = self.seedcvt
      var seedref = self.refs.formref.seedselect
      var hpref = self.refs.formref.hpselect

      $(function(){
        seedselectized = $(seedref).selectize({
          options: self.seedfil,
          valueField: "name",
          labelField: "name",
          searchField: ["extname"],
          placeholder: "入力補完しますよ"
        })
        hpselectized = $(hpref).selectize({
          options: self.digit,
          valueField: "value",
          labelField: "name",
          searchField: ["value"],
          placeholder: "桁を選択して下さい"
        })
        hpselectized[0].selectize.on("type", function(){
          console.info(hpselectized[0].selectize.query)
        })
      })
    })

});