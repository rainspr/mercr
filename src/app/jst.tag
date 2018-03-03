jst
	h4 現在時刻: { clock }

	script.
		var self = this
		self.serverlist = [
			'https://ntp-a1.nict.go.jp/cgi-bin/jsont',
			'https://ntp-b1.nict.go.jp/cgi-bin/jsont'
		]
		self.serverurl = self.serverlist[Math.floor(Math.random() * self.serverlist.length)]
		self.loaddate = Date.now()
		$.ajax({
			url: self.serverurl + "?" + (self.loaddate / 1000),
			dataType: "jsonp",
			jsonpCallback: "jsont"
		}).done(function(response) {
				self.datediff = ((response.st * 1000) + ((self.loaddate - (response.it * 1000)) / 2)) - self.loaddate
				updatetime()
		}).fail(function(response) {
				throw new Error("つながってない")
		})
		function updatetime() {
			self.nowdate = new Date(Date.now() + self.datediff)
			self.clock = dateprintf('%h時%i分%s.%u秒', self.nowdate)
			self.update()
			obs.trigger('onclock', dateprintf('%i', self.nowdate))
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


