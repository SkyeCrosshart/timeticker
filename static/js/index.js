let tickCount = 0
let events = []

function incrementTick () {
  tickCount++
  document.getElementById('tickCounter').innerText = tickCount
  checkEvents()
}

function decrementTick () {
  if (tickCount > 0) {
    tickCount--
    document.getElementById('tickCounter').innerText = tickCount
    checkEvents()
  }
}

function resetCounter () {
  tickCount = 0
  events = []
  document.getElementById('tickCounter').innerText = tickCount
  updateEventList()
}

function clearTriggeredEvents () {
  events = events.filter(event => !event.triggered)
  updateEventList()
}

function toggleRecurring () {
  const recurringRateInput = document.getElementById('recurringRate')
  recurringRateInput.style.display = document.getElementById('recurring')
    .checked
    ? 'inline'
    : 'none'
}

function addEvent () {
  const name = document.getElementById('eventName').value
  const ticks = parseInt(document.getElementById('eventTicks').value)
  const recurring = document.getElementById('recurring').checked
  const recurringRate = recurring
    ? parseInt(document.getElementById('recurringRate').value)
    : null
  if (name && ticks > 0 && (!recurring || (recurring && recurringRate > 0))) {
    events.push({
      name,
      triggerTick: tickCount + ticks,
      triggered: false,
      recurring,
      recurringRate
    })
    events.sort((a, b) => a.triggerTick - b.triggerTick) // Sort chronologically
    updateEventList()
  }
}

function checkEvents () {
  events.forEach(event => {
    if (event.triggerTick === tickCount) {
      alert('Event Triggered: ' + event.name)
      event.triggered = true
      if (event.recurring) {
        events.push({
          name: event.name,
          triggerTick: tickCount + event.recurringRate,
          triggered: false,
          recurring: true,
          recurringRate: event.recurringRate
        })
        events.sort((a, b) => a.triggerTick - b.triggerTick)
      }
    }
  })
  updateEventList()
}

function deleteEvent (index) {
  events.splice(index, 1)
  updateEventList()
}

function updateEventList () {
  const timelineDiv = document.getElementById('timeline')
  timelineDiv.innerHTML = ''
  events.forEach((event, index) => {
    const eventElement = document.createElement('div')
    eventElement.className = 'event' + (event.triggered ? ' triggered' : '')
    eventElement.innerHTML = `${event.name} (Tick ${event.triggerTick}) <button onclick="deleteEvent(${index})">Delete</button>`
    timelineDiv.appendChild(eventElement)
    if (index < events.length - 1) {
      const marker = document.createElement('div')
      marker.className = 'timeline-marker'
      timelineDiv.appendChild(marker)
    }
  })
}
