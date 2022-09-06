(function ($) {
  'use strict'
  document.addEventListener('DOMContentLoaded', function () {
    // eslint-disable-next-line camelcase
    const selected_day = getCookie('selected_day')
    // eslint-disable-next-line camelcase
    const today = selected_day ? new Date(selected_day) : new Date()
    let year = today.getFullYear()
    let month = today.getMonth()
    const monthTag = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let day = today.getDate()
    const days = document.getElementsByTagName('td')
    let selectedDay
    let setDate
    let daysLen = days.length
    // options should like '2014-01-01'
    function Calendar (selector, options) {
      this.options = options
      this.draw()
    }
    // 取cookies
    function getCookie (name) {
      let arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
      if (arr != null) return unescape(arr[2]);
      return null;
    }
    // 刪除cookie
    function delCookie (name) {
      var exp = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = getCookie(name);
      if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
      }
    }

    Calendar.prototype.draw = function () {
      this.getCookie('selected_day')
      this.getOptions()
      this.drawDays()
      const that = this
      const reset = document.getElementById('reset')
      const pre = document.getElementsByClassName('pre-button')
      const next = document.getElementsByClassName('next-button')

      pre[0].addEventListener('click', function () { that.preMonth() })
      next[0].addEventListener('click', function () { that.nextMonth() })
      reset.addEventListener('click', function () { that.reset() })
      while (daysLen--) {
        days[daysLen].addEventListener('click', function () { that.clickDay(this) })
      }
    }
    // left hand draw (show day and mon)
    Calendar.prototype.drawHeader = function (e) {
      const headDay = document.getElementsByClassName('head-day')
      const headMonth = document.getElementsByClassName('head-month')
      e ? headDay[0].innerHTML = e : headDay[0].innerHTML = day
      headMonth[0].innerHTML = monthTag[month] + ' - ' + year
    }

    Calendar.prototype.drawDays = function () {
      // record start day from which month
      const startDay = new Date(year, month, 1).getDay()
      // 計算這個月總共天數
      const nDays = new Date(year, month + 1, 0).getDate()

      let n = startDay
      // 清除原来的样式和日期 set every day to show ''
      for (let k = 0; k < 42; k++) {
        days[k].innerHTML = ''
        days[k].id = ''
        days[k].className = ''
      }
      // update right hand show current month day
      for (let i = 1; i <= nDays; i++) {
        days[n].innerHTML = `<a href="/records?date=${year}-${month + 1}-${i}">${i}</a>`
        // days[n].innerHTML = i
        n++
      }

      // update proper id to every day
      for (let j = 0; j < 42; j++) {
        if (days[j].innerHTML === '') {
          // update id='disabled' to day for disabled hover feature
          days[j].id = 'disabled'
        } else if (j === day + startDay - 1) {
          // update id='today' to right hand day for show diff color
          if ((this.options && (month === setDate.getMonth()) && (year === setDate.getFullYear())) || (!this.options && (month === today.getMonth()) && (year === today.getFullYear()))) {
            if (!selectedDay) this.drawHeader(day)
            days[j].id = 'today'
            days[j].firstElementChild.id = 'today'
          }
        }
        if (selectedDay) {
          // if selectDay exist update id='selected' to right hand day
          if ((j === selectedDay.getDate() + startDay - 1) && (month === selectedDay.getMonth()) && (year === selectedDay.getFullYear())) {
            days[j].className = 'selected'
            days[j].firstElementChild.className = 'selectedHref'
            this.drawHeader(selectedDay.getDate())
          }
        }
      }
    }

    // when user click day put className='selected' to day, for show diff color
    Calendar.prototype.clickDay = function (o) {
      const selected = document.getElementsByClassName('selected')
      const selectedHref = document.getElementsByClassName('selectedHref')
      const len = selected.length
      // 清除上一筆click的資料
      if (len !== 0) {
        selected[0].className = ''
        selectedHref[0].className = ''
      }
      o.className = 'selected'
      o.firstElementChild.className = 'selectedHref'
      selectedDay = new Date(year, month, o.innerText)
      this.drawHeader(o.innerText)
      this.setCookie('selected_day', 1)
    }

    Calendar.prototype.preMonth = function () {
      if (month < 1) {
        month = 11
        year = year - 1
      } else {
        month = month - 1
      }
      this.drawHeader(1)
      this.drawDays()
    }

    Calendar.prototype.nextMonth = function () {
      if (month >= 11) {
        month = 0
        year = year + 1
      } else {
        month = month + 1
      }
      this.drawHeader(1)
      this.drawDays()
    }

    Calendar.prototype.getOptions = function () {
      if (this.options) {
        const sets = this.options.split('-')
        setDate = new Date(sets[0], sets[1] - 1, sets[2])
        day = setDate.getDate()
        year = setDate.getFullYear()
        month = setDate.getMonth()
      }
    }

    Calendar.prototype.reset = function () {
      month = today.getMonth()
      year = today.getFullYear()
      day = today.getDate()
      this.options = undefined
      this.selectedDay = null
      delCookie('selected_day')
      this.drawDays()
    }

    Calendar.prototype.setCookie = function (name, expiredays) {
      if (expiredays) {
        const date = new Date()
        date.setTime(date.getTime() + (expiredays * 24 * 60 * 60 * 1000))
        var expires = '; expires=' + date.toGMTString()
      } else {
        var expires = ''
      }
      document.cookie = name + '=' + selectedDay + expires + '; path=/'
    }

    Calendar.prototype.getCookie = function (name) {
      if (document.cookie.length) {
        const arrCookie = document.cookie.split(';')
        const nameEQ = name + '='
        for (let i = 0, cLen = arrCookie.length; i < cLen; i++) {
          let c = arrCookie[i]
          while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length)
          }
          if (c.indexOf(nameEQ) === 0) {
            selectedDay = new Date(c.substring(nameEQ.length, c.length))
          }
        }
      }
    }
    const calendar = new Calendar()
  }, false)
})(jQuery)
