


require('dotenv').config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();
const Customer = require('./customer'); // imports the Customer model we made





// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    main(); // Start the application after a successful connection
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });




 // This is the main function that runs the entire CRM application.
 // It contains a loop that displays the menu and handles user choices.
async function main() {
  let isRunning = true;
  while (isRunning) {
    console.log('\nWelcome to the CRM\n');
    console.log('What would you like to do?');
    console.log('  1. Create a customer');
    console.log('  2. View all customers');
    console.log('  3. Update a customer');
    console.log('  4. Delete a customer');
    console.log('  5. Quit');

    const choice = prompt('Enter the number of the action you would like to select: ');

    switch (choice) {
      case '1':
        await createCustomer();
        break;
      case '2':
        await viewAllCustomers();
        break;
      case '3':
        await updateCustomer();
        break;
      case '4':
        await deleteCustomer();
        break;
      case '5':
        isRunning = false;
        break;
      default:
        console.log('Invalid choice. Please enter a number from 1 to 5.');
        break;
    }
  }

  // When the loop exits, close the database connection
  await mongoose.connection.close();
  console.log('Exiting...');
}


async function createCustomer() { 
    console.log('\n--- Creating a new customer... ---');
    const name = prompt('What is the customer\'s name? ');
    const age = prompt('What is the customer\'s age? ');

    const newCustomer = new Customer ({
        name,
        age
    });

    try {
        await newCustomer.save() // saves new customer to the data base
        console.log('Customer created successfully!');
    } catch (error) {
        console.error('Error creating customer:', error.message);
    }
}


async function viewAllCustomers() {
    console.log('\nViewing all customers... ');
    try {
        const customers = await Customer.find({}); // Finds all customers
        if (customers.length === 0) {
            console.log('No customer found. ');
        } else {
            console.log('Below is a list of customers:');
            customers.forEach(customer => {
                console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`);
            });
        }
    } catch (error) {
        console.error('Error fetching customers:', error.message);
    }
}


async function updateCustomer() {
    console.log('\nUpdating a customer...');
    await viewAllCustomers(); // Shows all the customers to get their ID's

    const idToUpdate = prompt('Please enter the id of the customer you would like to update here: ');
    const newName = prompt('What is the customer\'s new name? ');
    const newAge = prompt('What is the customer\'s new age? ');

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            idToUpdate,
            {name: newName, age: newAge },
            {new: true, runValidators: true} // Returns the updated document and runs the schema validators
        );
        if (updatedCustomer) {
            console.log('Customer updated successfully!');
        } else {
            console.log('Customer not found with ID.');
        }
    } catch (error) {
        console.error('Error updating customer:', error.message);
    }
}


async function deleteCustomer() {
    console.log('\nDeleting a customer...'); 
    await viewAllCustomers(); //Shows all customers

    const idToDelete = prompt('Please enter the ID of the customer you would like to delete here: ');

    try {
        const deletedCustomer = await Customer.findByIdAndDelete(idToDelete);
        if (deletedCustomer) {
            console.log('Customer deleted successfully!');
        } else {
            console.log('Customer was not found with ID.');
        }
    } catch (error) {
        console.error('Error deleting customer:', error.message);
    }
}

