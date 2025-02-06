let tickCount = 0

let events = {}
let headings = []

/*
JSON.stringify(object)
'{"headings": ["Jerry", "Skye"]}'

JSON.parse(string)
{"headings": ["Jerry", "Skye"]}
*/

function updateLocalStorage() {
  localStorage["stringyEvents"] = JSON.stringify(events)
  localStorage["stringyHeadings"] = JSON.stringify(headings)
  localStorage["saveTick"] = tickCount
}

function restoreLocalStorage() {
  events = JSON.parse(localStorage["stringyEvents"])
  headings = JSON.parse(localStorage["stringyHeadings"])
  tickCount = parseInt(localStorage["saveTick"])
  updateEventList ()
  updateHeadingDropdown ()
}

function clearLocalStorage () {
  localStorage["stringyEvents"] = "{}"
  localStorage["stringyHeadings"] = "[]"
}

function incrementTick() {
  tickCount++
  document.getElementById('tickCounter').innerText = tickCount
  updateLocalStorage()
  checkEvents()
  updateEventList()
}

function decrementTick() {
  if (tickCount > 0) {
    tickCount--
    document.getElementById('tickCounter').innerText = tickCount
    updateLocalStorage()
    checkEvents()
    updateEventList()
  }
}

function resetCounter() {
  tickCount = 0
  events = {}
  document.getElementById('tickCounter').innerText = tickCount
  updateLocalStorage()
  updateEventList()
}

function clearTriggeredEvents() {
  for (let heading in events) {
    events[heading] = events[heading].filter(event => !event.triggered)
  }
  updateLocalStorage()
  updateEventList()
}

function toggleRecurring() {
  const recurringRateInput = document.getElementById('recurringRate')
  recurringRateInput.style.display = document.getElementById('recurring')
    .checked
    ? 'inline'
    : 'none'
}

function addEvent() {
  const heading = document.getElementById('headingDropdown').value
  const name = document.getElementById('eventName').value
  const ticks = parseInt(document.getElementById('eventTicks').value)
  const recurring = document.getElementById('recurring').checked
  const recurringRate = recurring
    ? parseInt(document.getElementById('recurringRate').value)
    : null

  if (name && ticks > 0 && (!recurring || (recurring && recurringRate > 0))) {
    if (!events[heading]) {
      events[heading] = []
    }
    events[heading].push({
      name,
      triggerTick: tickCount + ticks,
      triggered: false,
      recurring,
      recurringRate
    })
    events[heading].sort((a, b) => a.triggerTick - b.triggerTick)
    updateLocalStorage()
    updateEventList()
  }
}

function checkEvents() {
  for (let heading in events) {
    events[heading].forEach(event => {
      if (event.triggerTick === tickCount) {
        addAlertDiv('Event Triggered: ' + event.name)
        event.triggered = true
        if (event.recurring) {
          events[heading].push({
            name: event.name,
            triggerTick: tickCount + event.recurringRate,
            triggered: false,
            recurring: true,
            recurringRate: event.recurringRate
          })
          events[heading].sort((a, b) => a.triggerTick - b.triggerTick)
        }
      }
    })
  }
  updateLocalStorage()
  updateEventList()
}

function addAlertDiv(alertText) {
  let myAlertDiv = document.createElement('div')
  myAlertDiv.classList.add('my-alert')
  myAlertDiv.innerHTML = `
      <p>${alertText}</p>
      <button onclick="closeAlert(this);">Close</button>
  `
  document.querySelector('#my-alerts').appendChild(myAlertDiv)
  document.querySelector('#my-alerts-background').classList.add('show')
  document.querySelector('#my-alerts').classList.add('show')
}

function closeAlert(element) {
  element.parentElement.remove()
  if (document.querySelectorAll('.my-alert').length === 0) {
    document.querySelector('#my-alerts-background').classList.remove('show')
    document.querySelector('#my-alerts').classList.remove('show')
  }
}

function deleteEvent(heading, index) {
  events[heading].splice(index, 1)
  updateLocalStorage()
  updateEventList()
}

function deleteHeading(heading) {
  delete events[heading]
  headings = headings.filter(h => h !== heading)
  updateLocalStorage()
  updateHeadingDropdown()
  updateEventList()
}

function updateEventList() {
  const timelinesDiv = document.getElementById('timelines')
  timelinesDiv.innerHTML = ''
  for (let heading in events) {
    const headingElement = document.createElement('div')
    headingElement.className = 'heading'
    headingElement.innerHTML = `${heading} <button onclick="deleteHeading('${heading}')">Delete Heading</button>`
    timelinesDiv.appendChild(headingElement)
    events[heading].forEach((event, index) => {
      const eventElement = document.createElement('div')
      eventElement.className = 'event' + (event.triggered ? ' triggered' : '')
      eventElement.innerHTML = `<p>${event.name} (Tick ${event.triggerTick})</p><button onclick="deleteEvent('${heading}', ${index})">Delete</button>`
      timelinesDiv.appendChild(eventElement)
    })
  }
}

function addHeading() {
  const newHeading = document.getElementById('newHeadingName').value
  if (newHeading && !headings.includes(newHeading)) {
    headings.push(newHeading)
    updateLocalStorage()
    updateHeadingDropdown()
  }
}

function updateHeadingDropdown() {
  const dropdown = document.getElementById('headingDropdown')
  dropdown.innerHTML = ''
  headings.forEach(heading => {
    const option = document.createElement('option')
    option.value = heading
    option.innerText = heading
    dropdown.appendChild(option)
  })
}

// Initialize the dropdown with default headings
restoreLocalStorage()
document.getElementById("tickCounter").innerText = tickCount
