import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {ContactDetails} from './models/ContactDetails';

const databaseName = 'contact_App.db';
const location = 'default';

enablePromise(true);

// create a database instance and open an connection

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  console.log('hii1........');
  return openDatabase({
    name: 'contact_App.db',
    location: 'default',
  });
};

export const createTable = async (db: SQLiteDatabase): Promise<void> => {
  console.log('hii2........');
  const createQuery =
    'CREATE TABLE IF NOT EXISTS contactDetailApp(' +
    'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
    'name TEXT NOT NULL,' +
    'image TEXT NOT NULL,' +
    'mobileNo INTEGER NOT NULL,' +
    'landlineNo INTEGER NOT NULL,' +
    'isFavourite BOOLEAN NOT NULL' +
    ')';

  try {
    await db.executeSql(createQuery);
  } catch (error) {
    throw error;
  }
};

export const insertContactDetails = async (
  db: SQLiteDatabase,
  contactDetails: ContactDetails,
) => {
  const insertQuery =
    'INSERT INTO contactDetailApp( name, mobileNo, landlineNo, isFavourite, image) VALUES(?, ?, ?, ?, ?)';

  const param = [
    contactDetails.name,
    contactDetails.mobileNo,
    contactDetails.landlineNo,
    contactDetails.isFavourite,
    contactDetails.image,
  ];

  try {
    await db.executeSql(insertQuery, param);
  } catch (error) {
    throw error;
  }
};

export const getAllContacts = async (
  db: SQLiteDatabase,
): Promise<ContactDetails[]> => {
  const getQuery = 'SELECT * FROM contactDetailApp ORDER BY name ASC';

  try {
    const ContactLists: ContactDetails[] = [];

    const contacts = await db.executeSql(getQuery);
    contacts.forEach(contact => {
      for (let i = 0; i < contact.rows.length; i++) {
        ContactLists.push(contact.rows.item(i));
      }
    });

    return ContactLists;
  } catch (error) {
    throw error;
  }
};

export const getAllFavouriteContacts = async (
  db: SQLiteDatabase,
): Promise<ContactDetails[]> => {
  const getQuery = `SELECT * FROM contactDetailApp WHERE isFavourite=?  ORDER BY name ASC`;

  try {
    const ContactLists: ContactDetails[] = [];

    const contacts = await db.executeSql(getQuery, [true]);
    contacts.forEach(contact => {
      for (let i = 0; i < contact.rows.length; i++) {
        ContactLists.push(contact.rows.item(i));
      }
    });

    return ContactLists;
  } catch (error) {
    throw error;
  }
};

export const updateContactDetails = async (
  db: SQLiteDatabase,
  contactDetails: ContactDetails,
) => {
  const updateQuery =
    'UPDATE contactDetailApp SET name=?, image=?, mobileNo=?, landlineNo=?, isFavourite=? WHERE rowid=?';

  const param = [
    contactDetails.name,
    contactDetails.image,
    contactDetails.mobileNo,
    contactDetails.landlineNo,
    contactDetails.isFavourite,
    contactDetails.id,
  ];

  try {
    await db.executeSql(updateQuery, param);
  } catch (error) {
    throw error;
  }
};

export const removeFavourite = async (db: SQLiteDatabase, id: number) => {
  const updateQuery = 'UPDATE contactDetailApp SET isFavourite=? WHERE rowid=?';

  const param = [false, id];

  try {
    await db.executeSql(updateQuery, param);
  } catch (error) {
    throw error;
  }
};

export const deleteContactDetails = async (db: SQLiteDatabase, id: number) => {
  const updateQuery = 'DELETE FROM contactDetailApp WHERE rowid=?';

  const param = [id];

  try {
    await db.executeSql(updateQuery, param);
  } catch (error) {
    throw error;
  }
};
