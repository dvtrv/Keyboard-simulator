import { words } from './words.js'

class App {
  constructor(container) {
    this.statusWins = container.querySelector('.status__wins')
    this.statusLoss = container.querySelector('.status__loss')
    this.statusTime = container.querySelector('.status__time')
    this.timer = null
    this.wordElement = container.querySelector('.word')
    this.symbolCollection = this.wordElement.getElementsByClassName('symbol')
    this.reset()
    this.listening()
  }

  reset() {
    this.renderWord()
  }

  renderWord() {
    this.word = words[Math.floor(Math.random() * words.length)]
    this.wordSpan = [...this.word]
      .map((s, i) =>
        `<span class="${i === 0 ? 'symbol symbol_current' : 'symbol'}">${s}</span>`
      ).join('')
    this.wordElement.innerHTML = this.wordSpan
    this.symbolCollection = this.wordElement.getElementsByClassName('symbol')
    this.currentSymbol = this.wordElement.querySelector('.symbol_current')
    this.setTimer()
  }

  listening() {
    this.overhearing = (event) => {
      this.overheardKey = event.key
      this.checkSymbol()
    }
    document.addEventListener('keydown', this.overhearing)
  }

  checkSymbol() {
    if (this.overheardKey === this.currentSymbol.textContent) {
      this.correctSymbol()
    } else {
      this.incorrectSymbol()
    }
  }

  correctSymbol() {
    this.currentSymbol.classList.add('symbol_correct')
    this.currentSymbol.classList.remove('symbol_current')

    if (this.currentSymbol.nextElementSibling) {
      this.currentSymbol.nextElementSibling.classList.add('symbol_current')
      this.currentSymbol = this.currentSymbol.nextElementSibling
    } else {
      let currentWins = parseInt(this.statusWins.textContent, 10) || 0
      this.statusWins.textContent = currentWins + 1
      this.renderWord()
    }
  }

  incorrectSymbol() {
    const intervalId = setInterval(() => {
      this.currentSymbol.classList.toggle('word_incorrect')
    }, 200)
    document.removeEventListener('keydown', this.overhearing)
    setTimeout(() => {
      clearInterval(intervalId)
      this.renderWord()
      this.listening()
      let currentLoss = parseInt(this.statusLoss.textContent, 10) || 0
      this.statusLoss.textContent = currentLoss + 1
    }, 1200)
  }

  setTimer() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    const nowTime = Date.now()
    const sec = this.symbolCollection.length
    const endTime = nowTime + sec * 1000

    this.timer = setInterval(() => {
      const leftTime = Math.floor(endTime - Date.now())

      const seconds = Math.floor(leftTime / 1000)
      const milliseconds = Math.floor(leftTime % 1000)
      this.timerFormat = `${seconds}.${milliseconds}`
      this.statusTime.textContent = this.timerFormat

      if (leftTime <= 0) {
        clearInterval(this.timer)
        this.statusTime.textContent = '0'
        this.incorrectSymbol()
      }
    }, 10)
  }
}

new App(document.getElementById('app'))
