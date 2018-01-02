prpanel
	.panel(class="{ opts.pcolor }")
		.panel-heading
			h4.panel-title { opts.ptitle }: #[strong { prayed }%] ({ minUpdated }分)
		.panel-body
			form(ref="formref", onsubmit="return false;")
				fieldset.form-group
					label wave
					.btn-group.btn-group-sm(data-toggle="buttons")
						label.btn.btn-default(each="{ wave }", class="{ active: isactive }") #[input(type="radio", name="waveRadio", autocomplete="off", value="{ value }")] { text }
				fieldset.form-group
					label サイズ
					.btn-group.btn-group-sm(data-toggle="buttons")
						label.btn.btn-default(each="{ size }", class="{ active: isactive }") #[input(type="radio", name="sizeRadio", autocomplete="off", value="{ value }")] { text }
				fieldset.form-group
					label 属性
					.btn-group.btn-group-sm(data-toggle="buttons")
						label.btn.btn-default(each="{ elem }", class="{ active: isactive }") #[input(type="radio", name="elemRadio", autocomplete="off", value="{ value }")] { text }
				fieldset.form-group
					select.form-control(ref="seedref", placeholder="シード名")
				fieldset.form-group
					select.form-control(ref="digitref", placeholder="体力")

	script.
		var self = this
		import {seedDef} from './seedlist.js'
		self.prayed = "-"
		self.clockmin = ""
		self.minUpdated = "-"
		self.eRadio = []
		self.sRadio = []
		self.wRadio = []
		self.seedFiltered = []
		self.seedObj = {}
		self.seedHp = 0
		self.seedSelectized = []
		self.digitSelectized = []
		self.wave = [
			{ text: "1体目", isactive: true, value: 1.0 },
			{ text: "2体目", isactive: false, value: 1.2 },
			{ text: "3体目", isactive: false, value: 1.4 },
			{ text: "4体目", isactive: false, value: 1.6 },
			{ text: "5体目", isactive: false, value: 1.8 }
		]
		self.size = [
			{ text: "1.72", isactive: true, value: 1.72 },
			{ text: "1.75", isactive: false, value: 1.75 },
			{ text: "1.80", isactive: false, value: 1.80 },
			{ text: "1.00", isactive: false, value: 1.00 }
		]
		self.elem = [
			{ text: "すべて", isactive: true, value: "all" },
			{ text: "炎", isactive: false, value: "fire" },
			{ text: "水", isactive: false, value: "water" },
			{ text: "風", isactive: false, value: "wind" },
			{ text: "光", isactive: false, value: "light" },
			{ text: "闇", isactive: false, value: "dark" }
		]

		function setFilter() {
			if(self.eRadio.value === "all") {
				self.seedFiltered = seedDef
			} else {
				self.seedFiltered = seedDef.filter(s => s.elm === self.eRadio.value)
			}
			refresh(self.seedSelectized, self.seedFiltered)
		}
		function refresh(selectized, option) {
			let control = selectized[0].selectize
			control.clearOptions()
			control.addOption(option)
			control.refreshOptions()
		}
		function setSeed(seed) {
			let obj = seedDef.filter(s => s.name === seed)[0]
			if(obj) {
				self.seedObj = obj
			}
		}
		function setVal() {
			let pray = calcPray({
				seedhp: self.seedObj.hp,
				seedsize: self.seedObj.size,
				inputhp: self.seedHp,
				scale: self.sRadio.value,
				wave: self.wRadio.value
			})
			if(pray > 0) {
				self.prayed = pray.toLocaleString()
			} else {
				self.prayed = "0"
			}
			self.minUpdated = self.clockmin
			self.obs.trigger("oncalc", opts.pnum, pray)
			self.update()
		}
		function formatDigit(val,dig) {
			return val * Math.pow(10, dig - String(val).length)
		}
		function calcPray({ seedhp = 0, seedsize = 1.72, inputhp, scale, wave }) {
			return Math.round((inputhp / (seedhp/seedsize*scale) -1) * 100 / wave)
		}
		self.obs.on('onclock', function(clockmin) {
			self.clockmin = clockmin
		})

		self.on('mount', () => {
			self.wRadio = self.refs.formref.waveRadio
			self.sRadio = self.refs.formref.sizeRadio
			self.eRadio = self.refs.formref.elemRadio
			self.wRadio[0].checked = true
			self.sRadio[0].checked = true
			self.eRadio[0].checked = true
			self.seedFiltered = seedDef
			$(function() {
				self.seedSelectized = $(self.refs.seedref).selectize({
					options: self.seedFiltered,
					valueField: "name",
					labelField: "name",
					searchField: ["extname"],
					placeholder: "シード名",
					onChange: function(seed) {
						setSeed(seed)
						setVal()
					}
				})
				$(self.wRadio).change(function() {
					setVal()
				})
				$(self.sRadio).change(function() {
					setVal()
				})
				$(self.eRadio).change(function() {
					setFilter()
				})
				self.digitSelectized = $(self.refs.digitref).selectize({
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
					},
					onChange: function(hp) {
						self.seedHp = Number(hp)
						setVal()
					}
				})
			})
		})


	style.
		.panel-heading {
			border-top-left-radius: inherit;
			border-top-right-radius: inherit;
		}
