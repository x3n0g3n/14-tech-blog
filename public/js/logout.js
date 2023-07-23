const chessLogout = async () => {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    document.location.replace('/');
  } else {
    alert('Failed to log out.'); 
  }
};
const chessLogoutButton = document.querySelector('#chess-logout');
if (chessLogoutButton) {
  chessLogoutButton.addEventListener('click', chessLogout);
}
