const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Reference to the user (User )
    ref: 'User ', 
    required: true // This field is required
  },
  username: { 
    type: String, 
    required: true // Username for convenience in display
  },
  orderItems: [ 
    { 
      bookId: { 
        type: mongoose.Schema.Types.ObjectId, // Reference to the book (Book)
        ref: 'Book', 
        required: true // This field is required
      },
      bookTitle: { 
        type: String, 
        required: true // Title of the book
      },
      bookPrice: { 
        type: Number, 
        required: true // Price of the book at the time of order
      },
      quantity: { 
        type: Number, 
        required: true, // This field is required
        default: 1 // Default quantity is 1
      } // Number of copies of the book
    }
  ],
  totalCost: { 
    type: Number, 
    required: true // Total cost of the order
  },
  orderDate: { 
    type: Date, 
    default: Date.now // Date of order creation, defaults to the current date
  },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'], // Possible statuses for the order
    default: 'pending' // Default status is 'pending'
  }
});

// Export the order model
module.exports = mongoose.model('Order', orderSchema);