const fcm = require('fcm-notification');
const FCM = new fcm('./medeves-c81fe-firebase-adminsdk.json');
const token = 'dpEgxbBWcU0:APA91bGYYri8TMvOIEIvfej6KqjKXZ8RCRUN8llOqwoeRHY7h6RPejLh4oP-1uaAJIX3n9LIrA_rh9P5YZ12hP6azGhrZcWtP71q4ieDjmhPlNPyoZG8X5fNVgpCKQ8RBy-BcPrwAXWP';
 
    const message = {
      android: {
        ttl: 3600 * 1000, // 1 hour in milliseconds
        priority: 'high',
        notification: {
          title: '$GOOG up 1.43% on the day',
          body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.',
          icon: 'stock_ticker_update',
          color: '#f45342',
          sound: 'default',
        }
      },
      token : token,
    };
 
FCM.send(message, function(err, response) {
    if(err){
        console.log('error found', err);
    }else {
        console.log('response here', response);
    }
})