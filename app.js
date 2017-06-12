class App {
  constructor(selectors) {
    this.entries = []
    this.max = 0
    this.list = document
      .querySelector(selectors.listSelector)
    this.template = document
      .querySelector(selectors.templateSelector)
    document
      .querySelector(selectors.formSelector)
      .addEventListener('submit', this.addEntryViaForm.bind(this))

    this.load()
  }

  load() {
    const entriesJSON = localStorage.getItem('entries')

    const entriesArray = JSON.parse(entriesJSON)

    if (entriesArray) {
      entriesArray
        .reverse()
        .map(this.addEntry.bind(this))
    }
  }

  addEntry(entry) {
    const listItem = this.renderListItem(entry)
    this.list
      .insertBefore(listItem, this.list.firstChild)

    if (entry.id > this.max) {
      this.max = entry.id
    }
    this.entries.unshift(entry)
    this.save()
  }

  addEntryViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const entry = {
      id: this.max + 1,
      name: f.entryName.value,
      fav: false,
    }

    this.addEntry(entry)

    f.reset()
  }

  save() {
    localStorage
      .setItem('entries', JSON.stringify(this.entries))

  }

  renderListItem(entry) {
    const item = this.template.cloneNode(true)
    item.classList.remove('template')
    item.dataset.id = entry.id
    item
      .querySelector('.entry-name')
      .textContent = entry.name
    item
      .querySelector('.entry-name')
      .setAttribute('title', entry.name)

    if (entry.fav) {
      item.classList.add('fav')
    }

    item
      .querySelector('.entry-name')
      .addEventListener('keypress', this.saveOnEnter.bind(this, entry))

    item
      .querySelector('button.remove')
      .addEventListener('click', this.removeEntry.bind(this))
    item
      .querySelector('button.fav')
      .addEventListener('click', this.favEntry.bind(this, entry))
    item
      .querySelector('button.edit')
      .addEventListener('click', this.edit.bind(this, entry))

    return item
  }

  removeEntry(ev) {
    const listItem = ev.target.closest('.entry')

    for (let i = 0; i < this.entries.length; i++) {
      const currentId = this.entries[i].id.toString()
      if (listItem.dataset.id === currentId) {
        this.entries.splice(i, 1)
        break
      }
    }

    listItem.remove()
    this.save()
  }

  favEntry(entry, ev) {
    console.log(ev.currentTarget)
    const listItem = ev.target.closest('.entry')
    entry.fav = !entry.fav

    if (entry.fav) {
      listItem.classList.add('fav')
    } else {
      listItem.classList.remove('fav')
    }

    this.save()
  }

  edit(entry, ev) {
    const listItem = ev.target.closest('.entry')
    const nameField = listItem.querySelector('.entry-name')
    const btn = listItem.querySelector('.edit.button')

    const icon = btn.querySelector('i.fa')

    if (nameField.isContentEditable) {
      // make it no longer editable
      nameField.contentEditable = false
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      btn.classList.remove('success')

      // save changes
      entry.name = nameField.textContent
      this.save()
    } else {
      nameField.contentEditable = true
      nameField.focus()
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      btn.classList.add('success')
    }
  }

  saveOnEnter(entry, ev) {
    if (ev.key === 'Enter') {
      this.edit(entry, ev)
    }
  }
}

const app = new App({
  formSelector: '#entry-form',
  listSelector: '#entry-list',
  templateSelector: '.entry.template',
})
