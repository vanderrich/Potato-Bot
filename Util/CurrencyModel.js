// const mongoose = require('mongoose');

// const CurrencySchema = new mongoose.Schema({
//     userId: String,
//     money: { type: Number, default: 0 },
//     moneyInBank: { type: Number, default: 0 },
//     inv: { type: Array, default: [] },
//     cooldowns: {
//         type: Object, default: {
//             daily: {
//                 time: new Date(Date.now())
//             },
//             weekly: {
//                 time: new Date(Date.now())
//             },
//             monthly: {
//                 time: new Date(Date.now())
//             },
//             beg: {
//                 time: new Date(Date.now())
//             }
//         }
//     }
// });

// module.exports = mongoose.model('currency', CurrencySchema);