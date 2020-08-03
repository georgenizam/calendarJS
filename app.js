let view = {

  createEl: function ({tag, classes, attrs, innerHtml}) {    
    let el = document.createElement(tag);
    classes.forEach(function(item) {
      el.classList.add(item);
    });
    attrs.forEach(function(item) {
      el.setAttribute(item.name, item.value);  
    });    
    el.innerHTML = innerHtml;
    return el;
  },

  displayEditForm: function({nameEvent, date ,descrEvent} = {}) {
    let formWrap = this.createEl({ tag: 'div', classes: ['edit-form-wrap'], attrs: [], innerHtml: '' });
    let form = this.createEl({ tag: 'form', classes: ['edit-form'], attrs: [], innerHtml: '' });
    form.appendChild(this.createEl({ tag: 'div', classes: [], attrs: [{name: 'id', value: 'btn-form-close'}], innerHtml: '' })); 
    form.appendChild(this.createEl({ tag: 'input', classes: ['name-event'], attrs: [{name: 'autocomplete', value: 'off'}], innerHtml: nameEvent }));
    form.appendChild(this.createEl({ tag: 'input', classes: ['date-time'], attrs: [{name: 'date-time', value: ''}, {name: 'autocomplete', value: 'off'}], innerHtml: date }));    
    form.appendChild(this.createEl({ tag: 'textarea', classes: [], attrs: [], innerHtml: descrEvent }));
    
    let actions = this.createEl({ tag: 'div', classes: ['actions'], attrs: [], innerHtml: '' });
    actions.appendChild(this.createEl({ tag: 'button', classes: ['btn-form-edit'], attrs: [], innerHtml: 'edit' }));
    actions.appendChild(this.createEl({ tag: 'button', classes: ['btn-form-clear'], attrs: [], innerHtml: 'clear' }));
    form.appendChild(actions);
    formWrap.append(form);

    return formWrap;    
  },

  dayItem: function({number, eventDescr, time, callBack}) {
    let htmlContentElement = `
    <div class="item">
      <p class="day_number">${number}</p>
      <p class="day_descr">${eventDescr}</p>
    </div>
    `;
    let elObj = {
      tag: 'div',
      classes: ['item-wrap'],
      attrs: [{name: 'data-time', value: time}],
      innerHtml: htmlContentElement
    }        
    let elDay = this.createEl(elObj);
    elDay.onclick = callBack;
    return elDay;
  },

  searchItem: function(eventObj) {    
    let date = new Date(eventObj.dateEvent);
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let year = date.getFullYear();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();          
    let htmlContentElement = `
    <p>
      <span>${eventObj.nameEvent}</span>
      <span>${day}.${month}.${year} - ${hours}:${minutes}</span>
      ${eventObj.descrEvent}
    </p>
    `;
    let elObj = {
      tag: 'div',
      classes: ['item'],
      attrs: [{name: 'data-time-search', value: date.setHours(0, 0, 0, 0)}],
      innerHtml: htmlContentElement
    }  
    let itemEl = this.createEl(elObj);
    return itemEl;

  },

  updateDayItem: function({dateEventNew, nameEvent, descrEvent, clearEvent = false}) {
    let date = new Date(dateEventNew);
    let day = date.getDate();
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let year = date.getFullYear();
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let htmlContentElement;

    if (!clearEvent) {
      day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      htmlContentElement = `
      <div class="item">
        <p class="day_number">${day}</p>
        <p class="day_descr">
            <span>${nameEvent}</span>
            <span>${day}.${month}.${year} - ${hours}:${minutes}</span>
            ${descrEvent}<br><br>
        </p>
      </div>
      `;      
      let el = document.querySelector(`[data-time="${date.setHours(0, 0, 0, 0)}"]`);      
      el.innerHTML = htmlContentElement;      
    }
    else {
      htmlContentElement = `
      <div class="item">
        <p class="day_number">${day}</p>
        <p class="day_descr"></p>
      </div>
      `;

      let el = document.querySelector(`[data-time="${date.setHours(0, 0, 0, 0)}"]`);      
      el.innerHTML = htmlContentElement;      
    }
  },

  weekdaysItem: function({weekdays}) {
    let weekdaysUlElem = this.createEl({ tag: 'ul', classes: ['weekdays'], attrs: [], innerHtml: '' });
    for (item in weekdays) {
      let liElem = this.createEl({ tag: 'li', classes: [], attrs: [], innerHtml: `${weekdays[item]}`});
      weekdaysUlElem.appendChild(liElem);
    }
    return weekdaysUlElem;
  },

  monthItem: function({month, year, events, callBackForDay}) {   
    let elMonth = this.createEl({ tag: 'div', classes: ['month'], attrs: [], innerHtml: '' }); 
    let elTitle = this.createEl({ tag: 'div', classes: ['title'], attrs: [], innerHtml: '' });
    elTitle.appendChild(this.createEl({ tag: 'p', classes: ['current-month'], attrs: [], innerHtml: `${month.nameMonth}` }));
    elTitle.appendChild(this.createEl({ tag: 'span', classes: [], attrs: [], innerHtml: '-' }));
    elTitle.appendChild(this.createEl({ tag: 'p', classes: ['current-year'], attrs: [], innerHtml: `${year}` }));
    elMonth.appendChild(elTitle);
    let weekdaysList = this.weekdaysItem({weekdays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']});
    elMonth.appendChild(weekdaysList);
    let elMonthItems = this.createEl({ tag: 'div', classes: ['month-items'], attrs: [], innerHtml: '' });
    elMonth.appendChild(elMonthItems);

    let firstDayTime = new Date(`${month.nameMonth} 1, ${year} 00:00:00`);
    
    let amountLeft = firstDayTime.getDay() === 0 ? 6 : firstDayTime.getDay() - 1;
    for (let i=0; i<amountLeft; i++) {
      elMonthItems.appendChild( this.createEl({tag: 'div', classes: ['item-wrap'], attrs: [], innerHtml: ''}) );
    };

    for (let i=1; i<=month.amountDays; i++) {      
      let minDayTime = Date.parse(`${month.nameMonth} ${i}, ${year} 00:00:00`);
      let maxDayTime = minDayTime + (1000 * 60 * 60 * 24);      
      let dayObj = {
        number: i,
        eventDescr: "",
        time: minDayTime,
        callBack: callBackForDay
      }      
      for (let item in events) {
        
        if (events[item].dateEvent >= minDayTime && events[item].dateEvent < maxDayTime) {
          let date = new Date(events[item].dateEvent);
          let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
          let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
          let year = date.getFullYear();
          let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
          let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

          dayObj.eventDescr += `
          <span>${events[item].nameEvent}</span>
          <span>${day + "." + month + "." + year + " - " + hours + ":" + minutes}</span>
          ${events[item].descrEvent} <br><br>`
        }        
      }      
      elMonthItems.appendChild(this.dayItem(dayObj));
    }
    return elMonth;
  },

  displayAddForm: function() {
    let el = document.getElementsByClassName('add-form-wrap')[0];
    (el.getElementsByTagName('input')[0]).value = "";
    el.style.cssText = "display: block;";
  },

  displayResultsSearch: function(arrayEvents, callback) {
    let resultsEl = this.createEl({tag: 'div', classes: ['results'], attrs: [], innerHtml: ''});
    (document.getElementsByClassName('search')[0]).appendChild(resultsEl);

    arrayEvents.forEach(function(item) {      
      let elSerach = view.searchItem(item)
      elSerach.onclick = function() {        
        let valDataTime = this.getAttribute('data-time-search');        
        callback(valDataTime);        
      };
      resultsEl.appendChild(elSerach);
    });
  },

  closeResultsSearch: function() {
    let elDel = document.querySelector('.results');
    let inp = document.getElementById('search');
    inp.value = '';
    if (elDel) {      
      elDel.parentNode.removeChild(elDel);
    }
  },

  closeAddForm: function() {
    let el = document.getElementsByClassName('add-form-wrap')[0];
    el.style.cssText = "display: none;";
  },

  checkUpdateCalendar: function({yearCurrent, event}) {
    let yearMinTime = Date.parse(`Jan 01 ${yearCurrent}`);
    let yearMaxTime = Date.parse(`Jan 01 ${yearCurrent+1}`);
    if (event.dateEvent <= yearMinTime || event.dateEvent > yearMaxTime) {
      return true;
    }
    else {
      return false;
    }
  },

  updateCalendar: function({year, curYear, events, months, callBackForDay, prePend} = {}){
    let calendar = document.getElementById('calendarId');    
    if (prePend) {
      for (let i = months.length-1; i>=0; i--) {      
        let month = view.monthItem({month: months[i], year: year, events: events, callBackForDay: callBackForDay });
        calendar.prepend(month);         
      }  
    }
    else {
      for (item in months) {
        let month = view.monthItem({month: months[item], year: year, events: events, callBackForDay: callBackForDay });      
        calendar.append(month);        
      }  
    }
  },
  
	displayCalendar: function({year, events, months, callBackForDay} = {}){    
    let calendar = document.getElementById('calendarId');    
    calendar.append(this.displayEditForm());
    for (item in months) {
      let month = view.monthItem({month: months[item], year: year, events: events, callBackForDay: callBackForDay });      
      calendar.append(month);      
    }    
	},
};

let model = {

  year: 2020,  
  months: [ 
    { nameMonth: 'Jan', amountDays: 31 }, 
    { nameMonth: 'Feb', amountDays: 28} , 
    { nameMonth: 'Mar', amountDays: 31 }, 
    { nameMonth: 'Apr', amountDays: 30 }, 
    { nameMonth: 'May', amountDays: 31 }, 
    { nameMonth: 'Jun', amountDays: 30 }, 
    { nameMonth: 'Jul', amountDays: 31 }, 
    { nameMonth: 'Aug', amountDays: 31 }, 
    { nameMonth: 'Sep', amountDays: 30 }, 
    { nameMonth: 'Oct', amountDays: 31 }, 
    { nameMonth: 'Nov', amountDays: 30 }, 
    { nameMonth: 'Dec', amountDays: 31 } ],

  events: [],  

  initEvents: function() {

    let eventsTmp = [       
      {  
        nameEvent: "testEvent1",
        dateEvent: 1596748980000,
        descrEvent: "description event1"                   
      },
      {  
        nameEvent: "testEvent2",
        dateEvent: 1597009930000,
        descrEvent: "description event2"                   
      }
    ];
    
    if (!localStorage.events) {
      localStorage.events = JSON.stringify(eventsTmp) || '[]';
      this.events = eventsTmp;
      return;
    }
    let objsLocalStorage = JSON.parse(localStorage.events, '[{"nameEvent": "TestEventName", "dateEvent": 1596229200000, "descrEvent": "description test event"}]')
    
    let arrayKeysEtalon = Object.keys(eventsTmp[0]);
    for (item in objsLocalStorage) {
      let arrayKeys = Object.keys(objsLocalStorage[item]);
      if (arrayKeysEtalon.length !== arrayKeys.length) {
        localStorage.clear();
        localStorage.events = JSON.stringify(eventsTmp) || '[]';
        this.events = eventsTmp;        
        break;
      }
      else {
        let flagOut = false;
        for (itemKey in arrayKeysEtalon) {
          if (arrayKeysEtalon[itemKey] !== arrayKeys[itemKey]) {
            flagOut = true;
            break;
          }
        }
        if (flagOut) {
          localStorage.clear();
          localStorage.events = JSON.stringify(eventsTmp) || '[]';
          this.events = eventsTmp;
          break;
        }
        else {
          this.events = objsLocalStorage;
        }
      }      
    }
  },

  searchEventByName: function(nameEvent) { 
    if (nameEvent === '') {
      return [];
    }
    let results = this.events.filter(item => item.nameEvent.includes(nameEvent));
    return results;
  },

  addEvent: function(obj) {
    const index = this.events.findIndex(item => JSON.stringify(item) === JSON.stringify(obj))
    if (index === -1) {
      this.events.push(obj);     
    }    
    this.sortEvents();
    localStorage.events = JSON.stringify(this.events) || '[]';
  },

  deleteEvent: function(obj) {
    const index = this.events.findIndex(item => JSON.stringify(item) === JSON.stringify(obj))
    if (index !== -1) {
      this.events.splice(index, 1);
    }
    this.sortEvents();    
    localStorage.events = JSON.stringify(this.events) || '[]';
  },

  changeEvent: function(oldObj, newObj) {    
    const index = this.events.findIndex(item => JSON.stringify(item) === JSON.stringify(oldObj))
    if (index !== -1) {
      this.events[index] = newObj;
    }    
    this.sortEvents();
    localStorage.events = JSON.stringify(this.events) || '[]';
  },

  sortEvents: function() {
    this.events.sort((a, b) => a.dateEvent > b.dateEvent ? 1 : -1);
  },

  isLeapYear: function(year) {
    return (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0));
  },


  generateCalendar: function(callBackForDay) {        
    this.initEvents();
    this.year = (new Date).getFullYear();
    if (this.isLeapYear(this.year)) {
      this.months[1].amountDays = 29;
    }    

    return {
      year: this.year,
      months: this.months,
      events: this.events,
      callBackForDay: callBackForDay
    };
  }

};


let controller = {
  
  oldObjectEvent: {},
  init: false,
  minYear: 0,
  maxYear: 0,
  flagTop: false,
  flagBottom: false,

  curDateBtnClick: function() {    
    let curDate = new Date();
    curDate.setHours(0, 0, 0, 0);    
    curDate = curDate.getTime();

    let hidElemen = document.querySelector(`[data-time="${curDate}"]`);    
    hidElemen.scrollIntoView( {block: "center", behavior: "smooth"} );
    hidElemen.querySelector('.item').classList.add('active');
    setTimeout(function() {
      hidElemen.querySelector('.item').classList.remove('active');
    }, 1500);    
  },

  btnFormCloseClick: function() {    
    let bodyTag = document.getElementsByTagName('body')[0];
    bodyTag.classList.toggle('no-scroll');    
    let el = document.getElementsByClassName('edit-form-wrap')[0];
    el.style.cssText = "display: none;";    
  },

  addEventBtnClick: function() {    
    view.displayAddForm();    
    let btnAddEvent = document.getElementsByClassName('btn-form-add')[0];
    btnAddEvent.onclick = controller.btnAddEventClick.bind(controller);
    let btnCloseAddEvent = document.getElementsByClassName('btn-form-close')[0];
    btnCloseAddEvent.onclick = controller.btnCloseAddEventClick.bind(controller);
    
  },

  checkDateInput: function(str) {
    let arrDate = str.split(' ');    
    arrDate[0] = arrDate[0].replace(/[^A-Za-z]/g, '');
    arrDate[1] = arrDate[1].replace(/[^0-9]/g, '');
    arrDate[2] = arrDate[2].replace(/[^0-9]/g, '');
    arrDate[3] = arrDate[3].replace(/[^0-9:]/g, '');    

    let months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    let time = arrDate[3].split(':');
    let hours = time[0].trim();
    let mins = time[1].trim();

    let checkMonth = (arrDate[0].length !== 3)  || !months.includes(arrDate[0].toLocaleLowerCase());
    let checkDate = (arrDate[1].trim().length < 1) || (arrDate[1].trim().length > 2);
    let checkYear = (arrDate[2].trim().length !== 4);
    let checkTime = (hours < 0) || (hours > 23) || (mins < 0) || (mins > 60);

    if ( checkMonth || checkDate || checkYear || checkTime ) {
      alert('введите правильную дату');
      return false;
    }
    return true;
  },

  btnAddEventClick: function (e) {
    e.preventDefault();
    let el = document.getElementsByClassName('add-form-wrap')[0];
    let valueInput = (el.getElementsByTagName('input')[0]).value;
    let arrValueInput = valueInput.split(',');
    if (arrValueInput.length === 3) {      
      if (this.checkDateInput(arrValueInput[0])) {
        let firstParam = arrValueInput[0].toLocaleLowerCase().split(' ');
        let secondParam = arrValueInput[1].trim();
        let thirdParam = arrValueInput[2].trim();        

        let month = firstParam[0].trim().toLocaleLowerCase();
        let day = firstParam[1].trim();
        let year = firstParam[2].trim();

        let time = firstParam[3].split(':');
        let hours = time[0].trim();
        let mins = time[1].trim();
        
        let objEvent = {  
          nameEvent: secondParam,
          dateEvent: Date.parse(`${month} ${day} ${year} ${hours}:${mins}`),
          descrEvent: thirdParam
        };

        model.addEvent(objEvent);
        if ( view.checkUpdateCalendar({yearCurrent: model.year, event: objEvent}) ) {          
          let yearForAdd;
          let prePendFlag;
          let addNumYear;
          if (Number(year) < Number(model.year)) {
            yearForAdd = model.year;            
            prePendFlag = true;
            addNumYear = -1;            
          }
          else {
            yearForAdd = model.year;
            prePendFlag = false;
            addNumYear = 1;            
          }

          for (let i=0; i<( Math.abs(model.year - year)); i++) {            
            yearForAdd += addNumYear;
            view.updateCalendar({year: yearForAdd, curYear: model.year, events: model.events, months: model.months, callBackForDay: controller.clickOnDay, prePend: prePendFlag});
                        
          }
          if (prePendFlag) {
            controller.minYear = yearForAdd;
          }
          else {
            controller.maxYear = yearForAdd;
          }
          view.closeAddForm();          
        }        
        view.updateDayItem({dateEventNew: objEvent.dateEvent, nameEvent: objEvent.nameEvent, descrEvent: objEvent.descrEvent});        
      }
    }
    view.closeAddForm();
  },

  btnCloseAddEventClick: function (e) {
    e.preventDefault();
    view.closeAddForm();
  },

  clickOnDay: function() {        
    let date = this.getAttribute('data-time');
    if (this.getElementsByClassName('day_descr')[0].innerHTML === '') {
      return;
    };
    let dateDescrAll = this.getElementsByClassName('day_descr')[0];
    let eventNameTag = dateDescrAll.getElementsByTagName('span')[0];
    let dateNameTag = dateDescrAll.getElementsByTagName('span')[1];
    let textEventName = eventNameTag !== undefined ? eventNameTag.innerHTML : '';
    let textDateName = dateNameTag !== undefined ? dateNameTag.innerHTML : '';
    let eventDescr = dateDescrAll.textContent.replace(textEventName, '');
    eventDescr = eventDescr.replace(textDateName, '');
    eventDescr = eventDescr.trim();

    if (textDateName !== '') {
      textDateName = textDateName.slice(13);
    }    
    let el = document.getElementsByClassName('edit-form-wrap')[0];
    el.getElementsByClassName('name-event')[0].value = textEventName;
    el.getElementsByClassName('date-time')[0].value = textDateName;    
    el.getElementsByTagName('textarea')[0].innerHTML = eventDescr;

    el.style.cssText = "display: block;";
    let bodyTag = document.getElementsByTagName('body')[0];
    bodyTag.classList.toggle('no-scroll');    

    let btnFormClose = document.getElementById('btn-form-close');
    btnFormClose.onclick = controller.btnFormCloseClick;

    let btnFormEdit = document.getElementsByClassName('btn-form-edit')[0];
    btnFormEdit.onclick = controller.btnFormEditClick.bind(controller);

    let btnFormClear = document.getElementsByClassName('btn-form-clear')[0];
    btnFormClear.onclick = controller.btnFormClearClick.bind(controller);

    let arrNums = textDateName.split(':');    
    let firstNum = Number(arrNums[0]);
    let secondNum = Number(arrNums[1]);

    controller.oldObjectEvent = {  
      nameEvent: textEventName,
      dateEvent: Number(date) + (1000*60*60*firstNum) + (1000*60*secondNum),
      descrEvent: eventDescr                   
    }
  },

  btnFormEditClick: function (e) {
    e.preventDefault();
    let nameEvent = document.getElementsByClassName('name-event')[0].value;
    let time = document.getElementsByClassName('date-time')[0].value;    
    let descrEvent = document.getElementsByTagName('textarea')[0].value; 
    if (nameEvent.trim() !== '' && descrEvent.trim() !== '' && this.checkTime(time)) {
      let arrNums = time.split(':');      
      let firstNum = Number(arrNums[0]);
      let secondNum = Number(arrNums[1]);      
      let dateTmp = new Date(this.oldObjectEvent.dateEvent);
      dateTmp.setHours(firstNum, secondNum, 0);
      let newObjectEvent = {    
        nameEvent: nameEvent,
        dateEvent: Date.parse(`${dateTmp.getMonth()+1} ${dateTmp.getDate()}, ${dateTmp.getFullYear()} ${dateTmp.getHours()}:${dateTmp.getMinutes()}:00`),
        descrEvent: descrEvent
      }      
      model.changeEvent(this.oldObjectEvent, newObjectEvent);
      this.btnFormCloseClick();      
      view.updateDayItem({dateEventNew: newObjectEvent.dateEvent, nameEvent: nameEvent, descrEvent: descrEvent});              
    }
    else {
      alert("проверьте введенные данные");
    }
  },

  btnFormClearClick: function (e) {
    e.preventDefault();
    model.deleteEvent(this.oldObjectEvent);    
    this.btnFormCloseClick();    
    view.updateDayItem({dateEventNew: this.oldObjectEvent.dateEvent, nameEvent: '', descrEvent: '', clearEvent: true});
  },

  checkTime: function(str) {    
    if (str.length !== 5) {
      alert("указано неверное время");
      return false;
    }
    else {
      let arrNums = str.split(':');      
      let firstNum = Number(arrNums[0]);
      let secondNum = Number(arrNums[1]);
      if ( arrNums.length === 2 && Number.isInteger(firstNum) && Number.isInteger(secondNum) && firstNum >= 0 && firstNum < 24 && secondNum >= 0 && secondNum < 60) {        
        return true;
      }
    }
  },

  scrollToResult: function(dataAttr) {
    let hidElemen = document.querySelector(`[data-time="${dataAttr}"]`);    

    hidElemen.scrollIntoView( {block: "center", behavior: "smooth"} );    
    hidElemen.querySelector('.item').classList.add('active');
    setTimeout(function() {
      hidElemen.querySelector('.item').classList.remove('active');
    }, 1500);
  }, 

  scrollYear: function() {
      controller.minYear = controller.minYear === 0 ? model.year : controller.minYear;
      controller.maxYear = controller.maxYear === 0 ? model.year : controller.maxYear;

      let heightWindow = window.innerHeight;
      let scrollTop = window.pageYOffset;
      let heightBody = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight,
      );
      let scrollBottom = heightBody - scrollTop;
      if (scrollTop < heightWindow * 1.5 && !this.flagTop && controller.init) {        
        controller.minYear = controller.minYear - 1;
        view.updateCalendar({year: controller.minYear, curYear: model.year, events: model.events, months: model.months, callBackForDay: controller.clickOnDay, prePend: true});
        this.flagTop = true;        
      }

      if ((scrollTop > heightWindow * 1.5 && this.flagTop) || (scrollBottom > heightWindow * 1.5 && this.flagBottom)) {        
        this.flagTop = false;
        this.flagBottom = false;        
      }

      if (scrollBottom < heightWindow * 1.5 && !this.flagBottom && controller.init) {        
        controller.maxYear = controller.maxYear + 1;
        view.updateCalendar({year: controller.maxYear, curYear: model.year, events: model.events, months: model.months, callBackForDay: controller.clickOnDay, prePend: false});
        this.flagBottom = true;
      }
  },

  searchEventBtnClick: function() {
    let inputField = document.getElementById('search');
    let fieldValue = inputField.value.trim();
    inputField.value = fieldValue;
    let results = model.searchEventByName(fieldValue);
    
    document.body.onclick = function(e) {                        
      if ( !(e.target).closest('.search') || (e.target).closest('.results')) {        
        view.closeResultsSearch();
      }      
    }

    if (results.length !== 0) {      
      view.displayResultsSearch(results, controller.scrollToResult);      
    }    
  }
};

// (function() {
  
	let start = {

		init: function () {			
			start.control();
			start.event();
    },		
    	
		control: function () {      
      let m = model.generateCalendar( controller.clickOnDay );
      view.displayCalendar(m);      
      controller.curDateBtnClick();      
      setTimeout(function() {
        controller.init = true;
      }, 1600);

		},		
		event: function () {

      let curDateBtn = document.getElementById('curDateBtn');
      curDateBtn.onclick = controller.curDateBtnClick;

      let addEventBtn = document.getElementById('addBtn');
      addEventBtn.onclick = controller.addEventBtnClick;

      let searchEventBtn = document.getElementById('searchBtn');
      searchEventBtn.onclick = controller.searchEventBtnClick;
      
      let body = document.body;
      body.onscroll = controller.scrollYear;      
    }
        
  };
  

  // start.init()
window.onload = start.init;

// }());

