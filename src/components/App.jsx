import { useEffect, useState, useRef } from 'react';
import shortid from 'shortid';
import style from './App.module.css';
import Section from './Section/Section';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContactList';
import Filter from './Filter/Filter';

export const App = () => {

  const [contacts, setContacts] = useState([
    { id: shortid(), name: "Rosie Simpson", number: "459-12-56" },
    { id: shortid(), name: "Hermione Kline", number: "443-89-12" },
    { id: shortid(), name: "Eden Clements", number: "645-17-79" },
    { id: shortid(), name: "Annie Copeland", number: "227-91-26" },
  ]);
  const [filter, setFilter] = useState("");
  const isFirstRender = useRef(true);

  // Este método se ejecuta después de que el componente se monta en el DOM.
  useEffect(() => {
    // Intentamos obtener los contactos almacenados en el local storage.
    const storedContacts = localStorage.getItem("contacts");

    if (storedContacts) {
      // Si hay contactos almacenados, los parseamos y los establecemos en el estado de la aplicación.
      const parsedContacts = JSON.parse(storedContacts);
      if (parsedContacts.length) {
        setContacts([...parsedContacts]);
      }
    }
  }, []);

  // Saving contacts to local storage
  useEffect(() => {
    if (!isFirstRender.current) {
      window.localStorage.setItem('contacts', JSON.stringify(contacts));
    }
    isFirstRender.current = false;
  }, [contacts]);


  const formSubmitHandler = (data) => {
    renderContact(data);
  };

  const renderContact = (data) => {
    let nameArray = [];
    nameArray = contacts.map((cur) => cur.name);
    if (!nameArray.includes(data.name)) {
      let arrayCont = [];
      arrayCont = [
        ...contacts,
        { id: shortid(), name: data.name, number: data.number },
      ];
      return setContacts(arrayCont);
    } else {
      alert(`${data.name} is already in contacts`);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const getFilteredContacts = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  const deleteContact = (id) => {
    const updatedContacts = contacts.filter((contact) => contact.id !== id);

    setContacts(updatedContacts);
  };

  const filteredContacts = getFilteredContacts();


    return (
      <div className={style.container}>
        <Section title="Directorio Telefónico">
          <ContactForm onSubmit={formSubmitHandler} />
        </Section>

        <Section title="Contactos">
          <Filter value={filter} onChange={handleFilterChange} />
          <div className={style.allContacts}>Contactos: {contacts.length}</div>
          <ContactList
            contacts={filteredContacts}
            onDeleteContact={deleteContact}
          />
        </Section>
      </div>
    );
  }
