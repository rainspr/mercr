app
	section.container
		h3 お祈り計算v4 
			small (更新:{ document.lastModified })
		jst
		.row
			.col-md-4
				#gnav
					#layer
						.row
							.col-xs-6
								button.btn-block.alert.alert-warning(value="0" tabindex="0" onclick="{ toggle }")
									p.text-left 左上({ min[0] }分)
									p.text-left: strong { prayed[0] }
							.col-xs-6
								button.btn-block.alert.alert-danger(value="1" tabindex="0" onclick="{ toggle }")
									p.text-left 右上({ min[1] }分)
									p.text-left: strong { prayed[1] }
						.row
							.col-xs-6.col-xs-offset-3
								button.btn-block.alert.alert-default(value="2" tabindex="0" onclick="{ toggle }")
									p.text-left ゲート({ min[2] }分)
									p.text-left: strong { prayed[2] }
						.row
							.col-xs-6
								button.btn-block.alert.alert-info(value="3" tabindex="0" onclick="{ toggle }")
									p.text-left 左下({ min[3] }分)
									p.text-left: strong { prayed[3] }
							.col-xs-6
								button.btn-block.alert.alert-success(value="4" tabindex="0" onclick="{ toggle }")
									p.text-left 右下({ min[4] }分)
									p.text-left: strong { prayed[4] }
				div(show="{ show[0] }")
					prpanel(ptitle="左上", pcolor="panel-warning", pnum="0")
				div(show="{ show[1] }")
					prpanel(ptitle="右上", pcolor="panel-danger", pnum="1")
				div(show="{ show[2] }")
					gtpanel(ptitle="ゲート", pcolor="panel-default", pnum="2")
				div(show="{ show[3] }")
					prpanel(ptitle="左下", pcolor="panel-info", pnum="3")
				div(show="{ show[4] }")
					prpanel(ptitle="右下", pcolor="panel-success", pnum="4")
			.col-md-8
				gtdesc
				gpdesc



	script.
		this.show = [false, false, true, false, false]
		this.min = ["-", "-", "-", "-", "-"]
		this.prayed = ["タップしてね", "タップしてね", "タップしてね", "タップしてね", "タップしてね"]
		this.clockmin = ""

		this.on('mount', () => {
			console.log('app.tag mounted', opts)
		})

		this.toggle = function(e) {
			this.show = [false, false, false, false, false]
			let num = Number(e.currentTarget.value)
			this.show[num] = true
		}
		obs.on("oncalc", (pnum, pray) => {
			let num = Number(pnum)
			this.prayed[num] = pray.toLocaleString() + "%"
			this.min[num] = this.clockmin
			this.update()
		})
		obs.on('onclock', (clockmin) => {
			this.clockmin = clockmin
		})


	style.
		.alert-default {
			background-color: #f5f5f5;
			border-color: #ddd;
		}
		#gnav {
			background: url("ettaso.jpeg") no-repeat center center;
			background-size: contain;
		}
		#layer {
			background-color: rgba(255,255,255,0.5);
		}
