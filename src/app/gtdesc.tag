gtdesc
	.panel.panel-default
		.panel-heading
			h4.panel-title ゲート詳細(祈り: { pray.toLocaleString() }%)
		.panel-body
			form(ref="listref")
				label.checkbox-inline(each="{ list }") #[input(type="checkbox", value="{ index }", checked="{ checked }", onclick="{ parent.toggle }")] { index }
				table.table
					thead: tr
						th(each="{ item in tablelist }") { item.index }
					tbody: tr(each="{ seed in gtseed }")
						th(each="{ item in tablelist }") { seed[item.seedid] }
			
	script.
		this.list = [
			{ index: "名前", seedid: "name", checked: true },
			{ index: "リーチ", seedid: "reach", checked: true },
			{ index: "範囲", seedid: "range", checked: false },
			{ index: "段数", seedid: "cmb", checked: false },
			{ index: "外皮", seedid: "skin", checked: true },
			{ index: "予想体力(1.75)", seedid: "midhp", checked: false }
		]
		this.pray = 0
		this.tablelist = createlist(this.list)
		function createlist(list) {
			return list.filter(l => l.checked === true)
		}
		toggle(e) {
			let item = e.item
			item.checked = !item.checked
			this.tablelist = createlist(this.list)
			this.update()
		}
		this.pray = 0
		this.gtseed = []
		this.obs.on("oncalc", (pnum, pray) => {
			if(pnum === "2") {
				this.pray = pray
				this.gtseed = calchp(this.gtseed, this.pray)
				this.update()
			}
		})
		this.obs.on("onselect", (selected) => {
			this.gtseed = calchp(selected, this.pray)
			this.update()
		})
		function calchp(seed = {hp: 0, size: 1.72}, pray = 0) {
			return seed.map((s, index) => {
				s.midhp = numToString(s.hp / s.size * 1.750 * (1 + pray/100) * (1 + index))
				return s
			})
		}
		function numToString(num) {
			var strarr = num.toString().split('.')
			strarr[0] = Number(strarr[0]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
			return strarr[0]
		}

