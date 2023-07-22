/**
 * @logout
 * Function handles logging the user out
 */
const logout = async () => {
  // the response received from the GET request
  const response = await fetch('/api/auth/logout', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  // if reponse ok
  if (response.ok) {
    // redirect to the home page
    document.location.replace('/');
  } 
  // else if response is not ok
  else {
    // alert prompt with response status text
    alert(response.statusText);
  }
};
// event listeners - on click
document.querySelector('#logout').addEventListener('click', logout);