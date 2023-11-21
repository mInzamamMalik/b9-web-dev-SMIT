

import chai from 'chai';
import supertest from 'supertest';
import app from './server.mjs';

const expect = chai.expect;
const request = supertest(app);

before(function (done) {
  // Increase the timeout dynamically to allow for the 10-second delay
  this.timeout(15000); // Set a timeout of 15 seconds for this hook

  // Introduce a delay of 10 seconds using setTimeout
  setTimeout(() => {
    done(); // Signal that the delay is over and tests can proceed
  }, 5000); // 10000 milliseconds = 10 seconds
});



describe('POST /api/v1/login', () => {

  it('should return 403 on no param', async () => {
    const response = await request.post('/api/v1/login');
    expect(response.status).to.equal(403);
  });

  it('shold return 401 on incorrect password', async () => {
    const response = await request.post('/api/v1/login')
      .send({
        email: "malikasinger@gmail.com",
        password: "1234567890" // wrong password
      })

    expect(response.status).to.equal(401);
  });


  it('should return 200 on correct email pass', async () => {
    const response = await request.post('/api/v1/login')
      .send({
        email: "malikasinger@gmail.com",
        password: "12345"
      })

    expect(response.status).to.equal(200);

    // Check if a token is present in the response cookies
    const cookies = response.headers['set-cookie'];
    
    if (cookies) {
      // Parse the cookies to find the token
      const tokenCookie = cookies.find(cookie => cookie.includes('token'));
      expect(tokenCookie).to.exist; 

      const isHttpOnly = cookies.find(cookie => cookie.includes('HttpOnly'));
      expect(isHttpOnly).to.exist;

      const isSecureCookie = cookies.find(cookie => cookie.includes('Secure'));
      expect(isSecureCookie).to.exist; 
    } else {
      // Handle the case where no cookies are present in the response
      throw new Error('Invalid cookies in response');
    }
  });

});




