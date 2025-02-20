const mongoose = require('mongoose');

// Определение схемы для заказа
const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, // Ссылка на пользователя (User)
    ref: 'User', 
    required: true 
  },
  username: { 
    type: String, 
    required: true 
  }, // Имя пользователя для удобства отображения
  orderItems: [ 
    { 
      bookId: { 
        type: mongoose.Schema.Types.ObjectId, // Ссылка на книгу (Book)
        ref: 'Book', 
        required: true 
      },
      bookTitle: { 
        type: String, 
        required: true 
      }, // Название книги
      bookPrice: { 
        type: Number, 
        required: true 
      }, // Цена книги на момент оформления заказа
      quantity: { 
        type: Number, 
        required: true, 
        default: 1 
      } // Количество экземпляров книги
    }
  ],
  totalCost: { 
    type: Number, 
    required: true 
  }, // Общая стоимость заказа
  orderDate: { 
    type: Date, 
    default: Date.now 
  }, // Дата создания заказа
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'canceled'], 
    default: 'pending' 
  } // Статус заказа
});

// Экспортируем модель заказа
module.exports = mongoose.model('Order', orderSchema);
