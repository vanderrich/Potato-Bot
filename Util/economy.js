// var connection;
// const mongoose = require('mongoose');
// const currencyModel = require('./CurrencyModel');

// class economy {

//     /**
//      *
//      * @param {string} url - A MongoDB connection string.
//      */

//     static connect(url) {
//         if (!url) return new TypeError("You didn't provide a MongoDB connection string");

//         connection = url;

//         return mongoose.connect(url, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         });
//     }

//     /**
//      *
//      * @param {string} userId - A valid discord user ID.
//      */

//     static fetchMoney(userId) {
//         return new Promise(async (resolve, reject) => {
//             if (!userId) reject("You didn't provide a user ID.");

//             let user = await currencyModel.findOne({ userId: userId });
//             if (!user.money) user.money = 0;
//             if (!user.moneyInBank) user.moneyInBank = 0;

//             resolve(user || false);
//         });
//     }

//     /**
//      *
//      * @param {string} userId - A discord user ID.
//      * @param {number} amount - Amount of coins to give.
//      */

//     static addMoney(userId, amount) {
//         return new Promise(async (resolve, reject) => {
//             if (!userId) reject("You didn't provide a user ID.");
//             if (!amount) reject("You didn't provide an amount of coins.");
//             if (isNaN(amount)) reject("The amount must be a number.");
//             if (amount < 0) reject("New amount must not be under 0.");

//             let user = await currencyModel.findOne({ userId: userId });

//             if (!user) {
//                 const newData = new currencyModel({
//                     userId: userId,
//                     money: parseInt(amount),
//                     moneyInBank: 0
//                 });

//                 await newData.save()
//                     .catch(err => console.log(err));

//                 resolve(amount);
//             }

//             user.money += parseInt(amount);

//             await user.save()
//                 .catch(err => console.log(err));

//             resolve(amount);
//         });
//     }

//     /**
//      *
//      * @param {string} userId - A discord user ID.
//      * @param {string} amount - Amount of coins to deduct.
//      */

//     static subtractMoney(userId, amount) {
//         return new Promise(async (resolve, reject) => {
//             if (!userId) reject("You didn't provide a user ID.");
//             if (!amount) reject("You didn't provide an amount of coins.");
//             if (isNaN(amount)) reject("The amount must be a number.");
//             if (amount < 0) reject("New amount must not be under 0.");

//             let user = await currencyModel.findOne({ userId: userId });

//             if (!user) {
//                 const newData = new currencyModel({
//                     userId: userId,
//                     money: parseInt(amount),
//                     moneyInBank: 0
//                 });

//                 await newData.save()
//                     .catch(err => console.log(err));

//                 resolve(amount);
//             }
//             if (amount > user.money) {
//                 user.money -= user.money;

//                 await user.save()
//                     .catch(err => console.log(err));

//                 resolve(amount);
//             }

//             user.money -= parseInt(amount);

//             await user.save()
//                 .catch(err => console.log(err));

//             resolve(amount);
//         });
//     }


//     /**
//      *
//      * @param {number} amount - The amount of users to show.
//      */

//     static leaderboard(amount) {
//         return new Promise(async (resolve, reject) => {
//             if (!amount) reject("Please provide the amount of users to show.");
//             if (isNaN(amount)) reject("Amount must be a number");

//             let users = await currencyModel.find({ bot: 'Potato-bot' }).sort([['money', 'descending']]).exec()
//             console.log(users)

//             resolve(users.slice(0, amount));
//         });
//     }

//     /**
//      *
//      * @param {string} userId - A discord user ID to delete.
//      *
//         */
//     static delete(userId) {
//         return new Promise(async (resolve, reject) => {
//             if (!userId) reject("You didn't provide a user ID.");

//             await currencyModel.deleteOne({ userId: userId })
//                 .catch(err => console.log(err));
//             resolve(true);
//         });
//     }

//     /**
//      * @param {string} userId - A discord user ID.
//      * @param {number} amount - Amount to give.
//      */
//     static monthly(userId, amount) {
//         return new Promise(async (resolve, reject) => {
//             if (!userId) reject("You didn't provide a user ID.");
//             if (!amount) reject("You didn't provide an amount of coins.");
//             if (isNaN(amount)) reject("The amount must be a number.");
//             if (amount < 0) reject("New amount must not be under 0.");

//             let user = await currencyModel.findOne({ userId: userId });

//             if (!user) {
//                 user = new currencyModel({
//                     userId: userId,
//                     money: 0,
//                     moneyInBank: 0
//                 });
//             }
//             const cooldownRaw = user.cooldowns.monthly;
//             const cooldown = Util.onCooldown(Util.COOLDOWN.MONTHLY, cooldownRaw);

//             if (cooldown) return { cooldown: true, time: Util.getCooldown(ops.timeout || Util.COOLDOWN.MONTHLY, cooldownRaw ? cooldownRaw.data : 0) };

//             const newAmount = parseInt(amount);
//             await user.save()
//                 .catch(err => console.log(err));
//             user.cooldowns.monthly.time = new Date(Date.now() + 2592000000);
//             resolve({ cooldown: false, time: null, amount: amount, money: newAmount });
//         });
//     }
// }
// class Util {
//     /**
//      * Returns cooldown time object
//      * @param {number} cooldownTime Cooldown timeout
//      * @param {number} collectedTime Collected timestamp
//      * @returns {MS}
//      */
//     static getCooldown(cooldownTime, collectedTime) {
//         if (cooldownTime instanceof Date) cooldownTime = cooldownTime.getTime();
//         if (collectedTime instanceof Date) collectedTime = collectedTime.getTime();
//         if (typeof cooldownTime !== "number") throw new Error(`Expected cooldownTime to be a number, received ${typeof cooldownTime}!`);
//         if (typeof collectedTime !== "number") throw new Error(`Expected collectedTime to be a number, received ${typeof collectedTime}!`);

//         if (collectedTime !== null && cooldownTime - (Date.now() - collectedTime) > 0) return Util.ms(cooldownTime - (Date.now() - collectedTime));
//         return Util.ms(0);
//     }

//     /**
//      * Checks for cooldown
//      * @param {number} cooldownTime Cooldown timeout
//      * @param {number} collectedTime Timestamp when last item was collected
//      * @returns {boolean}
//      */
//     static onCooldown(cooldownTime, collectedTime) {
//         if (cooldownTime instanceof Date) cooldownTime = cooldownTime.getTime();
//         if (collectedTime instanceof Date) collectedTime = collectedTime.getTime();
//         if (typeof cooldownTime !== "number") throw new Error(`Expected cooldownTime to be a number, received ${typeof cooldownTime}!`);
//         if (typeof collectedTime !== "number") throw new Error(`Expected collectedTime to be a number, received ${typeof collectedTime}!`);

//         if (collectedTime !== null && cooldownTime - (Date.now() - collectedTime) > 0) return true;
//         return false;
//     }

//     static get COOLDOWN() {
//         return {
//             DAILY: 86400000,
//             WEEKLY: 604800000,
//             WORK: 2700000,
//             BEG: 60000,
//             MONTHLY: 2628000000,
//             SEARCH: 300000
//         };
//     }
// }

// module.exports = economy;