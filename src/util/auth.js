const OverUnderAuth = {
  async checkAuth() {

    let isAuthed = sessionStorage.getItem('isAuthed');
    if(isAuthed) {
      // return session storage pass
    } else {
      let myToken = localStorage.getItem('overUnderToken');
      if(myToken) {

        // call the API to see if valid
        const authUrl = 'http://localhost:8080/api/validate';
        try {
          let response = await fetch(authUrl, {
            method: 'POST',
            body: JSON.stringify({token: myToken}),
            headers: {
              "Content-type": "application/json",
              "crossDomain": true,
            }
          });
          if (response.ok) {
            let jsonResponse = await response.json();

            if(jsonResponse.success) {

              sessionStorage.setItem('isAuthed', true);
              const { history } = this.props
              history.replace('/overorunder');

              // retrun token auth success

            } else {
              localStorage.removeItem('overUnderToken');
              // not needed by logic, but for completeness
              sessionStorage.removeItem('isAuthed');

              // return token auth fail

            }
          } else {
          // no else for not ok
          // return failed API call!
          }
        } catch (error) {
          console.log(error);
          // return failed API call
        }
      } else {
        // retrun no JWT token
      }
    }
  }
};

export default OverUnderAuth;
