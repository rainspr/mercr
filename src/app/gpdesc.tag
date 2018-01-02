gpdesc
	.panel.panel-default
		.panel-heading
			h4.panel-title ゲート保有GP: #[strong { gpValue }GP]
		.panel-body
			form(ref="formref", onsubmit="return false;")
				fieldset.form-group
					label 役職補正
					.btn-group.btn-group-sm(data-toggle="buttons")
						label.btn.btn-default(each="{ sally }", class="{ active: isactive }") #[input(type="radio", name="sallyRadio", autocomplete="off", value="{ value }")] { text }
				fieldset.form-group
					label クリア(分)
					.btn-group.btn-group-sm(data-toggle="buttons")
						label.btn.btn-default(each="{ lapMin }", class="{ active: isactive }") #[input(type="radio", name="lapMinRadio", autocomplete="off", value="{ value }")] { text }
				fieldset.form-group
					label クリア(秒)
					.btn-group.btn-group-sm(data-toggle="buttons")
						label.btn.btn-default(each="{ lapSec }", class="{ active: isactive }") #[input(type="radio", name="lapSecRadio", autocomplete="off", value="{ value }")] { text }
				fieldset.form-group(show="{ iscontinue }")
					label コンテ数
					.btn-group.btn-group-sm(data-toggle="buttons")
						label.btn.btn-default(each="{ contNum }", class="{ active: isactive }") #[input(type="radio", name="contNumRadio", autocomplete="off", value="{ value }")] { text }
				fieldset.form-group
					select.form-control(name="digitGP")

	script.
		var self = this
		self.iscontinue = false
		self.selectizedGP = []
		self.gpValue = "-"
		self.objGp = {
			sRadio: [],
			lmRadio: [],
			lsRadio: [],
			cnRadio: [],
			dGp: 0
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
			{ text: "7", value: "120", isactive: false },
			{ text: "8", value: "180", isactive: false },
			{ text: "9", value: "240", isactive: false },
			{ text: "10", value: "300", isactive: false },
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
			{ text: "8", value: "0.60", isactive: false },
		]
		function setValue() {
			let gValue = getgtValue({
				sValue: self.objGp.sRadio.value,
				cnValue: self.objGp.cnRadio.value,
				lmValue: self.objGp.lmRadio.value,
				lsValue: self.objGp.lsRadio.value,
				dGp: self.objGp.dGp
			})
			self.gpValue = numToString(gValue)
			self.update()
		}
		function getgtValue({ sValue, cnValue, lmValue, lsValue, dGp }) {
			let cleartime = 300 - lmValue - lsValue
			if(cleartime < 0) cleartime = 0
			let tb = 1 + 0.201 * cleartime / 300
			return ((dGp - 1000) / tb) / sValue / cnValue
		}
		function formatDigit(val,dig) {
			return val * Math.pow(10, dig - String(val).length)
		}
		function numToString(num) {
			var strarr = num.toString().split('.')
			strarr[0] = Number(strarr[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			return strarr[0]
		}
		self.on('mount', function() {
			self.objGp.sRadio = self.refs.formref.sallyRadio
			self.objGp.lmRadio = self.refs.formref.lapMinRadio
			self.objGp.lsRadio = self.refs.formref.lapSecRadio
			self.objGp.cnRadio = self.refs.formref.contNumRadio
			self.objGp.sRadio.value = "0.02"
			self.objGp.lmRadio.value = "0"
			self.objGp.lsRadio.value = "0"
			self.objGp.cnRadio.value = "1.00"

			$(function() {        
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
					},
					onChange: function(gp) {
						self.objGp.dGp = Number(gp)
						setValue()
					}
				})
				$(self.objGp.sRadio).change(function() {
					setValue()
				})
				$(self.objGp.lmRadio).change(function() {
					setValue()
				})
				$(self.objGp.lsRadio).change(function() {
					setValue()
				})
				$(self.objGp.cnRadio).change(function() {
					setValue()
				})
			})
		})


