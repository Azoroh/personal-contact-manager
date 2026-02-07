import { useState, useEffect } from "react";
import "./App.css";

const initialContacts = [
  {
    id: 1,
    name: "Sandra",
    phone: "08035458211",
    email: "sandra@gmail.com",
  },
  {
    id: 2,
    name: "Henry",
    phone: "08035458211",
    email: "Henry1980@gmail.com",
  },
];

export default function App() {
  const [contacts, setContacts] = useState(initialContacts);
  const [selected, setSelected] = useState(null);
  const showDetails = selected ? true : false
  const [showAddForm, setShowAddForm] = useState(false)

  function handleSelected(contactObj) {
    setSelected(selected => selected?.id === contactObj.id ? null : contactObj);
    console.log(selected)
  }

  function handleAddContact(newContact) {
    setContacts(contacts => [...contacts, newContact])
    setShowAddForm(false)
  }

  function handleUpdateContact(updatedContact) {
    setContacts(contacts => contacts.map(contact => contact.id === updatedContact.id ? updatedContact : contact))
    setShowAddForm(false)
    setSelected(null)
  }

  function handleShowAddForm() {
    setShowAddForm(prev => !prev)
    // setSelected(null)
  }

  function handleDelete() {
    setContacts(contacts => contacts.filter(contact => contact.id !== selected.id))
    setSelected(null)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Contacts</h2>
          <button disabled={showAddForm || selected} className="btn" onClick={handleShowAddForm}>Add</button>
        </div>

        {contacts && (
          <ContactList contacts={contacts} onSelect={handleSelected} selected={selected} />
        )}
      </aside>

      <main className="details">

        {!showAddForm && !selected && <div className="empty-state">
          <p>Select a contact to view details</p>
        </div>}

        {(showAddForm) && <ContactForm
          selected={selected}
          onAddContact={handleAddContact}
          onUpdateContact={handleUpdateContact}
          onCancel={handleShowAddForm}
        />}

        {(showDetails && !showAddForm) && <ViewDetails
          selected={selected}
          onDelete={handleDelete}
          onEdit={handleShowAddForm}
        />}
      </main>
    </div>
  );
}

function ContactList({ contacts, onSelect, selected }) {
  return (
    <ul className="contact-list">
      {contacts.map((contact, i) => (
        <Contact key={i} contactObj={contact} onSelect={onSelect} selected={selected} />
      ))}
    </ul>
  );
}

function Contact({ contactObj, onSelect, selected }) {
  const isOpen = contactObj.id === selected?.id

  return (
    <li className={isOpen ? 'contact-item selected' : 'contact-item'} onClick={() => onSelect(contactObj)}>
      {contactObj.name}
    </li>
  );
}

function ViewDetails({ selected, onDelete, onEdit }) {
  return (
    <div className="contact-details">
      <h2>{selected.name}</h2>

      <p><strong>Phone:</strong> {selected.phone}</p>
      <p><strong>Email:</strong> {selected.email}</p>

      <div className="actions">
        <button className="btn" onClick={onEdit}>Edit</button>
        <button className="btn danger" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}

function ContactForm({ onAddContact, onCancel, selected, onUpdateContact }) {
  const [name, setName] = useState(selected?.name || '')
  const [phone, setPhone] = useState(selected?.phone || '')
  const [email, setEmail] = useState(selected?.email || '')

  //just learned useEffect. lets use it to keep watch of selected, and update our form prefilled values when selected changes
  useEffect(() => {
    setName(selected?.name || '')
    setPhone(selected?.phone || '')
    setEmail(selected?.email || '')
  }, [selected])

  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !phone || !email) return

    //if selected is selected and is being edited? then update
    if (selected) {
      onUpdateContact({
        ...selected,
        name,
        phone,
        email
      })
    } else { //else just create the new item

      const newContact = {
        id: crypto.randomUUID(),
        name,
        phone,
        email
      }

      onAddContact(newContact)
    }

    setName('')
    setPhone('')
    setEmail('')
  }

  return (
    <form className="contact-form">
      <h2>Add / Edit Contact</h2>

      <label>Name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>Phone</label>
      <input type="phone" value={phone} onChange={e => setPhone(e.target.value)} />

      <label>Email</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} />

      <div className="actions">
        <button className="btn" onClick={handleSubmit}>Save</button>
        <button className="btn secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
