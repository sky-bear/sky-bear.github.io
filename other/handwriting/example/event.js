
class EventCommon {
  constructor(element) {
    if(!this.element) {
      throw new Error('element is required')
    }
    this.element = element
  }
  addEvent(type, handler) {
    if(this.element.addEventListener) {
      this.element.addEventListener(type, handler)
    } else if(this.element.attachEvent)  {
      this.element.attachEvent('on' + type, handler.bind(this.element))
    } else {
      this.element['on' + type] = handler
    }
  }

  removeEvent(type, handler) {
    if(this.element.removeEventListener) {
      this.element.removeEventListener(type, handler)
    } else if(this.element.detachEvent)  {
      this.element.detachEvent('on' + type, handler)
    } else {
      this.element['on' + type] = null
    }
  }

  // 取消事件默认行文
  preventDefault(e) {
    if(e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false
    }
  }
  // 阻止事件冒泡
  stopPropagation(e) {
    if(e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
  }
}